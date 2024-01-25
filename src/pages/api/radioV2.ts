// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { initMongoose } from "@/be/lib/mongoose"
import Radio from "@/be/models/radio"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initMongoose()
    if (req.method === "POST") {
      const response = await Radio.create(req.body)
      res.status(200).json(response)
    } else if (req.method === "GET") {
      const response = await Radio.find({})
      res.status(200).json(response)
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`)
    }
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
}