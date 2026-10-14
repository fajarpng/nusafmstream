import { getStationById, searchRadioStations, toFavorite } from "@/backend/lib/radioBrowser"
import { ResponseSuccess } from "@/utils/types"
import type { NextApiRequest, NextApiResponse } from "next"

// GET ?q=Prambors -> station candidates
// GET ?id=<uuid>  -> one validated station (name, streamUrl, imageUrl) ready to save
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseSuccess>) {
  if (req.method !== "GET") return res.status(405).json({ data: {}, message: `Unsupported HTTP method: ${req.method}` })

  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : ""
  const id = typeof req.query.id === "string" ? req.query.id.trim() : ""

  try {
    if (id) {
      const station = await getStationById(id)
      if (!station) return res.status(404).json({ data: {}, message: "I couldn't find a matching radio station." })
      if (!station.valid) return res.status(422).json({ data: {}, message: "I found the station, but its streaming information is unavailable." })
      return res.status(200).json({ data: toFavorite(station), message: "success" })
    }

    if (!q) return res.status(400).json({ data: {}, message: "Query parameter q is required" })
    const stations = await searchRadioStations(q)
    res.status(200).json({ data: stations, message: stations.length ? "success" : "No Data." })
  } catch (error) {
    console.error(error)
    res.status(502).json({ data: {}, message: "Radio search is unavailable right now." })
  }
}
