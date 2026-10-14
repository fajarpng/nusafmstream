export type DataStream = {
    _id: string | number
    title: string
    logo: string
    streamUrl: string
    favorite: string | number
}

// The only station fields persisted for favorites
export type FavoriteStation = {
  name: string
  streamUrl: string
  imageUrl: string
}

export type RadioCandidate = FavoriteStation & {
  id: string
  country: string
  state: string
  codec: string
  bitrate: number
  valid: boolean
  invalidReason?: string
}

export type ChatMessage = {
  role: "user" | "model"
  text: string
}

export type ChatResult = {
  reply: string
  candidates: RadioCandidate[]
  added: (FavoriteStation & { radioId: string }) | null
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