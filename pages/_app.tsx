import Footer from '@components/footer'
import '@styles/global.scss'
import { ThemeProvider } from 'components/theme-provider'
import debounce from 'lodash.debounce'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Router from 'next/router'
import nprogress from 'nprogress'
import { useEffect } from 'react'
import { incrementTotalVisitors } from '../service/firebase'

const start = debounce(nprogress.start, 500)

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    const onStart = () => start()
    const onDone = () => {
      start.cancel()
      nprogress.done()
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0)
      }
    }

    Router.events.on('routeChangeStart', onStart)
    Router.events.on('routeChangeComplete', onDone)
    Router.events.on('routeChangeError', onDone)

    return () => {
      Router.events.off('routeChangeStart', onStart)
      Router.events.off('routeChangeComplete', onDone)
      Router.events.off('routeChangeError', onDone)
    }
  }, [])

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
      }
    }
    document.addEventListener('keydown', keydownHandler)
    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [])

  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      if (url === '/') {
        try {
          await incrementTotalVisitors()
        } catch (error) {
          console.error('Error incrementing visitor count:', error)
        }
      }
    }

    if (Router.pathname === '/') {
      handleRouteChange('/')
    }

    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultTheme="system">
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
