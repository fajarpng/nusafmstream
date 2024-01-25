import mongoose from "mongoose"

const NEXT_PUBLIC_DB_URL = process.env.NEXT_PUBLIC_DB_URL || ""
if (!NEXT_PUBLIC_DB_URL) throw new Error("NEXT_PUBLIC_DB_URL not defined")

export async function initMongoose() {

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise()
  }
  return await mongoose.connect(NEXT_PUBLIC_DB_URL)
}
  