import { FaSearch } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

interface SbProps {
  value: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (search: string) => void
}
export const SearchBar = ({ value, onChange }: SbProps) => {
  const setValue = (v: string) => onChange && onChange(v)

  return <div className="flex items-center gap-4 w-full max-w-[500px] bg-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] ring-2 ring-black p-3 rounded-lg">
    <FaSearch className=" text-black mx-1" />
    <input
      className=" outline-none bg-transparent w-full placeholder:text-black text-black font-space-grotesk"
      placeholder="find your favorite..." value={value}
      onChange={e => setValue(e.target.value)}
    />
    {value && <FaX onClick={() => setValue("")} className="text-black mx-2 cursor-pointer" />}
  </div>
}