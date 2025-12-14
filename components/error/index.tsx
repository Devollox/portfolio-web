import Page from '@components/page'
import Quote from '@components/quote'
import { GameOfLife } from '@lib/game-of-life'
import { ReactNode } from 'react'
import styles from './error.module.scss'

type ErrorProps = {
  status?: number | string
  children?: ReactNode
}

const Error = ({ status, children }: ErrorProps) => {
  GameOfLife()

  return (
    <div className={styles.wrapper_content}>
      <div id="Canvas"></div>
      <Page title={status || 'Error'} style={{ marginBottom: '0px' }}>
        {status === 404 ? (
          <Quote
            title="This page cannot be found."
            quote="It doesn’t exist, it never has. I’m nostalgic for a place that never existed."
            author="Aaron Swartz"
          />
        ) : status === 400 ? (
          <Quote
            title="This page is under development."
            quote="When I'm working on a task, I don't think about beauty. I only think about how to solve the problem. But when the finished solution doesn't look pretty, I know it's wrong."
            author="Buckminster Fuller"
          />
        ) : (
          <section className={styles.section}>
            <span>{status || '?'}</span>
            <p>An error occurred.</p>
          </section>
        )}
        <main>{children}</main>
      </Page>
    </div>
  )
}

export default Error
