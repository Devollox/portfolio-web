import fs from 'fs'
import matter from 'gray-matter'
import { marked } from 'marked'
import path from 'path'
import RSS from 'rss'

export default function generateRssFeed() {
  const posts = fs
    .readdirSync('./posts/')
    .filter(file => path.extname(file) === '.md')
    .map(file => {
      const postContent = fs.readFileSync(`./posts/${file}`, 'utf8')
      const { data, content } = matter(postContent) as {
        data: { [key: string]: any }
        content: string
      }
      return { ...data, body: content } as {
        title: string
        date: string
        slug: string
        body: string
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const renderPost = (md: string): string => marked.parse(md) as string

  const feed = new RSS({
    title: 'Devollox',
    site_url: 'https://devollox.fun/',
    feed_url: 'https://devollox.fun/feed.xml',
    image_url:
      'https://github.com/Devollox/Devollox-Website/blob/main/public/logo512.png',
    language: 'en'
  })

  posts.forEach(post => {
    const url = `https://devollox.fun/blog/${post.slug}`

    feed.item({
      title: post.title,
      description: renderPost(post.body),
      date: new Date(post.date),
      author: 'Devollox',
      url,
      guid: url
    })
  })

  const rss = feed.xml({ indent: true })
  fs.writeFileSync(path.join('public/feed.xml'), rss)
}
