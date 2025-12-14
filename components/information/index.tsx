import { ReactNode } from 'react'

type InformationProps = {
  title: string
  children: ReactNode
}

const Information = ({ title, children }: InformationProps) => {
  return (
    <>
      <h1>{title}</h1>
      <p style={{ margin: '20px 0 20px 0' }}>{children}</p>
    </>
  )
}

export default Information
