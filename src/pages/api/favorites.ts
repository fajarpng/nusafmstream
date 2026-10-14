import { saveStation } from "@/backend/lib/favorites"
import { getStationById, toFavorite } from "@/backend/lib/radioBrowser"
import { ResponseSuccess } from "@/utils/types"
import type { NextApiRequest, NextApiResponse } from "next"

// POST { stationId } -> validate a Radio Browser station and add it to the station list
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseSuccess>) {
  if (req.method !== "POST") return res.status(405).json({ data: {}, message: `Unsupported HTTP method: ${req.method}` })

  try {
    const { stationId } = req.body || {}
    if (typeof stationId !== "string" || !stationId) return res.status(400).json({ data: {}, message: "A valid stationId is required" })
    const station = await getStationById(stationId)
    if (!station) return res.status(404).json({ data: {}, message: "I couldn't find a matching radio station." })
    if (!station.valid) return res.status(422).json({ data: {}, message: "I found the station, but its streaming information is unavailable." })
    res.status(200).json({ data: await saveStation(toFavorite(station)), message: "success" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ data: {}, message: "something went wrong" })
  }
}
