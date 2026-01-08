import { useTheme } from 'next-themes'
import NextHead from 'next/head'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

const BASE_URL = 'https://devollox.fun'
const defaultOgImage =
  'https://cdn.payga.me/avatar/2025/10/12/TokiwaShopNet_avatar.png'

const useCurrentPath = () => useRouter().asPath.split('?')[0]

type HeadProps = {
  title?: string
  description?: string
  image?: string
  children?: ReactNode
}

const Head = ({
  title = 'Devollox',
  description = "Hi, I'm Devollox. Programmer & Technical semi-engineer.",
  image = defaultOgImage,
  children
}: HeadProps) => {
  const { theme: activeTheme } = useTheme()
  const path = useCurrentPath()

  const isDark = activeTheme === 'dark'

  return (
    <NextHead>
      <link
        rel="preload"
        href="https://assets.vercel.com/raw/upload/v1587415301/fonts/2/inter-var-latin.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={BASE_URL + path} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@devollox" />
      <meta name="twitter:domain" content="devollox.fun" />
      <meta name="twitter:creator" content="@devollox" />
      <meta name="apple-mobile-web-app-title" content="Devollox" />
      <link rel="canonical" href={BASE_URL} />
      <meta name="author" content="Devollox" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed for devollox.fun"
        href="/feed.xml"
      />
      <link rel="manifest" href="/favicons/manifest.json" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href={isDark ? '/favicons/white-fav.webp' : '/favicons/dark-fav.webp'}
        key="dynamic-favicon"
      />
      {children}
    </NextHead>
  )
}

export default Head
