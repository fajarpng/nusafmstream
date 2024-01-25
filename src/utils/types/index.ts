export type DataStream = {
    id: string | number
    title: string
    logo: string
    streamUrl: string
    favorite: string | number
}

export type ResponseSuccess = {
  data: string[] | Object
  message: string
  // meta: Meta
}

export type Meta = {
  page: number
  totalData: number
  totalPage: number
  limit: number
}

export type Query = {
  // page?: number
  // limit?: number
  search?: string
}