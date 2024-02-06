import { initMongoose } from "@/backend/lib/mongoose"
import Radio from "@/backend/models/radio"
import { ResponseSuccess } from "@/utils/types"
import { Error } from "mongoose"
import type { NextApiRequest, NextApiResponse } from "next"

let response: ResponseSuccess = {
  data: [],
  message: "No Data.",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  try {
    await initMongoose()
    if (method === "POST") { // POST
      const data = await Radio.create(req.body)
      response.data = data
      response.message = "success"
      res.status(200).json(response)
    } else if (req.method === "GET") { // GET
      const data = await Radio.find({})
      if (data?.length) {
        response.data = data
        response.message = "success"
      }
      res.status(200).json(response)
    } else { // ELSE
      throw new Error(`Unsupported HTTP method: ${req.method}`)
    }
  } catch (error) {
    response.data = error || {}
    response.message = "something went wrong"
   
    if (error instanceof Error.ValidationError) {
      response.data = error.errors
      response.message = error.message
      return res.status(400).json(response)
    }
    res.status(500).json(response)
  }
}