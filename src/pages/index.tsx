import { getListRadio } from "@/action"
import CardList from "@/component/cardList"
import LoadingComponent from "@/component/loading"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import { DataStream } from "@/utils/types"
import Head from "next/head"
import { useMemo } from "react"
import { useQuery } from "react-query"

export default function Home() {
  const { onChangeRadio } = useDataPlayer()
  const { data, isLoading } = useQuery([ "radio/list", {} ], () => getListRadio({}))  

  const items: DataStream[] = useMemo(() => Array.isArray(data) ? data : [], [ data ])

  return (
    <div>
      <Head>
        <title>Streaming Radio Nusantara</title>
        <meta name="description" content="Immerse yourself in Indonesia's musical mosaic with Streaming Radio Nusantara. 24/7 streaming of traditional and contemporary tunes, a cultural journey in every beat."/>
      </Head>
      {isLoading
        ? <LoadingComponent />
        : <div className=" grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 p-5 md:p-10">
          {items?.map((v, i: number) => (
            <div key={i} onClick={() => onChangeRadio(v)}>
              <CardList data={v} />
            </div>
          ))}
        </div>
      }

    </div>
  )
}
