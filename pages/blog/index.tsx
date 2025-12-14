import Information from '@components/information'
import Page from '@components/page'
import PostsList from '@components/posts-list'
import getPosts, { Post } from '@lib/get-posts'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'

type PostItem = {
  slug: string
  title: string
  date: string
  description?: string
}

type PageProps = {
  posts: PostItem[]
}

const BlogPage = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Page title="Blog" description="Writing about design and code.">
      <Information title="Blog">
        Writing about design, code and everything that happens between
        late-night builds and random ideas.
      </Information>

      <article>
        <ul>
          <PostsList posts={posts} />
        </ul>
      </article>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const rawPosts = getPosts()
  const posts: PostItem[] = rawPosts.map((p: Post) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    description: p.description
  }))

  return {
    props: {
      posts
    }
  }
}

export default BlogPage
