import { DataStream } from "../types"

export const filterSearchName = (array: DataStream[], search?: string) => {
  if (!search) return array
  
  let searchQuery = search.toLocaleLowerCase()
  let data = [ ...array ]
  data = data.filter(v => ((v.title).toLocaleLowerCase()).includes(searchQuery))
  return data
}

// export const filterPage = (array: DataStream[], { page = 1, limit = 20 }: Query) => {
//   let data = [ ...array ]
//   data = data.slice(+limit*(+page-1), +page*+limit)
//   return data
// }