import TextEntry from '@components/entry/text'
import { useState } from 'react'
import styles from './posts-list.module.scss'

type PostItem = {
  slug: string
  title: string
  date: string
  description?: string
}

type PostsProps = {
  slug?: string
  posts: PostItem[]
  paginate?: boolean
}

const Posts = ({ posts, paginate }: PostsProps) => {
  const [showMore, setShowMore] = useState(3)

  return (
    <div className={styles.container}>
      {posts.slice(0, paginate ? showMore : undefined).map(post => (
        <TextEntry
          key={`post-item-${post.slug}`}
          href="/blog/[slug]"
          slug={post.slug}
          as={`/blog/${post.slug}`}
          title={post.title}
          date={post.date}
          description={post.description}
        />
      ))}
      {paginate && showMore < posts.length && (
        <button
          onClick={() => {
            setShowMore(showMore + 3)
          }}
          className={styles.button}
        >
          Show More
        </button>
      )}
    </div>
  )
}

export default Posts
