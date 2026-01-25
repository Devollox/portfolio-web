import Page from '@components/page'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getVisitorCount, incrementVisitorCount } from 'service/firebase'
import Navigation from './navigation'
import styles from './post.module.scss'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

type PostNav = { slug: string; title: string } | null

export type PostProps = {
  title: string
  slug: string
  html: string
  hidden?: boolean
  og?: boolean | string
  description?: string
  date?: string
  previous?: PostNav
  next?: PostNav
}

const Post = ({
  title,
  slug,
  html,
  hidden,
  og,
  description,
  date,
  previous,
  next
}: PostProps) => {
  const [, setFirebaseValue] = useState<number>(0)

  useEffect(() => {
    const updateCount = async () => {
      try {
        await incrementVisitorCount(slug)
        const count = await getVisitorCount(slug)
        setFirebaseValue(count)
      } catch (error) {
        console.error(error)
      }
    }
    updateCount()
  }, [slug])

  const image =
    og && og === true
      ? `https://res.cloudinary.com/dsdlhtnpw/image/upload/${slug}.png`
      : typeof og === 'string'
      ? og
      : undefined

  return (
    <Page title={title} description={description} image={image}>
      <Head>
        {hidden && <meta name="robots" content="noindex" />}
        {date && <meta name="date" content={date} />}
      </Head>

      <article
        dangerouslySetInnerHTML={{
          __html: `<span class="${styles.date}"></span><h1 class="${
            styles.title
          }">${escapeHtml(title)}</h1>${html}`
        }}
      />
      <Navigation previous={previous} next={next} />
    </Page>
  )
}

export default Post
