import { filterPage, filterSearchName } from "@/utils/helper"
import { DataStream, Query } from "@/utils/types"
import fs from "fs"

export default function getDBListRadio(filter: Query): DataStream[] {
  const db = fs.readFileSync("./src/db/api_radio_id.json")
  const dataDb: DataStream[] = JSON.parse(db.toString())

  // filter data
  let data: DataStream[] = [ ...dataDb ]

  data = filterSearchName(data, filter.search)
  data = filterPage(data, filter)
  // end filter data

  return data
}
