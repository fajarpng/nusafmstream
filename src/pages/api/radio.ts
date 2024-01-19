// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getDBListRadio from "@/db/getDB"
import { Query, ResponseSuccess } from "@/utils/types"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseSuccess>) {
  const { page = 1, limit = 20, search }: Query = req.query

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

  const data = await getDBListRadio({ page, limit, search })

  if (data.length) {
    response.data = data
    response.message = "success"
    response.meta.totalPage = Math.round(data.length/limit || 1)
    response.meta.totalData = data.length
  }

  res.status(200).json(response)
}