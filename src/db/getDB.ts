import { isProd } from "@/utils/config"
import { filterPage, filterSearchName } from "@/utils/helper"
import { DataStream, Query } from "@/utils/types"

const urlDb = isProd ? "/api_radio_id.json" : "http://localhost:3000/api_radio_id.json"

export default async function getDBListRadio(filter: Query): Promise<DataStream[]> {
  const response = await fetch(urlDb)
  const dataDb = response.ok ? await response.json() : []

  // filter data
  let data: DataStream[] = [ ...dataDb ]

  data = filterSearchName(data, filter.search)
  data = filterPage(data, filter)
  // end filter data

  return data
}
