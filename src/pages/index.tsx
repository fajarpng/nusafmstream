import { getListRadio } from "@/action"
import CardList from "@/component/cardList"
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
      <div className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-10">
        {items?.map((v, i: number) => (
          <div key={i} onClick={() => onChangeRadio(v)}>
            <CardList data={v} />
          </div>
        ))}
      </div>
    </div>
  )
}
