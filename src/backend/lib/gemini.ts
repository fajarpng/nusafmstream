import { getStationById, searchRadioStations, toFavorite } from "@/backend/lib/radioBrowser"
import { ChatMessage, ChatResult, FavoriteStation, RadioCandidate } from "@/utils/types"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"
const MAX_TOOL_ROUNDS = 5

const SYSTEM_PROMPT = `You are the assistant for Nusa FM Stream, an internet radio app focused on Indonesian stations. You help users find radio stations and add them to their favorites.

Rules:
- Never invent station names, stream URLs or image URLs. Only use data returned by the tools.
- To find a specific station, call searchRadioStations with the station name only, without the city (e.g. "Hard Rock FM", not "Hard Rock FM Bandung"). Use location words from the user to pick among results by their country and state.
- If the user asks for recommendations or a kind of music rather than a named station, call searchRadioStations with a genre tag (e.g. "jazz", "dangdut", "pop", "news") and suggest a few different stations from the results. Never default to a station the user did not ask for.
- If the user wants to add a station and exactly one valid result clearly matches, call addStationToFavorites with its id.
- If several results could match, list them briefly (name and location) and ask which one the user means. Do not guess.
- If there are no results, say: "I couldn't find a matching radio station."
- If the matching station is not valid, say: "I found the station, but its streaming information is unavailable." and suggest searching for another.
- Search results are not remembered between messages, so search again when the user clarifies.
- Reply briefly in the user's language (English or Indonesian), as plain text without markdown.`

const TOOLS = [ {
  functionDeclarations: [
    {
      name: "searchRadioStations",
      description: "Search the Radio Browser directory for radio stations by name. Returns real station candidates with their id, name, location and whether they are valid to add.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Station name to search for, without the city" },
          tag: { type: "string", description: "Genre tag to search by instead of a name, for recommendations, e.g. \"jazz\"" },
        },
      },
    },
    {
      name: "addStationToFavorites",
      description: "Add a station to the user's favorites. The id must come from a searchRadioStations result in this conversation.",
      parameters: {
        type: "object",
        properties: { id: { type: "string", description: "The station id from searchRadioStations" } },
        required: [ "id" ],
      },
    },
  ],
} ]

type Part = {
  text?: string
  functionCall?: { id?: string, name: string, args?: Record<string, unknown> }
  functionResponse?: { id?: string, name: string, response: Record<string, unknown> }
}
type Content = { role: "user" | "model", parts: Part[] }

const generateContent = async (contents: Content[]): Promise<Content> => {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not defined")

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [ { text: SYSTEM_PROMPT } ] }, contents, tools: TOOLS }),
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`)

  const data = await res.json()
  const content = data?.candidates?.[0]?.content
  return { role: "model", parts: content?.parts || [] }
}

// onAdd persists the validated station; the model only reports success if it doesn't throw
// eslint-disable-next-line no-unused-vars
export const runChat = async (history: ChatMessage[], onAdd: (station: FavoriteStation) => Promise<unknown>): Promise<ChatResult> => {
  const contents: Content[] = history.map(m => ({ role: m.role, parts: [ { text: m.text } ] }))
  let candidates: RadioCandidate[] = []
  let added: FavoriteStation | null = null

  const runTool = async (name: string, args: Record<string, unknown> = {}) => {
    if (name === "searchRadioStations") {
      candidates = await searchRadioStations(String(args.query || ""), args.tag ? String(args.tag) : undefined)
      // Stream/image URLs are left out so the model has nothing to copy into its reply
      return { results: candidates.map(({ id, name, country, state, codec, bitrate, valid, invalidReason }) => ({ id, name, country, state, codec, bitrate, valid, invalidReason })) }
    }
    if (name === "addStationToFavorites") {
      // Re-fetch by id instead of trusting anything the model passes along
      const station = await getStationById(String(args.id || ""))
      if (!station) return { ok: false, error: "Station not found" }
      if (!station.valid) return { ok: false, error: station.invalidReason }
      try {
        await onAdd(toFavorite(station))
      } catch (error) {
        console.error(error)
        return { ok: false, error: "Saving the station failed" }
      }
      added = toFavorite(station)
      return { ok: true, name: station.name }
    }
    return { ok: false, error: `Unknown tool: ${name}` }
  }

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const reply = await generateContent(contents)
    const calls = reply.parts.filter(p => p.functionCall).map(p => p.functionCall!)

    if (!calls.length) {
      const text = reply.parts.map(p => p.text || "").join("").trim()
      return { reply: text || "Sorry, I couldn't process that.", candidates: added ? [] : candidates.filter(c => c.valid), added }
    }

    // Keep the model turn as returned so thought signatures survive the round trip
    contents.push(reply)
    const responses: Part[] = []
    for (const call of calls) {
      responses.push({ functionResponse: { id: call.id, name: call.name, response: await runTool(call.name, call.args) } })
    }
    contents.push({ role: "user", parts: responses })
  }

  return { reply: "Sorry, that took too many steps. Please try again.", candidates: [], added }
}
