import { FaSearch } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

interface SbProps {
  value: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (search: string) => void
}
export const SearchBar = ({ value, onChange }: SbProps) => {
  const setValue = (v: string) => onChange && onChange(v)

  return <div className="flex items-center gap-3 w-full max-w-[600px] bg-white border-4 border-black shadow-[6px_6px_0_#000] focus-within:shadow-[6px_6px_0_#FF3E9D] transition-shadow p-2 rounded-xl">
    <FaSearch className="text-black mx-1 size-5" />
    <input
      className="outline-none bg-transparent w-full placeholder:text-black placeholder:opacity-50 text-black font-space-grotesk font-medium"
      placeholder="Find your favorite radio..." value={value}
      onChange={e => setValue(e.target.value)}
    />
    {value && (
      <button
        onClick={() => setValue("")}
        className="flex items-center justify-center bg-white border-2 border-black rounded-md size-7 shrink-0 hover:bg-nusa-pink transition-colors"
      >
        <FaX className="text-black size-3" />
      </button>
    )}
  </div>
}