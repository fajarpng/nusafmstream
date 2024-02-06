import { Query, ResponseSuccess } from "@/utils/types"
import axios from "axios"

export const getListRadio = (params?:Query) => {
  return axios.get<ResponseSuccess>("/api/radio", { params })
    .then(res => (res.data.data || []))
    .catch(error => { throw error })
}

export const addRadio = (body: object) => {
  return axios.post<ResponseSuccess>("/api/radio", body)
    .then(res => {
      res.data.data || []
    })
    .catch(error => { throw error })
}

export const editRadio = ({ body, id }:{body: object, id: number|string}) => {
  return axios.put<ResponseSuccess>(`/api/radio/${id}`, body)
    .then(res => {
      res.data.data || []
    })
    .catch(error => { throw error })
}