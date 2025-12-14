import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

type PostFrontmatter = {
  title: string
  date: string
  published?: boolean
  description?: string
  hidden?: boolean
  og?: boolean | string
  slug?: string
  [key: string]: unknown
}

export type Post = PostFrontmatter & {
  slug: string
  date: string
  body: string | null
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}.${mm}.${yy}`
}

const getPosts = (): Post[] => {
  const postsDir = './posts/'

  const rawPosts = fs
    .readdirSync(postsDir)
    .filter(file => path.extname(file) === '.md')
    .map(file => {
      const postContent = fs.readFileSync(path.join(postsDir, file), 'utf8')
      const matterResult = matter(postContent)

      const data = matterResult.data as PostFrontmatter
      const content = matterResult.content as string

      if (data.published === false) return null

      const slugFromFile = path.basename(file, '.md')

      return {
        ...data,
        slug: data.slug ?? slugFromFile,
        body: content
      }
    })
    .filter(
      (p): p is PostFrontmatter & { slug: string; body: string } => p !== null
    )

  rawPosts.sort((a, b) => {
    const ta = new Date(a.date).getTime()
    const tb = new Date(b.date).getTime()

    if (Number.isNaN(ta) && Number.isNaN(tb)) return 0
    if (Number.isNaN(ta)) return 1
    if (Number.isNaN(tb)) return -1

    return tb - ta
  })

  const posts: Post[] = rawPosts.map(p => ({
    ...p,
    date: formatDate(p.date)
  }))

  const meta: Post[] = posts.map(p => ({ ...p, body: null }))
  fs.writeFileSync(path.resolve('data/blog.json'), JSON.stringify(meta), 'utf8')

  return posts
}

export default getPosts
