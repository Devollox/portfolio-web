import { ReactNode } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

type InformationProps = {
  title: string
  children: ReactNode
  as?: HeadingLevel
}

const Information = ({ title, children, as = 'h1' }: InformationProps) => {
  const HeadingTag = as

  return (
    <>
      <HeadingTag>{title}</HeadingTag>
      <p>{children}</p>
    </>
  )
}

export default Information
