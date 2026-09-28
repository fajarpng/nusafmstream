import { Footer } from "@/component/footer"
import PlayerComponent from "@/component/player"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Archivo_Black, Bricolage_Grotesque, Inter, Public_Sans, Space_Grotesk, Space_Mono } from "next/font/google"
import { QueryClient, QueryClientProvider } from "react-query"

const inter = Inter({ subsets: [ "latin" ] })
const spaceGrotesk = Space_Grotesk({ subsets: [ "latin" ], variable: "--font-space-grotesk" })
const archivoBlack = Archivo_Black({ subsets: [ "latin" ], weight: "400", variable: "--font-archivo-black" })
const spaceMono = Space_Mono({ subsets: [ "latin" ], weight: [ "400", "700" ], variable: "--font-space-mono" })
const publicSans = Public_Sans({ subsets: [ "latin" ], variable: "--font-public-sans" })
const bricolage = Bricolage_Grotesque({ subsets: [ "latin" ], variable: "--font-bricolage" })

const staleTime = 1000 * 60 * 60 * .5 // half hours

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: staleTime,
      staleTime,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const { dataRadio } = useDataPlayer()
  return <div className={`bg-[#FFDB58] ${spaceGrotesk.variable} ${archivoBlack.variable} ${spaceMono.variable} ${publicSans.variable} ${bricolage.variable}`}>
    <div className={`${dataRadio?.streamUrl ? "h-[calc(100vh-80px)]" : "h-screen"} overflow-scroll relative`}>
      <QueryClientProvider client={queryClient}>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
      <div className=" absolute bottom-0 right-0">
        <Footer />
      </div>
    </div>
    {dataRadio?.streamUrl && <PlayerComponent />}
  </div>
}
