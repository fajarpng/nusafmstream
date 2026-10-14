import { randomUUID } from "crypto"
import type { NextApiRequest, NextApiResponse } from "next"

const COOKIE_NAME = "nusafm_vid"
const ONE_YEAR = 60 * 60 * 24 * 365

// Anonymous per-browser ID that favorites are stored under (there are no user accounts)
export const getVisitorId = (req: NextApiRequest, res: NextApiResponse) => {
  const existing = req.cookies[COOKIE_NAME]
  if (existing && /^[0-9a-f-]{36}$/.test(existing)) return existing

  const id = randomUUID()
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${id}; Path=/; Max-Age=${ONE_YEAR}; HttpOnly; SameSite=Lax${secure}`)
  return id
}
