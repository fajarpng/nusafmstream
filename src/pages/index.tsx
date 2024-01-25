import { getListRadio } from "@/action"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import { DataStream } from "@/utils/types"
import Head from "next/head"
import { useMemo } from "react"
import { useQuery } from "react-query"

const filter = { limit: 24 }

export default function Home() {
  const { onChangeRadio } = useDataPlayer()
  const { data } = useQuery([ "radio/list", filter ], () => getListRadio(filter))  

  const items: DataStream[] = useMemo(() => Array.isArray(data?.data) ? data?.data : [], [ data?.data ])

  return (
    <div className="flex flex-col items-center justify-between">
      <Head>
        <title>Streaming Radio Nusantara</title>
      </Head>
      <div className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-10">
        {items?.map((v, i: number) => (
          <div key={i} onClick={() => onChangeRadio(v)}>
            <div className=" bg-white w-[100px] h-[100px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] rounded-md overflow-hidden">
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
