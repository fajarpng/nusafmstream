import { saveStationAsFavorite } from "@/backend/lib/favorites"
import { runChat } from "@/backend/lib/gemini"
import { checkChatLimit } from "@/backend/lib/rateLimit"
import { getVisitorId } from "@/backend/lib/visitor"
import { ChatMessage, ResponseSuccess } from "@/utils/types"
import type { NextApiRequest, NextApiResponse } from "next"

const MAX_HISTORY = 12
const MAX_TEXT_LENGTH = 1000

const parseHistory = (body: any): ChatMessage[] | null => {
  // Accept a single { message } or the running { messages } history
  const raw = Array.isArray(body?.messages) ? body.messages : [ { role: "user", text: body?.message } ]
  const history = raw.slice(-MAX_HISTORY).map((m: any) => ({
    role: m?.role === "model" ? "model" : "user",
    text: typeof m?.text === "string" ? m.text.slice(0, MAX_TEXT_LENGTH) : "",
  })).filter((m: ChatMessage) => m.text.trim())

  if (!history.length || history[history.length - 1].role !== "user") return null
  return history
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseSuccess>) {
  if (req.method !== "POST") return res.status(405).json({ data: {}, message: `Unsupported HTTP method: ${req.method}` })

  const history = parseHistory(req.body)
  if (!history) return res.status(400).json({ data: {}, message: "A user message is required" })

  const visitorId = getVisitorId(req, res)
  try {
    const limitMessage = await checkChatLimit(req, visitorId)
    if (limitMessage) return res.status(429).json({ data: {}, message: limitMessage })

    const data = await runChat(history, station => saveStationAsFavorite(visitorId, station))
    res.status(200).json({ data, message: "success" })
  } catch (error) {
    console.error(error)
    res.status(502).json({ data: {}, message: "The assistant is unavailable right now. Please try again." })
  }
}
