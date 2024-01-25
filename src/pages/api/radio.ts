import { initMongoose } from "@/be/lib/mongoose"
import Radio from "@/be/models/radio"
import { ResponseSuccess } from "@/utils/types"
import type { NextApiRequest, NextApiResponse } from "next"

let response: ResponseSuccess = {
  data: [],
  message: "No Data.",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initMongoose()
    if (req.method === "POST") { // POST
      const data = await Radio.create(req.body)
      response.data = data
      response.message = "success"
      res.status(200).json(response)
    } else if (req.method === "GET") { // GET
      const data = await Radio.find({})
      response.data = data
      response.message = "success"
      res.status(200).json(response)
    } else { // ELSE
      throw new Error(`Unsupported HTTP method: ${req.method}`)
    }
  } catch (error) {
    response.data = error || {}
    response.message = "something went wrong"
    res.json(response)
  }
}