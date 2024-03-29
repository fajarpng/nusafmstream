import { getListRadio } from "@/action"
import CardList from "@/component/cardList"
import LoadingComponent from "@/component/loading"
import { SearchBar } from "@/component/searchBar"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import { filterSearchName } from "@/utils/helper"
import { DataStream } from "@/utils/types"
import Head from "next/head"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"

export default function Home() {
  const { onChangeRadio } = useDataPlayer()
  const [ search, setSearch ] = useState<string>("")
  const { data, isLoading } = useQuery([ "radio/list", {} ], () => getListRadio({}))

  const items: DataStream[] = useMemo(() => {
    let dt = Array.isArray(data) ? data : []
    dt = filterSearchName(dt, search)
    return dt
  }, [ data, search ])

  return (
    <div>
      <Head>
        <title>Streaming Radio Nusantara</title>
        <meta name="description" content="Immerse yourself in Indonesia's musical mosaic with Streaming Radio Nusantara. 24/7 streaming of traditional and contemporary tunes, a cultural journey in every beat."/>
      </Head>
      {isLoading
        ? <LoadingComponent />
        : <div className=" p-5">
          <div className=" flex justify-center mt-2 mb-10 md:mb-0">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className=" grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 md:p-10">
            {items?.map((v, i: number) => (
              <div key={i} onClick={() => onChangeRadio(v)}>
                <CardList data={v} />
              </div>
            ))}
          </div>
        </div>
      }

    </div>
  )
}
