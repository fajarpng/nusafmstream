import PlayerComponent from "@/component/player"
import { useDataPlayer } from "@/hooks/useDataPlayer"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Inter } from "next/font/google"
import { QueryClient, QueryClientProvider } from "react-query"

const inter = Inter({ subsets: [ "latin" ] })

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
  return <div>
    <div className={`${dataRadio?.streamUrl ? "h-[calc(100vh-80px)]" : "h-screen"} overflow-scroll`}>
      <QueryClientProvider client={queryClient}>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </div>
    {dataRadio?.streamUrl && <PlayerComponent />}
  </div>
}
