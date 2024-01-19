// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Query, ResponseSuccess } from "@/utils/types"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseSuccess>) {
  const { page = 1, limit = 20 }: Query = req.query

  let response: ResponseSuccess = {
    data: [],
    message: "No Data.",
    meta: {
      page,
      totalPage: 1,
      totalData: 0,
      limit,
    }
  }

  res.status(200).json(response)
}