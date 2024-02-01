"use client"
import React, { SyntheticEvent, useState } from "react"

export default function AdminGate() {
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false)
  const onSubmit = async (event: SyntheticEvent) => {
    // 👇️ prevent page refresh
    event.preventDefault()
    const secretKey = process.env.NEXT_PUBLIC_PASS_ADMIN
    console.log(secretKey)
    
    setIsAdmin(false)
  }
  if (!isAdmin) {
  
    return <form className="flex justify-center items-center min-h-screen">
      <div className="p-10 border-2 border-orange-500 rounded-md bg-orange-500 bg-opacity-20 w-full max-w-[500px]">
        <p className="mb-5 text-center">You need a <b>seret key</b> to access this page.</p>
        <input
          className=" text-sm rounded-lg block w-full p-3 bg-gray-700 placeholder-gray-400 text-white outline-none text-center"
          placeholder="*********"
          required type="text" name="key"
          onSubmit={onSubmit}
        />
      </div>
    </form>
  }
  return <div></div>
}