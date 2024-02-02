import { FaSearch } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

interface SbProps {
  value: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (search: string) => void
}
export const SearchBar = ({ value, onChange }: SbProps) => {
  const setValue = (v: string) => onChange && onChange(v)

  return <div className="flex items-center gap-4 w-full max-w-[500px] bg-orange-500 bg-opacity-30 p-3 rounded-lg">
    <FaSearch className=" text-orange-500 mx-2" />
    <input
      className=" outline-none bg-transparent w-full placeholder:text-gray-300"
      placeholder="find your favorite..." value={value}
      onChange={e => setValue(e.target.value)}
    />
    {value && <FaX onClick={() => setValue("")} className="text-orange-500 mx-2 cursor-pointer" />}
  </div>
}