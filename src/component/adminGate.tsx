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

  return <div className="flex flex-col justify-center items-center min-h-screen p-4">
    <p className="text-4xl font-archivo-black text-black mb-4">Access Admin Page ??</p>
    <div className="p-10 border-4 border-black rounded-md bg-orange-500 shadow-[8px_8px_0_#000] w-full max-w-[500px]">
      <p className="mb-6 text-center text-black font-bold">You need a <span className="bg-white border-2 border-black rounded-md px-2 py-0.5">secret key</span> to access this page.</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          className="text-sm rounded-md block w-full p-3 bg-white border-2 border-black placeholder-black placeholder-opacity-50 text-black outline-none text-center font-bold"
          placeholder="*********"
          required type="password" name="password"
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-black hover:text-yellow-400 text-black font-archivo-black uppercase tracking-widest rounded-md p-3 border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out"
        >
          Enter
        </button>
      </form>
    </div>
  </div>
}