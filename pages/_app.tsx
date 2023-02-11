import '../styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // fetchが失敗した際に3回まで再fetchするのを無効化
      refetchOnWindowFocus: false, // ブラウザをフォーカスした際にrefetchを行うのを無効化
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  // cookieのやり取りを行う場合には true にする必要がある
  axios.defaults.withCredentials = true
  useEffect(() => {
    // アプリを開いた際にcsrfTokenがheaderに自動で付与されるようになる
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`
      )
      axios.defaults.headers.common['csrf-token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])

  return (
    // フロジェクト全体で react-query を使えるようにするための Provider
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          fontFamily: 'Verdana, sans-serif',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      {/* react-query の devtools */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
