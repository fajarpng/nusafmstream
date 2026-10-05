import { getListRadio } from "@/action"
import CardList from "@/component/cardList"
import Header from "@/component/header"
import LoadingComponent, { TuningStatus } from "@/component/loading"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import { filterSearchName } from "@/utils/helper"
import { DataStream } from "@/utils/types"
import Head from "next/head"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"

export default function Home() {
  const { onChangeRadio, setDataList } = useDataPlayer()
  const [ search, setSearch ] = useState<string>("")
  const { data, isLoading } = useQuery([ "radio/list", {} ], () => getListRadio({}))
  const [ tuningStatus, setTuningStatus ] = useState<TuningStatus | null>(isLoading ? "searching" : null)

  // Searching -> connecting while loading, then hold "now playing" briefly before showing the list
  useEffect(() => {
    if (isLoading) {
      setTuningStatus("searching")
      const timer = setTimeout(() => setTuningStatus("connecting"), 2500)
      return () => clearTimeout(timer)
    }
    setTuningStatus(prev => (prev ? "connected" : null))
    const timer = setTimeout(() => setTuningStatus(null), 900)
    return () => clearTimeout(timer)
  }, [ isLoading ])

  const items: DataStream[] = useMemo(() => {
    let dt = Array.isArray(data) ? data : []
    dt = filterSearchName(dt, search)
    return dt
  }, [ data, search ])

  useEffect(() => {
    setDataList(items)
  }, [ items, setDataList ])

  return (
    <div className=" min-h-screen pb-[34dvh] md:pb-[15dvh]">
      <Head>
        <title>Streaming Radio Nusantara</title>
        <meta name="description" content="Immerse yourself in Indonesia's musical mosaic with Streaming Radio Nusantara. 24/7 streaming of traditional and contemporary tunes, a cultural journey in every beat."/>
      </Head>
      {tuningStatus
        ? <LoadingComponent status={tuningStatus} />
        : <div className="p-5">
          <Header search={search} onSearchChange={setSearch} />
          <div className="flex items-center gap-4 md:pr-10 md:px-10 my-4 ">
            <p className="font-extrabold font-archivo-black uppercase text-lg md:text-2xl text-black tracking-tighter bg-[#B8FF3C] border-[3px] border-black rounded-md shadow-[4px_4px_0_#000] px-4 py-1 -rotate-1">Radio Stations</p>
            <div className="flex-1 border-t-4 border-black" />
          </div>
          <div className=" grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 md:px-10 pb-10">
            {items?.map((v, i: number) => (
              <div key={i} onClick={() => onChangeRadio(v)} className='h-full'>
                <CardList data={v} />
              </div>
            ))}
          </div>
        </div>
      }

    </div>
  )
}
