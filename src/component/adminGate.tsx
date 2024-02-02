"use client"
import { useAuthGate } from "@/hooks/useAuthGate"
import { FormEvent } from "react"

export default function AdminGate() {
  const { onLogin } = useAuthGate()
  
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const secretKey = process.env.NEXT_PUBLIC_PASS_ADMIN
    const pw = event.currentTarget.password?.value
    if (pw === secretKey) onLogin()
  }

  return <div className="flex justify-center items-center min-h-screen p-4">
    <div className="p-10 border-2 border-orange-500 rounded-md bg-orange-500 bg-opacity-20 w-full max-w-[500px]">
      <p className="mb-5 text-center">You need a <b>seret key</b> to access this page.</p>
      <form onSubmit={onSubmit}>
        <input
          className=" text-sm rounded-lg block w-full p-3 bg-gray-700 placeholder-gray-400 text-white outline-none text-center"
          placeholder="*********"
          required type="password" name="password"
        />
      </form>
    </div>
  </div>
}