import { addFavorite, listFavorites, removeFavorite, saveStationAsFavorite } from "@/backend/lib/favorites"
import { getStationById, toFavorite } from "@/backend/lib/radioBrowser"
import { getVisitorId } from "@/backend/lib/visitor"
import { ResponseSuccess } from "@/utils/types"
import type { NextApiRequest, NextApiResponse } from "next"

// GET                       -> this visitor's favorite stations
// POST { radioId }          -> favorite an existing station
// POST { stationId }        -> validate a Radio Browser station, add it to the list and favorite it
// DELETE ?radioId=<id>      -> unfavorite
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseSuccess>) {
  const visitorId = getVisitorId(req, res)

  try {
    if (req.method === "GET") {
      return res.status(200).json({ data: await listFavorites(visitorId), message: "success" })
    }

    if (req.method === "POST") {
      const { radioId, stationId } = req.body || {}
      if (typeof stationId === "string" && stationId) {
        const station = await getStationById(stationId)
        if (!station) return res.status(404).json({ data: {}, message: "I couldn't find a matching radio station." })
        if (!station.valid) return res.status(422).json({ data: {}, message: "I found the station, but its streaming information is unavailable." })
        const radio = await saveStationAsFavorite(visitorId, toFavorite(station))
        return res.status(200).json({ data: radio, message: "success" })
      }
      if (typeof radioId === "string" && await addFavorite(visitorId, radioId)) {
        return res.status(200).json({ data: { radioId }, message: "success" })
      }
      return res.status(400).json({ data: {}, message: "A valid radioId or stationId is required" })
    }

    if (req.method === "DELETE") {
      const radioId = typeof req.query.radioId === "string" ? req.query.radioId : ""
      await removeFavorite(visitorId, radioId)
      return res.status(200).json({ data: { radioId }, message: "success" })
    }

    res.status(405).json({ data: {}, message: `Unsupported HTTP method: ${req.method}` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ data: {}, message: "something went wrong" })
  }
}
