import Information from '@components/information'
import List from '@components/list'
import ListIndex from '@components/list/list'
import Page from '@components/page'
import data from '@data/uses.json'
import getPosts from '@lib/get-posts'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'

const {
  apps,
  coding,
  computer,
  desk,
  keyboard,
  microphone,
  mouse,
  services
} = data as {
  apps: { title: string; description: string }[]
  coding: { title: string; description: string }[]
  computer: { title: string; description: string }[]
  desk: { title: string; description: string }[]
  keyboard: { title: string; description: string }[]
  microphone: { title: string; description: string }[]
  mouse: { title: string; description: string }[]
  services: { title: string; description: string }[]
}

export const getStaticProps: GetStaticProps<{
  posts: ReturnType<typeof getPosts>
}> = async () => {
  const posts = getPosts()
  return { props: { posts } }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const UsesPage = ({}: Props) => {
  const renderList = (
    sectionName: string,
    title: string,
    items: { title: string; description: string }[]
  ) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null

    const toolsWithIndex = items.map((item, i) => ({
      index: i,
      title: item.title
    }))

    return (
      <div
        style={{
          maxWidth: '720px',
          margin: '10px auto 0',
          padding: '16px 12px 16px',
          borderRadius: 'var(--inline-radius)',
          border: '1px solid var(--lighter-gray)',
          backgroundColor: 'var(--bg)'
        }}
      >
        <List listTitle={title}>
          {items.map((entry, index) => (
            <ListIndex
              key={`${sectionName}-${index}`}
              section={sectionName}
              index={index}
              selection="-"
              title={entry.title}
              description={entry.description}
              allTools={toolsWithIndex}
            />
          ))}
        </List>
      </div>
    )
  }

  return (
    <Page description="My config uses." title="Uses">
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto 6px'
        }}
      >
        <Information title="Tools. Apps. Gear.">
          I often change my computer and peripheral{' '}
          <strong>configuration</strong>. This is not a static page, it's a{' '}
          <strong>living document</strong> with everything that I'm using
          nowadays.
        </Information>
      </div>

      {renderList('computer', 'Computer', computer)}
      {renderList('desk', 'Desk', desk)}
      {renderList('mouse', 'Mouse', mouse)}
      {renderList('keyboard', 'Keyboard', keyboard)}
      {renderList('microphone', 'Microphone', microphone)}
      {renderList('coding', 'Coding', coding)}
      {renderList('apps', 'Apps', apps)}
      {renderList('services', 'Services', services)}
    </Page>
  )
}

export default UsesPage
