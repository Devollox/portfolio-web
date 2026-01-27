import Command from '@components/command'
import Page from '@components/page'
import styles from '@components/page/home-page.module.scss'
import getPosts from '@lib/get-posts'
import RenderBackdropAnimation from '@lib/render-backdrop'
import generateRssFeed from '@lib/rss'
import useEncoding from 'hook/useEncoding'
import { ArrowRight } from 'lucide-react'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'

export const getStaticProps: GetStaticProps<{ data: {} }> = async () => {
  await getPosts()
  await generateRssFeed()
  return { props: { data: {} } }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const HomePage = ({}: Props) => {
  useEncoding('effectAbbr', 25)

  return (
    <span className={styles.wrapper_home}>
      <RenderBackdropAnimation />
      <Page
        description="Hello, my name is Devollox, and I am a programmer who values creativity and optimization."
        variant="home"
      >
        <div className={styles.wrapper_main}>
          <div className={styles.wrapper_text}>
            <h1>Devollox</h1>
            <p>
              <strong>
                Programmer &amp; Technical <a href="/about">semi-engineer</a>
              </strong>
              <br />
              <abbr id="effectAbbr">Obsessed with the Internet</abbr>
            </p>
            <Command
              variantKey="false"
              variant={
                <div className={styles.button}>
                  Press <kbd>ctrl</kbd> <kbd>K</kbd> to start
                  <ArrowRight size={20} />
                </div>
              }
            />
          </div>
        </div>
      </Page>
    </span>
  )
}

export default HomePage
