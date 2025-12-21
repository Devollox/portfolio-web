import AboutCursorLayer from '@components/cursor-layer/about-cursor-layer'
import Highlights from '@components/form/highlights-form'
import Information from '@components/information'
import Page from '@components/page'
import Quote from '@components/quote'
import QuoteHero from '@components/quote/quote-hero'
import UsedByDevollox from '@components/slider'
import { useEffect, useState } from 'react'
import { subscribeTotalVisitors } from 'service/firebase'

const AboutPage = () => {
  const [totalVisitors, setTotalVisitors] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribeTotalVisitors(value => {
      setTotalVisitors(value || 0)
    })
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <Page description="Builder. Optimizer. Solver." title="About">
      <AboutCursorLayer />

      <div>
        <Information title="Builder. Performance. Solver." as="h1">
          Hello, my name is <strong>Devollox</strong>, and I am a programmer who
          values <strong>creativity</strong> and <strong>optimization</strong>.
          This website is my place to <strong>experiment</strong> with modern
          web technologies, polish ideas and ship small, focused projects.
        </Information>
      </div>
      <QuoteHero
        badgeText={'            still building.'}
        name={'Devollox'}
        subtitle={'                Builder. Performance. Solver.'}
        text={`If a detail feels invisible, it is probably finished. If it catches
            your eye, it is probably an experiment.`}
      />
      <Highlights initialTotalVisitors={totalVisitors} />
      <UsedByDevollox />
      <Quote
        title="On building things."
        quote="I build web applications on Next.js and Firebase with a focus on UX and performance. This site is my playground for experiments."
        author="Devollox"
      />
    </Page>
  )
}

export default AboutPage



