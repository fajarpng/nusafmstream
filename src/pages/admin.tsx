"use client"
import { getListRadio } from "@/action"
import { AddRadioButton } from "@/component/addRadioButton"
import CardList from "@/component/cardList"
import { SearchBar } from "@/component/searchBar"
import { useAuthGate } from "@/hooks/useAuthGate"
import { DataStream } from "@/utils/types"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useMemo, useState } from "react"
import { useQuery } from "react-query"

const AdminGate = dynamic(() =>import("@/component/adminGate"), { ssr: false })

export default function App() {
  const { isAdmin } = useAuthGate()
  const [ search, setSearch ] = useState<string>("")
  const { data } = useQuery([ "radio/list", {} ], () => getListRadio({}))
  const items: DataStream[] = useMemo(() => Array.isArray(data) ? data : [], [ data ])

  return (
    <div>
      <Head>
        <title>Manage Channel Radio</title>
        <meta name="description" content="Immerse yourself in Indonesia's musical mosaic with Streaming Radio Nusantara. 24/7 streaming of traditional and contemporary tunes, a cultural journey in every beat."/>
      </Head>
      {!isAdmin
        ? <AdminGate />
        : <div className="p-5">
          <div className=" flex justify-between items-center gap-2">
            <div className="hidden md:block"></div>
            <SearchBar value={search} onChange={setSearch} />
            <AddRadioButton />
          </div>
          <div className=" grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 py-5">
            {items?.map((v, i: number) => (
              <div key={i}>
                <CardList data={v} isAdmin />
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}
