import { create } from "zustand"

type Player = {
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
};

export const usePlayer = create<Player>()((set) => {

  return {
    dataRadio: null,
    isPlaying: false,
    onPlay: () => set(() => ({ isPlaying: true })),
    onPause: () => set(() => ({ isPlaying: false })),
  }
})
