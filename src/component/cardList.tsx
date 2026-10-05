"use client"

import { useDataPlayer } from "@/hooks/useDataPlayer"
import { usePlayer } from "@/hooks/usePlayer"
import { DataStream } from "@/utils/types"
import { useMemo } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaPlay, FaStop } from "react-icons/fa"
import { MdEdit } from "react-icons/md"

const BOOKMARK_COLORS = [ "#FF3E9D", "#4DD8FF", "#B8FF3C", "#FFD84D", "#FF6B35", "#9B5DE5", "#00F5D4", "#FF4D4D", "#3A86FF", "#FFBE0B" ]

// Stable "random" color per station so it doesn't change between renders
const pickBookmarkColor = (key = "") => {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0
  return BOOKMARK_COLORS[Math.abs(hash) % BOOKMARK_COLORS.length]
}

export default function CardList({ data, isAdmin = false }: {data: DataStream, isAdmin?: boolean}) {
  const { isPlaying, isLoading } = usePlayer()
  const { dataRadio: currentPlaying } = useDataPlayer()

  const renderIcons = useMemo(() => {
    if (isAdmin) return <MdEdit className=" size-8" />
    if (isLoading) return <AiOutlineLoading3Quarters className=" size-8 animate-spin" />
    else if (isPlaying && currentPlaying?._id === data?._id) return <FaStop className=" size-8" />
    return <FaPlay className=" size-8" />
  }, [ currentPlaying?._id, data?._id, isLoading, isPlaying, isAdmin ])

  const bookmarkColor = useMemo(() => pickBookmarkColor(String(data?._id ?? data?.title ?? "")), [ data?._id, data?.title ])

  return <div className="relative h-full group cursor-pointer rounded-xl p-3 md:p-4 bg-[#F7F4EA] border-[3px] border-black shadow-[5px_5px_0_#000] hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none transition-all duration-200 ease-in-out">
    {!(isPlaying && currentPlaying?._id === data?._id) &&
      <svg
        viewBox="0 0 20 30" aria-hidden="true"
        className="absolute -top-0 left-3 md:left-3 z-10 w-5 h-[30px] md:w-6 md:h-9 "
      >
        <path d="M1.5 0 V28 L10 21.5 L18.5 28 V0" fill={bookmarkColor} stroke="#000" strokeWidth="3" strokeLinejoin="miter" />
      </svg>
    }

    <div className="w-full aspect-square relative self-center rounded-md ">
      <div className="absolute z-10 w-full h-full group-hover:grid justify-center items-center hidden duration-75">
        <span className="grid place-items-center size-14 rounded-full bg-black text-[#FFD84D] border-[3px] border-black shadow-[3px_3px_0_#fff]">
          {renderIcons}
        </span>
      </div>
      <img
        src={data?.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={data?.title}
        className="w-full h-full object-contain bg-white border-[3px] border-black rounded-md"
      />
    </div>
    <p className="mt-3 md:mt-4 text-black font-bold md:text-base line-clamp-2 text-ellipsis font-space-grotesk">
      {data?.title}
    </p>
  </div>
}