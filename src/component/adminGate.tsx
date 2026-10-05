"use client"
import { useAuthGate } from "@/hooks/useAuthGate"
import { FormEvent, useState } from "react"
import { FaBolt, FaLock } from "react-icons/fa"

export default function AdminGate() {
  const { onLogin } = useAuthGate()
  const [ isWrongKey, setWrongKey ] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const secretKey = process.env.NEXT_PUBLIC_PASS_ADMIN
    const pw = event.currentTarget.password?.value

    if (pw === secretKey) onLogin()
    else setWrongKey(true)
  }

  return <div className="flex flex-col justify-center items-center min-h-screen p-4">
    <h1 className="relative text-3xl md:text-5xl font-archivo-black text-black uppercase italic tracking-tighter text-center -rotate-2 mb-10 [text-shadow:4px_4px_0_#FF3E9D]">
      Access Admin Page ??
      <FaBolt className="absolute -top-5 -right-7 text-[#4DD8FF] size-8 rotate-12 drop-shadow-[2px_2px_0_#000]" />
    </h1>

    <div className="relative p-8 md:p-10 border-4 border-black rounded-xl bg-[#4DD8FF] shadow-[10px_10px_0_#000] w-full max-w-[500px]">
      <span className="absolute -top-4 -right-3 bg-[#B8FF3C] border-[3px] border-black rounded-md px-3 py-1 font-archivo-black text-xs uppercase tracking-widest rotate-6 shadow-[3px_3px_0_#000]">
        Restricted
      </span>

      <div className="mx-auto mb-5 grid place-items-center size-16 rounded-full bg-black border-4 border-black shadow-[4px_4px_0_#FF3E9D]">
        <FaLock className="size-7 text-[#FFD84D]" />
      </div>

      <p className="mb-6 text-center text-black font-bold">
        You need a <span className="bg-[#FFD84D] border-2 border-black rounded-md px-2 py-0.5 shadow-[2px_2px_0_#000]">secret key</span> to access this page.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          className={`text-sm rounded-md block w-full p-3 bg-white border-[3px] border-black placeholder-black placeholder-opacity-50 text-black outline-none text-center font-bold tracking-widest transition-shadow ${isWrongKey ? "shadow-[4px_4px_0_#FF4D4D]" : "shadow-[4px_4px_0_#000] focus:shadow-[4px_4px_0_#FF3E9D]"}`}
          placeholder="*********"
          required type="password" name="password"
          onChange={() => isWrongKey && setWrongKey(false)}
        />
        {isWrongKey && (
          <p className="self-center bg-[#FF4D4D] text-white border-2 border-black rounded-md px-3 py-1 text-xs font-bold uppercase tracking-widest -rotate-1 shadow-[2px_2px_0_#000]">
            Wrong key, try again
          </p>
        )}
        <button
          type="submit"
          className="bg-[#FF3E9D] hover:bg-black hover:text-[#B8FF3C] text-black font-archivo-black uppercase tracking-widest rounded-md p-3 border-[3px] border-black shadow-[4px_4px_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out"
        >
          Enter
        </button>
      </form>
    </div>
  </div>
}
