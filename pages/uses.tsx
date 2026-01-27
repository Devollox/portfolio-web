import Information from '@components/information'
import List from '@components/list'
import ListIndex from '@components/list/list'
import Page from '@components/page'
import data from '@data/uses.json'
import getPosts from '@lib/get-posts'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'

type UseItem = {
  id: string
  title: string
  description: string
  link?: string
}

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
  apps: UseItem[]
  coding: UseItem[]
  computer: UseItem[]
  desk: UseItem[]
  keyboard: UseItem[]
  microphone: UseItem[]
  mouse: UseItem[]
  services: UseItem[]
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
    items: UseItem[],
    badge: string
  ) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null

    const toolsWithIndex = items.map(item => ({
      id: item.id,
      title: item.title
    }))

    return (
      <List listTitle={title} badge={badge}>
        {items.map(entry => (
          <ListIndex
            key={`${sectionName}-${entry.id}`}
            section={sectionName}
            index={entry.id}
            selection="-"
            title={entry.title}
            description={entry.description}
            allTools={toolsWithIndex}
            link={entry.link}
          />
        ))}
      </List>
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

      {renderList('computer', 'Computer', computer, 'Core')}
      {renderList('desk', 'Desk', desk, 'Desk setup')}
      {renderList('mouse', 'Mouse', mouse, 'Pointer')}
      {renderList('keyboard', 'Keyboard', keyboard, 'Keys')}
      {renderList('microphone', 'Microphone', microphone, 'Audio')}
      {renderList('coding', 'Coding', coding, 'Stack')}
      {renderList('apps', 'Apps', apps, 'Software')}
      {renderList('services', 'Services', services, 'Cloud')}
    </Page>
  )
}

export default UsesPage
