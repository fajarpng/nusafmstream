import { BsStars } from "react-icons/bs"
import { FaBolt } from "react-icons/fa"
import { SearchBar } from "@/component/searchBar"

interface HeaderProps {
  search: string
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (search: string) => void
}

export default function Header({ search, onSearchChange }: HeaderProps) {
  return <div className="w-full flex flex-col md:flex-row md:items-start md:justify-between gap-6 p-5 md:p-8">
    <div className="relative w-fit shrink-0 ml-5">
      <h1 className="font-archivo-black font-extrabold text-4xl md:text-6xl text-black leading-[0.8] -rotate-2 select-none italic tracking-tighter [text-shadow:4px_4px_0_#FF3E9D]">
        NUSA FM
      </h1>
      <p className="-mt-6 ml-6 inline-block bg-[#4DD8FF] text-black font-bold text-xs md:text-sm uppercase tracking-widest border-[3px] border-black rounded-md px-3 py-1 -rotate-6 shadow-[4px_4px_0_#000] font-space-grotesk">
        Radio, without the noise.
      </p>
      <BsStars className="absolute top-5 -left-10 text-white size-12 -rotate-12 drop-shadow-[-6px_6px_0_#111111]" />
    </div>
    
    <div className="flex-1 flex justify-center md:mt-2">
      <SearchBar value={search} onChange={onSearchChange} />
    </div>

    <div className="hidden md:flex items-start gap-2 md:mt-2 font-archivo-black shrink-0">
      <span className="bg-[#B8FF3C] border-[3px] border-black rounded-sm px-4 py-2 font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2 rotate-2 shadow-[4px_4px_0_#000]">
        <span className="size-4 rounded-full bg-red-600 animate-pulse ring-2 ring-black" />
        Live 24/7
      </span>
      <FaBolt className="text-[#FF3E9D] size-7 drop-shadow-[2px_2px_0_#000] rotate-12 hidden md:block" />
    </div>
  </div>
}
