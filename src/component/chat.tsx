"use client"

import { sendChat } from "@/action"
import { Transition } from "@headlessui/react"
import { useFavorites } from "@/hooks/useFavorites"
import { ChatMessage, FavoriteStation, RadioCandidate } from "@/utils/types"
import { FormEvent, useEffect, useRef, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { BsStars } from "react-icons/bs"
import { DiSpark } from "react-icons/di"
import { FaCheck, FaPaperPlane, FaPlus } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import { GiSparkles } from "react-icons/gi"
import { PiRobot, PiRobotFill } from "react-icons/pi"
import { SiProbot } from "react-icons/si"

type Message = ChatMessage & {
  candidates?: RadioCandidate[]
  added?: FavoriteStation | null
}

const GREETING: Message = {
  role: "model",
  text: "Got a station in mind? Try \"Find BBC Radio\" or \"Add Fox News to my favorites\".",
}

const CandidateCard = ({ candidate }: { candidate: RadioCandidate }) => {
  const { favorites, addFromSearch } = useFavorites()
  const [ status, setStatus ] = useState<"idle" | "loading" | "error">("idle")
  const isSaved = favorites.some(f => f.streamUrl === candidate.streamUrl)
  const location = [ candidate.state, candidate.country ].filter(Boolean).join(", ")

  // The server re-validates by Radio Browser id, so only real station data is saved
  const onAdd = () => {
    setStatus("loading")
    addFromSearch(candidate.id)
      .then(() => setStatus("idle"))
      .catch(() => setStatus("error"))
  }

  return <div className="flex items-center gap-2 bg-white border-2 border-black rounded-md p-2 shadow-[2px_2px_0_#000] ">
    <img src={candidate.imageUrl} alt={candidate.name} className="size-10 shrink-0 object-contain border-2 border-black rounded-sm bg-white" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-black line-clamp-1">{candidate.name}</p>
      <p className="text-xs text-black/60 line-clamp-1">{status === "error" ? "Streaming info unavailable" : location || "Unknown location"}</p>
    </div>
    <button
      onClick={onAdd} disabled={isSaved || status === "loading"} aria-label={`Add ${candidate.name}`}
      className="grid place-items-center size-8 shrink-0 bg-[#B8FF3C] border-2 border-black rounded-md shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:shadow-none disabled:translate-x-[2px] disabled:translate-y-[2px]"
    >
      {status === "loading" ? <AiOutlineLoading3Quarters className="size-3.5 animate-spin" /> : isSaved ? <FaCheck className="size-3.5" /> : <FaPlus className="size-3.5" />}
    </button>
  </div>
}

export default function ChatWidget() {
  const { refresh } = useFavorites()
  const [ isOpen, setIsOpen ] = useState(false)
  const [ input, setInput ] = useState("")
  const [ isLoading, setIsLoading ] = useState(false)
  const [ messages, setMessages ] = useState<Message[]>([ GREETING ])
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [ messages, isLoading, isOpen ])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const next = [ ...messages, { role: "user" as const, text } ]
    setMessages(next)
    setInput("")
    setIsLoading(true)

    // The greeting is UI only, so it is not sent as history
    sendChat(next.filter(m => m !== GREETING).map(({ role, text }) => ({ role, text })))
      .then(result => {
        if (result.added) refresh()
        setMessages(prev => [ ...prev, { role: "model", text: result.reply, candidates: result.candidates, added: result.added } ])
      })
      .catch(error => {
        const text = error?.response?.data?.message || "Something went wrong. Please try again."
        setMessages(prev => [ ...prev, { role: "model", text } ])
      })
      .finally(() => setIsLoading(false))
  }

  return <div className="absolute right-5 bottom-full mb-4 flex flex-col items-end gap-3 ">
    {/* Pops up from the Radio Buddy button with a little overshoot, shrinks back on close */}
    <Transition
      show={isOpen}
      enter="transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
      enterFrom="opacity-0 scale-50 translate-y-8 rotate-3"
      enterTo="opacity-100 scale-100 translate-y-0 rotate-0"
      leave="transition duration-150 ease-in motion-reduce:transition-none"
      leaveFrom="opacity-100 scale-100 translate-y-0"
      leaveTo="opacity-0 scale-75 translate-y-6"
      className="origin-bottom-right"
    >
      <div className="flex flex-col w-[calc(100vw-40px)] max-w-[380px] h-[min(520px,60dvh)] bg-[#F7F4EA] border-4 border-black rounded-xl shadow-[8px_8px_0_#000] overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[#4DD8FF] border-b-4 border-black">
          <p className="flex items-center gap-2 font-archivo-black uppercase tracking-widest text-sm text-black">
            <PiRobotFill className="size-8" /> Radio Buddy
          </p>
          <button
            onClick={() => setIsOpen(false)} aria-label="Close chat"
            className="grid place-items-center size-7 bg-[#FF3E9D] border-2 border-black rounded-md shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <FaX className="size-3 text-black" />
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-2 max-w-[90%] ${m.role === "user" ? "self-end items-end" : "self-start"}`}>
              <p className={`whitespace-pre-wrap text-sm text-black font-medium border-2 border-black rounded-md px-3 py-2 shadow-[2px_2px_0_#000] ${m.role === "user" ? "bg-[#FFD84D]" : "bg-white"}`}>
                {m.text}
              </p>
              {m.added && (
                <span className="inline-flex items-center gap-1.5 w-fit bg-[#B8FF3C] border-2 border-black rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                  <FaCheck /> Added to favorites
                </span>
              )}
              {!!m.candidates?.length && m.candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
            </div>
          ))}
          {isLoading && (
            <p className="self-start inline-flex items-center gap-2 text-sm text-black bg-white border-2 border-black rounded-md px-3 py-2">
              <AiOutlineLoading3Quarters className="animate-spin" /> Searching...
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex items-center gap-2 p-3 border-t-4 border-black bg-white">
          <input
            value={input} onChange={e => setInput(e.target.value)} maxLength={500}
            placeholder="Discover your next favorite frequency..."
            className="flex-1 min-w-0 outline-none bg-transparent text-sm text-black font-medium placeholder:text-black/50"
          />
          <button
            type="submit" disabled={isLoading || !input.trim()} aria-label="Send"
            className="grid place-items-center size-9 shrink-0 bg-[#FF3E9D] border-2 border-black rounded-md shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
          >
            <FaPaperPlane className="size-3.5 text-black" />
          </button>
        </form>
      </div>
    </Transition>

    {!isOpen &&
      <button
        onClick={() => setIsOpen(v => !v)} aria-label="Open radio assistant"
        className="inline-flex items-center gap-2 bg-black hover:bg-[#4DD8FF] hover:text-black text-[#4DD8FF] font-archivo-black uppercase tracking-widest text-sm rounded-md px-4 py-3 border-[3px] border-black shadow-[4px_4px_0_#fff] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200 ease-in-out"
      >
        <PiRobotFill className="size-4 md:size-8" /> {isOpen ? "Close" : "Radio Buddy"}
      </button>
    }
  </div>
}
