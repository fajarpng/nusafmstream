import { ChatMessage, ChatResult, DataStream, Query, ResponseSuccess } from "@/utils/types"
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
export const sendChat = (messages: ChatMessage[]) => {
  return axios.post<ResponseSuccess>("/api/chat", { messages })
    .then(res => res.data.data as ChatResult)
    .catch(error => { throw error })
}

export const addStation = (body: { stationId: string }) => {
  return axios.post<ResponseSuccess>("/api/favorites", body)
    .then(res => res.data.data as DataStream)
    .catch(error => { throw error })
}
