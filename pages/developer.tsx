import AvatarCard from '@components/card/avatar-card'
import StackCard from '@components/card/stack-card'
import Information from '@components/information'
import Page from '@components/page'
import Quote from '@components/quote'
import QuoteHero from '@components/quote/quote-hero'

const DeveloperPage = () => {
  const sections = [
    { title: 'Core', lines: ['React & Next.js', 'TypeScript'] },
    { title: 'Styling', lines: ['SCSS / CSS modules'] },
    { title: 'Data & auth', lines: ['Firebase & Firestore', 'Auth providers'] },
    { title: 'Delivery', lines: ['Vercel'] }
  ]

  return (
    <Page description="Developer of this website." title="Developer">
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ flex: '1 1 auto' }}>
          <Information title="Developer of this website." as="h1">
            Hello, I&apos;m <strong>Devollox</strong>. This page is a small peek
            behind the curtain — how this site is built, why it looks and
            behaves the way it does, and what kind of problems it tries to
            solve.
            <br />
            Most of the ideas here started as tiny experiments: animations,
            realtime features, small tools and interface patterns that felt fun
            first and useful second.
          </Information>
        </div>
      </div>

      <section
        style={{
          marginBottom: '2.5rem',
          alignItems: 'flex-start'
        }}
      >
        <Information title="Under the hood" as="h2">
          The site runs on modern React with routing, theming and realtime
          features wired into a single cohesive interface instead of a pile of
          disconnected pages.
          <br />
          Signatures, presence, search, theming and content all share the same
          design language: short feedback loops, smooth state changes and
          minimal configuration on the surface.
        </Information>
        <StackCard
          title="Stack in heavy rotation"
          badge="Daily driver"
          sections={sections}
        />
      </section>

      <section
        style={{
          marginTop: '40px',
          marginBottom: '2.5rem',
          alignItems: 'stretch'
        }}
      >
        <Information title="Why this site exists" as="h2">
          It&apos;s not just a portfolio. It&apos;s a sandbox to try out
          patterns, measure how they feel over time and keep the parts that age
          well. Some things ship quickly and get removed just as quickly. Others
          evolve into stable features that feel invisible in the best way
          possible.
        </Information>
        <QuoteHero
          badgeText={'still building.'}
          name={'Devollox'}
          subtitle={'Builder. Performance. Solver.'}
          text={`
                        If something feels smooth here, it&apos;s on purpose. If something
            feels a bit odd, it&apos;s probably being experimented on.
            `}
        />
      </section>
      <section
        style={{
          marginTop: '40px',
          marginBottom: '2.5rem',
          alignItems: 'stretch'
        }}
      >
        <Information title="Team" as="h2">
          The &quot;team&quot; is mostly one developer shipping experiments,
          plus one very patient friend trying to break them before anyone else
          can.
        </Information>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          <AvatarCard name="Devollox" tooltip="writes the bugs." />
          <AvatarCard
            name="White"
            tooltip="finds the bugs."
            avatarSrc="white"
          />
        </div>
      </section>
      <Quote
        title="On shipping experiments."
        quote="Most of the time, the only way to know if an idea works is to ship it, live with it, and then decide whether it deserves to stay."
        author="Devollox"
      />
    </Page>
  )
}

export default DeveloperPage
