import Post from '@components/post'
import getPosts, { Post as RawPost } from '@lib/get-posts'
import renderMarkdown from '@lib/render-markdown'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType
} from 'next'

type PostNav = {
  slug: string
  title: string
} | null

type PageProps = {
  html: string
} & Omit<RawPost, 'body'> & {
    previous: PostNav
    next: PostNav
  }

type Params = {
  slug: string
}

const PostPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Post title={''} slug={''} {...props} />
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async ({ params }) => {
  const slug = params!.slug
  const posts = getPosts()
  const postIndex = posts.findIndex(p => p.slug === slug)
  const post = posts[postIndex]
  const html = await renderMarkdown(post.body ?? '')

  return {
    props: {
      slug: post.slug,
      title: post.title,
      html,
      description: post.description ?? null,
      date: post.date ?? null,
      hidden: post.hidden ?? null,    
      og: post.og ?? null,
      previous: posts[postIndex + 1]
        ? { slug: posts[postIndex + 1].slug, title: posts[postIndex + 1].title }
        : null,
      next: posts[postIndex - 1]
        ? { slug: posts[postIndex - 1].slug, title: posts[postIndex - 1].title }
        : null,
    },
  }
}


export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = getPosts()
  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: false
  }
}

export default PostPage
