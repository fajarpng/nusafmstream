import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

export const SearchBar = () => {
  const [ search, setSearch ] = useState<string>("")

  return <div className="flex items-center gap-4 w-full max-w-[500px] bg-orange-500 bg-opacity-30 p-3 rounded-lg">
    <FaSearch className=" text-orange-500 mx-2" />
    <input
      className=" outline-none bg-transparent w-full placeholder:text-gray-300"
      placeholder="search someting here...." value={search}
      onChange={e => setSearch(e.target.value)}
    />
    {search && <FaX onClick={() => setSearch("")} className="text-orange-500 mx-2 cursor-pointer" />}
  </div>
}