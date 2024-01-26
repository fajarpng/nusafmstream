import { getListRadio } from "@/action"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import { DataStream } from "@/utils/types"
import Head from "next/head"
import { useMemo } from "react"
import { FaPlay } from "react-icons/fa"
import { useQuery } from "react-query"

export default function Home() {
  const { onChangeRadio } = useDataPlayer()
  const { data } = useQuery([ "radio/list", {} ], () => getListRadio({}))  

  const items: DataStream[] = useMemo(() => Array.isArray(data) ? data : [], [ data ])

  return (
    <div className="flex flex-col items-center justify-between">
      <Head>
        <title>Streaming Radio Nusantara</title>
      </Head>
      <div className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-10">
        {items?.map((v, i: number) => (
          <div key={i} onClick={() => onChangeRadio(v)} className=" flex flex-col items-center text-center">
            <div className="group bg-white w-[80px] h-[80px] md:w-[130px] md:h-[130px] lg:w-[180px] lg:h-[180px] rounded-md overflow-hidden relative">
              <div className="absolute bg-[rgba(0,0,0,.5)] w-full h-full group-hover:grid justify-center items-center hidden duration-75 cursor-pointer">
                <FaPlay className=" size-8" />
              </div>
              <img
                src={v.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={v.title}
                className="w-[100%] h-[100%] object-contain"
              />
            </div>
            <div className=" mt-4">{v.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
