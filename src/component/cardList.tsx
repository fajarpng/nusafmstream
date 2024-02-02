"use client"

import { useDataPlayer } from "@/hooks/useDataPlayer"
import { usePlayer } from "@/hooks/usePlayer"
import { DataStream } from "@/utils/types"
import { useMemo } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaPlay, FaStop } from "react-icons/fa"
import { MdEdit } from "react-icons/md"

export default function CardList({ data, isAdmin = false }: {data: DataStream, isAdmin?: boolean}) {
  const { isPlaying, isLoading } = usePlayer()
  const { dataRadio: currentPlaying } = useDataPlayer()

  const renderIcons = useMemo(() => {
    if (isAdmin) return <MdEdit className=" size-8" />
    if (isLoading) return <AiOutlineLoading3Quarters className=" size-8 animate-spin" />
    else if (isPlaying && currentPlaying?._id === data?._id) return <FaStop className=" size-8" />
    return <FaPlay className=" size-8" />
  }, [ currentPlaying?._id, data?._id, isLoading, isPlaying, isAdmin ])

  return <div className="text-center group cursor-pointer ">
    <div className="bg-white w-full aspect-square rounded-md overflow-hidden relative grid items-center p-1 self-center">
      <div className="absolute bg-black bg-opacity-30 w-full h-full group-hover:grid justify-center items-center hidden duration-75 text-orange-500">
        {renderIcons}
      </div>
      <img
        src={data?.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={data?.title}
        className="w-full h-full object-contain"
      />
    </div>
    <p className=" mt-4 group-hover:text-orange-500 text-sm md:text-base line-clamp-2 text-ellipsis">{data?.title}</p>
  </div>
}