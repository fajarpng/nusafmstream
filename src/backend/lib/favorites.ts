import { initMongoose } from "@/backend/lib/mongoose"
import Radio from "@/backend/models/radio"
import { FavoriteStation } from "@/utils/types"

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Favorites live in the browser; this only makes sure the station exists in the list.
// Station must already be validated (from Radio Browser): reuse an existing Radio with the same stream or name, or create it
export const saveStation = async (station: FavoriteStation) => {
  await initMongoose()
  const existing = await Radio.findOne({ streamUrl: station.streamUrl })
    || await Radio.findOne({ title: { $regex: `^${escapeRegex(station.name)}$`, $options: "i" } })
  const radio = existing || await Radio.create({ title: station.name, logo: station.imageUrl, streamUrl: station.streamUrl })
  return radio
}
