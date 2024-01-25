import useSound from "use-sound"

type Audio = {
  onPlay: () => void
  onPause: () => void
}

export const useAudio = (source?: string): Audio => {
  const [ play, { stop } ] = useSound(source)

  return {
    onPause: () => stop(),
    onPlay: () =>play(),
  }
}
