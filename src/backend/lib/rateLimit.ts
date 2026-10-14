import { initMongoose } from "@/backend/lib/mongoose"
import ChatUsage from "@/backend/models/chatUsage"
import type { NextApiRequest } from "next"

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

// Visitor limit is the one users normally hit; the IP limit stops cookie-clearing,
// and the daily cap keeps the whole site inside the Gemini free tier
const LIMITS = [
  { scope: "visitor", max: Number(process.env.CHAT_LIMIT_PER_HOUR) || 5, windowMs: HOUR },
  { scope: "ip", max: Number(process.env.CHAT_LIMIT_PER_IP_HOUR) || 15, windowMs: HOUR },
  { scope: "global", max: Number(process.env.CHAT_LIMIT_PER_DAY) || 200, windowMs: DAY },
]

const getIp = (req: NextApiRequest) => {
  const forwarded = req.headers["x-forwarded-for"]
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim()
  return ip || req.socket.remoteAddress || "unknown"
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`

const formatWait = (ms: number) => {
  const minutes = Math.max(1, Math.ceil(ms / 60000))
  return minutes >= 60 ? plural(Math.ceil(minutes / 60), "hour") : plural(minutes, "minute")
}

// Returns an error message when over a limit, otherwise records the request and returns null
export const checkChatLimit = async (req: NextApiRequest, visitorId: string): Promise<string | null> => {
  await initMongoose()
  const now = Date.now()
  const keys: Record<string, string> = { visitor: `visitor:${visitorId}`, ip: `ip:${getIp(req)}`, global: "global" }

  for (const { scope, max, windowMs } of LIMITS) {
    const since = new Date(now - windowMs)
    const count = await ChatUsage.countDocuments({ key: keys[scope], createdAt: { $gt: since } })
    if (count < max) continue

    const oldest = await ChatUsage.findOne({ key: keys[scope], createdAt: { $gt: since } }).sort({ createdAt: 1 })
    const wait = formatWait((oldest?.createdAt?.getTime() ?? now) + windowMs - now)
    return scope === "global"
      ? `The assistant is resting for today. Please try again in ${wait}.`
      : `You've reached the limit of ${plural(max, "question")} per hour. Please try again in ${wait}.`
  }

  await ChatUsage.insertMany(Object.values(keys).map(key => ({ key, createdAt: new Date(now) })))
  return null
}
