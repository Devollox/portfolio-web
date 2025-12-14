import { promises as fs } from 'fs'
import path from 'path'
import renderMarkdown from './render-markdown'

const getMarkdown = async (filename: string): Promise<string> => {
  const filenamePath = path.resolve(process.cwd(), filename)
  const contents = await fs.readFile(filenamePath, 'utf-8')
  const html = renderMarkdown(contents)

  return html
}

export default getMarkdown
