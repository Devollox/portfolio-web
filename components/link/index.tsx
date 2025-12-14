import cn from 'classnames'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import {
  AnchorHTMLAttributes,
  ForwardedRef,
  ReactNode,
  forwardRef,
  memo
} from 'react'
import styles from './link.module.scss'

type LinkOwnProps = {
  external?: boolean
  underline?: boolean
  gray?: boolean
  children: ReactNode
  className?: string
}

type Props = LinkOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Pick<NextLinkProps, 'href' | 'as' | 'passHref'>

const canPrefetch = (href?: string | NextLinkProps['href']) => {
  if (!href || typeof href !== 'string' || !href.startsWith('/')) {
    return false
  }
  return true
}

const Link = forwardRef<HTMLAnchorElement, Props>(
  (
    {
      external,
      href,
      as,
      passHref,
      children,
      className,
      underline,
      gray,
      ...props
    },
    ref: ForwardedRef<HTMLAnchorElement>
  ) => {
    const c = cn(className, styles.reset, {
      [styles.gray]: gray,
      [styles.underline]: underline
    })

    if (external) {
      return (
        <a
          href={typeof href === 'string' ? href : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={c}
          ref={ref}
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <NextLink
        href={href ?? '#'}
        as={as}
        prefetch={canPrefetch(href) ? undefined : false}
        passHref={passHref}
        className={c}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = 'Link'

export default memo(Link)
