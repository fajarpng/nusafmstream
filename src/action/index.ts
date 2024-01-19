import { baseUrl } from "@/utils/config"
import { Query, ResponseSuccess } from "@/utils/types"
import axios from "axios"

export const getListRadio = (params?:Query) => {
  return axios.get<ResponseSuccess>(`${baseUrl}/api/radio`, { params }).then(res => res.data)
}