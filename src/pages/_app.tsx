import "@/styles/globals.css"
import { QueryClient, QueryClientProvider } from "react-query"
import type { AppProps } from "next/app"

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
  return <QueryClientProvider client={queryClient}>
    <Component {...pageProps} />
  </QueryClientProvider>
}
