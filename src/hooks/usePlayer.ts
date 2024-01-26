import { create } from "zustand"

type Player = {
  onPlay: () => void
  onPause: () => void
  setLoading: () => void
  isPlaying: boolean
  isLoading: boolean
}

export const usePlayer = create<Player>()((set) => {

  return {
    dataRadio: null,
    isPlaying: false,
    isLoading: false,
    onPlay: () => set(() => ({ isPlaying: true })),
    onPause: () => set(() => ({ isPlaying: false })),
    setLoading: () => set((state) => ({ ...state, isLoading: !state.isLoading })),
  }
})
