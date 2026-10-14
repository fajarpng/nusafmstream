import { addFavorite, getFavorites, removeFavorite } from "@/action"
import { DataStream } from "@/utils/types"
import { useMutation, useQuery, useQueryClient } from "react-query"

// Favorites live in the DB under this browser's anonymous visitor cookie
export const useFavorites = () => {
  const queryClient = useQueryClient()
  const { data } = useQuery([ "favorites" ], getFavorites)
  const favorites: DataStream[] = Array.isArray(data) ? data : []

  // A station added from search may also be new to the station list
  const refresh = () => {
    queryClient.invalidateQueries([ "favorites" ])
    queryClient.invalidateQueries([ "radio/list" ])
  }
  const mutateAdd = useMutation(addFavorite, { onSuccess: refresh })
  const mutateRemove = useMutation(removeFavorite, { onSuccess: refresh })

  const isFavorite = (radioId?: string | number) => favorites.some(f => String(f._id) === String(radioId))

  const toggleFavorite = (radioId: string | number) => {
    const id = String(radioId)
    isFavorite(id) ? mutateRemove.mutate(id) : mutateAdd.mutate({ radioId: id })
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    refresh,
    addFromSearch: (stationId: string) => mutateAdd.mutateAsync({ stationId }),
    isUpdating: mutateAdd.isLoading || mutateRemove.isLoading,
  }
}
