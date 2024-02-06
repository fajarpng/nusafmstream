"use client"
import { editRadio, getListRadio } from "@/action"
import { AddRadioButton } from "@/component/addRadioButton"
import CardList from "@/component/cardList"
import { ModalFromRadio } from "@/component/modalRadio"
import { SearchBar } from "@/component/searchBar"
import { useAuthGate } from "@/hooks/useAuthGate"
import { filterSearchName } from "@/utils/helper"
import { DataStream } from "@/utils/types"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"

const AdminGate = dynamic(() =>import("@/component/adminGate"), { ssr: false })

export default function App() {
  const { isAdmin } = useAuthGate()
  const [ search, setSearch ] = useState<string>("")
  const { data } = useQuery([ "radio/list", {} ], () => getListRadio({}))
  
  const items: DataStream[] = useMemo(() => {
    let dt = Array.isArray(data) ? data : []
    dt = filterSearchName(dt, search)
    return dt
  }, [ data, search ])

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
                <CardAdmin data={v} />
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

const CardAdmin = ({ data }: {data: DataStream}) => {
  const queryClient = useQueryClient()
  const mutateEdit = useMutation(editRadio, { onSuccess: () => queryClient.invalidateQueries({ queryKey: [ "radio/list" ] }) })

  const onSubmit = (body: object, cb?: any) => {
    mutateEdit.mutate({ id: data._id, body }, { onSuccess: () => cb() })
  }

  return <ModalFromRadio defaultValue={data} onSave={onSubmit} isLoading={mutateEdit.isLoading}>
    <div> <CardList data={data} isAdmin /> </div>
  </ModalFromRadio>
}