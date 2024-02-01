"use client"

import { useDataPlayer } from "@/hooks/useDataPlayer"
import { usePlayer } from "@/hooks/usePlayer"
import { useEffect, useMemo, useRef } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaPlay, FaStop } from "react-icons/fa"

export default function PlayerComponent() {
  const { isPlaying, onPlay, onPause, isLoading, setLoading } = usePlayer()
  const { dataRadio: data } = useDataPlayer()

  let audio = useRef<HTMLAudioElement>(new Audio(data?.streamUrl))

  useEffect(() => {

    if (data?.streamUrl && data?.streamUrl !== audio.current.src && !isLoading) {
      onPause()
      audio.current.src = data.streamUrl
      handlePlay()
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data?.streamUrl ])

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
    if (isLoading) return <button disabled><AiOutlineLoading3Quarters className=" size-7 animate-spin" /></button>
    else if (isPlaying) return <button onClick={handlePause}><FaStop className=" size-7" /></button>
    return <button onClick={handlePlay}><FaPlay className=" size-7" /></button>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isLoading, isPlaying ])

  return <div className="w-screen h-[80px] bg-slate-800 absolute p-2 border-t border-orange-500">
    <div className="flex items-center justify-around px-2 md:px-0 md:flex-row-reverse  md:justify-around gap-4">

      <div className=" text-orange-500">
        {renderIcons}
      </div>
      
      <div className="flex items-center gap-4 justify-center">
        <div className=" w-full max-w-[60px] aspect-square rounded-md overflow-hidden bg-white">
          <img
            src={data?.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={data?.title || "Empty"}
            className="h-full w-full object-contain"
          />
        </div>
        <div className=" hidden md:block text-base md:text-lg line-clamp-1 text-ellipsis">{data?.title}</div>
      </div>
    </div>
  </div>
}