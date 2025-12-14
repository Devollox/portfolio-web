import Head from '@components/head'
import Header from '@components/navbar'
import { CSSProperties, ReactNode } from 'react'
import homeStyles from './home-page.module.scss'
import pageStyles from './page.module.scss'

type PageVariant = 'default' | 'home'

type PageProps = {
  header?: boolean
  footer?: boolean
  title?: string | number
  description?: string
  image?: string
  style?: CSSProperties
  showHeaderTitle?: boolean
  variant?: PageVariant
  children?: ReactNode
}

const Page = ({
  header = true,
  title,
  description,
  image,
  style,
  showHeaderTitle = true,
  variant = 'default',
  children
}: PageProps) => {
  const isHome = variant === 'home'
  const styles = isHome ? homeStyles : pageStyles
  const headerTitle = isHome ? null : showHeaderTitle && title

  return (
    <div className={styles.wrapper} style={style}>
      <Head
        title={`${title ? `${title} - ` : ''}Devollox`}
        description={description}
        image={image}
      />

      {header && (
        <Header
          title={headerTitle}
          variant={isHome ? 'true' : undefined}
          variantKey={isHome ? 'true' : undefined}
        />
      )}

      <main className={styles.main}>{children}</main>
    </div>
  )
}

export default Page
