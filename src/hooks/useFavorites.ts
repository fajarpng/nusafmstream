import { addStation, getListRadio } from "@/action"
import { DataStream } from "@/utils/types"
import { useQuery, useQueryClient } from "react-query"

const STORAGE_KEY = "favorites"

const readIds = (): string[] => {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

// Favorites are radio ids kept in this browser's localStorage; the react-query cache shares them across components
export const useFavorites = () => {
  const queryClient = useQueryClient()
  const { data: ids = [] } = useQuery([ "favorites" ], readIds, { staleTime: Infinity })
  const { data } = useQuery([ "radio/list", {} ], () => getListRadio({}))
  const favorites: DataStream[] = (Array.isArray(data) ? data : []).filter((r: DataStream) => ids.includes(String(r._id)))

  const setIds = (next: string[]) => {
    queryClient.setQueryData([ "favorites" ], next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* private mode: stays in memory only */ }
  }

  const isFavorite = (radioId?: string | number) => ids.includes(String(radioId))

  const addFavorite = (radioId: string | number) => {
    queryClient.invalidateQueries([ "radio/list" ])
    if (!isFavorite(radioId)) setIds([ ...ids, String(radioId) ])
  }

  const toggleFavorite = (radioId: string | number) => {
    const id = String(radioId)
    setIds(isFavorite(id) ? ids.filter(i => i !== id) : [ ...ids, id ])
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    // A station from search may be new to the station list, so the server adds it first
    addFromSearch: (stationId: string) => addStation({ stationId }).then(radio => addFavorite(radio._id)),
  }
}
