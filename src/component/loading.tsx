import { AiOutlineLoading3Quarters } from "react-icons/ai"

export default function LoadingComponent() {
  return <div className="w-screen h-screen flex flex-col items-center justify-center bg-white gap-6" >
    <div className="bg-orange-500 border-4 border-black rounded-md p-6 shadow-[8px_8px_0_#000]">
      <AiOutlineLoading3Quarters className="animate-[spin_1.2s_linear_infinite] text-black size-16" />
    </div>
    <p className="text-black font-bold text-xl uppercase tracking-widest bg-white border-2 border-black rounded-md px-4 py-1 shadow-[4px_4px_0_#000]">loading...</p>
  </div>
}