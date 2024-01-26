import { getListRadio } from "@/action"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import { DataStream } from "@/utils/types"
import Head from "next/head"
import { useMemo } from "react"
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
      <div className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-10">
        {items?.map((v, i: number) => (
          <div key={i} onClick={() => onChangeRadio(v)}>
            <div className=" bg-white w-[80px] h-[80px] md:w-[130px] md:h-[130px] lg:w-[180px] lg:h-[180px] rounded-md overflow-hidden">
              <img
                src={v.logo || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"} alt={v.title}
                className="w-[100%] h-[100%] object-contain"
              />
            </div>
            <span>{v.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
