import { FaCode, FaInstagram, FaLinkedin } from "react-icons/fa"

export const Footer = () => {
  return <div className="w-full flex items-center py-4 gap-4 font-space-grotesk border-t-2 border-black mt-4">
    <div className="flex-1 flex flex-col md:flex-row items-start md:items-center md:gap-4">
      <p className="font-bold font-archivo-black text-2xl text-center md:text-start tracking-tighter">NUSA FM </p>
      <p className="text-sm flex-1 uppercase font-bricolage">Streaming Radio Nusantara</p>
    </div>
    <a href="https://github.com/fajarpng/nusafmstream" target="_blank">
      <div className=" text-black flex items-center gap-2 pr-4 border-r border-black"><FaCode className=" size-4" /> <span className="hidden md:block text-sm">Source Code</span></div>
    </a>
    <a href="https://www.instagram.com/fajar_png" target="_blank">
      <div className=" text-black flex items-center gap-2 pr-4 border-r border-black"><FaInstagram className=" size-4" /> <span className="hidden md:block text-sm">Instagram</span></div>
    </a>
    <a href="https://www.instagram.com/fajar_png" target="_blank">
      <div className=" text-black flex items-center gap-2 "><FaLinkedin className=" size-4" /> <span className="hidden md:block text-sm">LinkedIn</span></div>
    </a>
  </div>
}