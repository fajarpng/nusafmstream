"use client"
import dynamic from "next/dynamic"
import Head from "next/head"

const AdminGate = dynamic(() =>import("@/component/adminGate"), { ssr: false })

export default function App() {
  return (
    <div>
      <Head>
        <title>Manage Channel Radio</title>
        <meta name="description" content="Immerse yourself in Indonesia's musical mosaic with Streaming Radio Nusantara. 24/7 streaming of traditional and contemporary tunes, a cultural journey in every beat."/>
      </Head>
      <AdminGate />
    </div>
  )
}
