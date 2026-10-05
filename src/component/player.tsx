"use client"

import { useDataPlayer } from "@/hooks/useDataPlayer"
import { usePlayer } from "@/hooks/usePlayer"
import { useEffect, useMemo, useRef, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaPlay, FaStepBackward, FaStepForward, FaStop, FaVolumeMute, FaVolumeUp } from "react-icons/fa"

export default function PlayerComponent() {
  const { isPlaying, onPlay, onPause, isLoading, setLoading } = usePlayer()
  const { dataRadio: data, dataList, onChangeRadio } = useDataPlayer()
  const [ volume, setVolume ] = useState<number>(1)

  let audio = useRef<HTMLAudioElement>(new Audio(data?.streamUrl))

  const currentIndex = useMemo(() => dataList.findIndex(v => v._id === data?._id), [ dataList, data?._id ])

  const goToOffset = (offset: number) => {
    if (!dataList.length || currentIndex === -1) return
    const nextItem = dataList[(currentIndex + offset + dataList.length) % dataList.length]
    onChangeRadio(nextItem)
  }

  useEffect(() => {

    if (data?.streamUrl && data?.streamUrl !== audio.current.src && !isLoading) {
      onPause()
      audio.current.src = data.streamUrl
      handlePlay()
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data?.streamUrl ])

  useEffect(() => {
    audio.current.volume = volume
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ volume ])

  // const keyDownHandler = (event: KeyboardEvent|any, isPlaying: boolean) => {
  //   if (event.key === " ") {
  //     event.preventDefault()
    
  //     isPlaying ? console.log("pressed pause") : console.log("pressed start")
  //     // isPlaying ? handlePause() : handlePlay()
  //   }
  // }

  // useEffect(() => {
  //   document.addEventListener("keydown", event => keyDownHandler(event, isPlaying))

  //   return () => {
  //     document.removeEventListener("keydown", event => keyDownHandler(event, isPlaying))
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const handlePause = () => {
    onPause()
    audio.current?.pause()
  }
  const handlePlay = async () => {
    if (audio.current) {
      setLoading()
      await audio.current.play()
        .then(() => onPlay())
        .catch (error => console.error("Error playing audio:", error))
        .finally(setLoading)
    }
  }

  const renderIcons = useMemo(() => {
    if (isLoading) return <button disabled><AiOutlineLoading3Quarters className="size-4 md:size-6 animate-spin text-black" /></button>
    else if (isPlaying) return <button onClick={handlePause}><FaStop className="size-4 md:size-6 text-black" /></button>
    return <button onClick={handlePlay}><FaPlay className="size-4 md:size-6 text-black" /></button>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isLoading, isPlaying ])

  return <div className=" bg-white p-4 md:px-8 border-4 border-black flex md:items-center justify-between gap-4 shadow-[6px_6px_0_#000] mb-4">

    <div className="flex items-center gap-3 min-w-0">
      <div className="w-full max-w-[56px] aspect-square overflow-hidden bg-white border-2 border-black shrink-0">
        <img
          src={data?.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={data?.title || "Empty"}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="min-w-0">
        {isPlaying && (
          <span className="inline-flex items-center gap-1.5 bg-[#B8FF3C] border-2 border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest mb-1">
            <span className="size-1.5 rounded-full bg-red-600 animate-pulse" />
            Now playing
          </span>
        )}
        <div className="text-sm md:text-base font-bold text-black line-clamp-1 text-ellipsis">{data?.title}</div>
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-3 shrink-0">
      <button
        onClick={() => goToOffset(-1)}
        className="inline-flex items-center justify-center p-1 md:p-2 bg-white border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 ease-in-out"
      >
        <FaStepBackward className="size-3 md:size-4 text-black" />
      </button>
      <div className="inline-flex items-center justify-center p-1 md:p-3 bg-[#FF3E9D] border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out">
        {renderIcons}
      </div>
      <button
        onClick={() => goToOffset(1)}
        className="inline-flex items-center justify-center p-1 md:p-2 bg-white border-2 border-black shadow-[3px_3px_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all duration-200 ease-in-out"
      >
        <FaStepForward className="size-3 md:size-4 text-black" />
      </button>
    </div>

    <div className="hidden md:flex items-center gap-2 shrink-0">
      <button onClick={() => setVolume(v => v > 0 ? 0 : 1)}>
        {volume > 0 ? <FaVolumeUp className="size-5 text-black" /> : <FaVolumeMute className="size-5 text-black" />}
      </button>
      <input
        type="range" min={0} max={1} step={0.01} value={volume}
        onChange={e => setVolume(Number(e.target.value))}
        className="w-24 accent-[#FF3E9D]"
      />
    </div>
  </div>
}