import { FavoriteStation, RadioCandidate } from "@/utils/types"

const BASE_URL = "https://all.api.radio-browser.info/json"
const HEADERS = { "User-Agent": "NusaFMStream/1.0" }
const SEARCH_LIMIT = 10

type RadioBrowserStation = {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  favicon: string
  country: string
  state: string
  codec: string
  bitrate: number
}

const isUrl = (value: string, protocols: string[]) => {
  try {
    return protocols.includes(new URL(value).protocol)
  } catch {
    return false
  }
}

// Backend is the trust boundary: only stations that pass this can be saved
export const validateStation = (station: FavoriteStation): string | null => {
  if (!station.name) return "Station name is required"
  if (!station.streamUrl) return "Station stream URL is required"
  // The site is served over https, so http streams would be blocked as mixed content
  if (!isUrl(station.streamUrl, [ "https:" ])) return "Station stream URL must be https"
  if (!station.imageUrl) return "Station image URL is required"
  if (!isUrl(station.imageUrl, [ "https:", "http:" ])) return "Station image URL is invalid"
  return null
}

const toCandidate = (s: RadioBrowserStation): RadioCandidate => {
  const station: FavoriteStation = {
    name: s.name?.trim(),
    streamUrl: (s.url_resolved || s.url)?.trim(),
    imageUrl: s.favicon?.trim(),
  }
  const invalidReason = validateStation(station)
  return {
    id: s.stationuuid,
    ...station,
    country: s.country,
    state: s.state,
    codec: s.codec,
    bitrate: s.bitrate,
    valid: !invalidReason,
    ...(invalidReason && { invalidReason }),
  }
}

const fetchStations = async (path: string, params?: Record<string, string>) => {
  const url = `${BASE_URL}${path}${params ? `?${new URLSearchParams(params)}` : ""}`
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Radio Browser request failed: ${res.status}`)
  return (await res.json()) as RadioBrowserStation[]
}

const searchStations = (params: Record<string, string>) => fetchStations("/stations/search", {
  ...params,
  limit: String(SEARCH_LIMIT),
  hidebroken: "true",
  order: "clickcount",
  reverse: "true",
})

// Shuffle array in place (Fisher-Yates) for variety in search results
const shuffle = <T, >(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ arr[i], arr[j] ] = [ arr[j], arr[i] ]
  }
  return arr
}

// "Prambors Jakarta" matches nothing by name, so drop trailing words until something does
// With a tag (genre), recommendations come from Indonesian stations in that genre
export const searchRadioStations = async (query: string, tag?: string): Promise<RadioCandidate[]> => {
  if (tag) return shuffle(await searchStations({ tag: tag.toLowerCase(), countrycode: "ID" })).map(toCandidate)

  const words = query.trim().split(/\s+/).filter(Boolean)
  for (let n = words.length; n > 0; n--) {
    const results = await searchStations({ name: words.slice(0, n).join(" ") })
    if (results.length) return shuffle(results).map(toCandidate)
  }
  return []
}

export const getStationById = async (id: string): Promise<RadioCandidate | null> => {
  const [ station ] = await fetchStations(`/stations/byuuid/${encodeURIComponent(id)}`)
  return station ? toCandidate(station) : null
}

export const toFavorite = ({ name, streamUrl, imageUrl }: RadioCandidate): FavoriteStation => ({ name, streamUrl, imageUrl })
