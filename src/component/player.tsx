"use client"

import { useDataPlayer } from "@/hooks/useDataPlayer"
import { usePlayer } from "@/hooks/usePlayer"
import { useEffect, useRef } from "react"
import { FaPlay, FaStop } from "react-icons/fa"

export default function PlayerComponent() {
  const { isPlaying, onPlay, onPause } = usePlayer()
  const { dataRadio: data } = useDataPlayer()

  let audio = useRef<HTMLAudioElement>(new Audio(data?.streamUrl))

  useEffect(() => {

    if (data?.streamUrl) {
      onPause()
      audio.current.src = data.streamUrl
      handlePlay()
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data?.streamUrl ])

  const handlePause = () => {
    onPause()
    audio.current?.pause()
  }
  const handlePlay = async () => {
    if (audio.current) {
      await audio.current.play()
        .then(() => onPlay())
        .catch (error => console.error("Error playing audio:", error))
    }
  }

  return <div className="w-screen h-[80px] bg-gray-900 absolute p-2">
    <div className="flex items-center justify-center gap-4">
      <div>
        {!isPlaying
          ? <button onClick={handlePlay}><FaPlay /></button>
          : <button onClick={handlePause}><FaStop /></button>
        }
      </div>
      <div className=" w-[60px] h-[60px] rounded-md overflow-hidden bg-white">
        <img
          src={data?.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={data?.title || "Empty"}
          className="h-full w-full object-contain"
        />
      </div>
      <div className=" text-lg">{data?.title}</div>
    </div>
  </div>
}