"use client"

import { useDataPlayer } from "@/hooks/useDataPlayer"
import { usePlayer } from "@/hooks/usePlayer"
import { DataStream } from "@/utils/types"
import { useMemo } from "react"
import { FaPlay, FaSpinner, FaStop } from "react-icons/fa"

export default function CardList({ data }: {data: DataStream}) {
  const { isPlaying, isLoading } = usePlayer()
  const { dataRadio: currentPlaying } = useDataPlayer()

  const renderIcons = useMemo(() => {
    if (isLoading) return <FaSpinner className=" size-8" />
    else if (isPlaying && currentPlaying?._id === data?._id) return <FaStop className=" size-8" />
    return <FaPlay className=" size-8" />
  }, [ currentPlaying?._id, data?._id, isLoading, isPlaying ])

  return <div className=" flex flex-col items-center text-center">
    <div className="group bg-white w-full h-full max-w-[80px] min-h-[80px] md:max-w-[130px] md:min-h-[130px] lg:max-w-[180px] lg:min-h-[180px] rounded-md overflow-hidden relative grid items-center">
      <div className="absolute bg-[rgba(0,0,0,.5)] w-full h-full group-hover:grid justify-center items-center hidden duration-75 cursor-pointer">
        {renderIcons}
      </div>
      <img
        src={data?.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={data?.title}
        className="w-full h-full object-contain"
      />
    </div>
    <div className=" mt-4">{data?.title}</div>
  </div>
}