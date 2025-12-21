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
  apps: { title: string; description: string; link?: string }[]
  coding: { title: string; description: string; link?: string }[]
  computer: { title: string; description: string; link?: string }[]
  desk: { title: string; description: string; link?: string }[]
  keyboard: { title: string; description: string; link?: string }[]
  microphone: { title: string; description: string; link?: string }[]
  mouse: { title: string; description: string; link?: string }[]
  services: { title: string; description: string; link?: string }[]
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
    items: { title: string; description: string; link?: string }[],
    badge: string
  ) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null


    const toolsWithIndex = items.map((item, i) => ({
      index: i,
      title: item.title
    }))


    return (
        <List listTitle={title} badge={badge}>
          {items.map((entry, index) => (
            <ListIndex
              key={`${sectionName}-${index}`}
              section={sectionName}
              index={index}
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
