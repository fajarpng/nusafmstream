import { Query, ResponseSuccess } from "@/utils/types"
import axios from "axios"

export const getListRadio = (params?:Query) => {
  return axios.get<ResponseSuccess>("/api/radio", { params })
    .then(res => (res.data.data || []))
    .catch(error => { throw error })
}