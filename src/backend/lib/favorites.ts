import { initMongoose } from "@/backend/lib/mongoose"
import Favorite from "@/backend/models/favorite"
import Radio from "@/backend/models/radio"
import { FavoriteStation } from "@/utils/types"
import mongoose from "mongoose"

export const listFavorites = async (visitorId: string) => {
  await initMongoose()
  const favorites = await Favorite.find({ visitorId }).sort({ createdAt: 1 }).populate("radio")
  // Drop favorites whose station was deleted
  return favorites.map(f => f.radio).filter(Boolean)
}

export const addFavorite = async (visitorId: string, radioId: string) => {
  await initMongoose()
  if (!mongoose.isValidObjectId(radioId) || !(await Radio.exists({ _id: radioId }))) return false
  await Favorite.updateOne({ visitorId, radio: radioId }, { $setOnInsert: { visitorId, radio: radioId } }, { upsert: true })
  return true
}

export const removeFavorite = async (visitorId: string, radioId: string) => {
  await initMongoose()
  if (!mongoose.isValidObjectId(radioId)) return
  await Favorite.deleteOne({ visitorId, radio: radioId })
}

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Station must already be validated (from Radio Browser): reuse an existing Radio with the same stream or name, or create it
export const saveStationAsFavorite = async (visitorId: string, station: FavoriteStation) => {
  await initMongoose()
  const existing = await Radio.findOne({ streamUrl: station.streamUrl })
    || await Radio.findOne({ title: { $regex: `^${escapeRegex(station.name)}$`, $options: "i" } })
  const radio = existing || await Radio.create({ title: station.name, logo: station.imageUrl, streamUrl: station.streamUrl })
  await addFavorite(visitorId, String(radio._id))
  return radio
}
