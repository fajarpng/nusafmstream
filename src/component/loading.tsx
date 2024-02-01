import { AiOutlineLoading3Quarters } from "react-icons/ai"

export default function LoadingComponent() {
  return <div className="w-screen h-screen flex flex-col items-center justify-center" >
    <AiOutlineLoading3Quarters className=" absolute animate-[spin_2s_linear_infinite] text-orange-500 size-40 bg-orange-500 bg-opacity-30 rounded-full" />
    <p className="text-orange-500">loading...</p>
  </div>
}