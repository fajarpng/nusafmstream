import { FaCode, FaInstagram, FaLinkedin } from "react-icons/fa"

export const Footer = () => {
  return <div className=" flex justify-end p-4 gap-4">
    <a href="https://github.com/fajarpng/nusafmstream" target="_blank">
      <div className=" text-orange-500 flex items-center gap-2"><FaCode className=" size-4" /> <span className="hidden md:block text-sm">Source Code</span></div>
    </a>
    <a href="https://www.instagram.com/fajar_png" target="_blank">
      <div className=" text-orange-500 flex items-center gap-2"><FaInstagram className=" size-4" /> <span className="hidden md:block text-sm">Instagram</span></div>
    </a>
    <a href="https://www.instagram.com/fajar_png" target="_blank">
      <div className=" text-orange-500 flex items-center gap-2"><FaLinkedin className=" size-4" /> <span className="hidden md:block text-sm">LinkedIn</span></div>
    </a>
  </div>
}