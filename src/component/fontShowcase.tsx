const fonts = [
  { name: "Inter", className: "font-sans", note: "default body font" },
  { name: "Space Grotesk", className: "font-space-grotesk", note: "heading font" },
  { name: "Archivo Black", className: "font-archivo-black", note: "poster / heavy display" },
  { name: "Space Mono", className: "font-space-mono", note: "technical accent" },
  { name: "Public Sans", className: "font-public-sans", note: "bold-weight grotesk" },
  { name: "Bricolage Grotesque", className: "font-bricolage", note: "quirky variable grotesk" },
]

export default function FontShowcase() {
  return <div className="w-full flex flex-col gap-6 p-6">
    {fonts.map(font => (
      <div key={font.name} className={`${font.className} bg-white border-4 border-black rounded-md p-6 shadow-[8px_8px_0_#000]`}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-sm uppercase tracking-widest bg-orange-500 text-black border-2 border-black rounded-md px-3 py-1">{font.name}</p>
          <p className="text-xs text-black opacity-60">{font.note}</p>
        </div>
        <p className="text-3xl">The quick brown fox jumps over the lazy dog</p>
        <p className="text-lg mt-2">0123456789 !@#$%^&*()</p>
      </div>
    ))}
  </div>
}
