import Error from '@components/error'
import type { NextPage, NextPageContext } from 'next'

type Props = {
  status?: number | null
}

const E: NextPage<Props> = ({ status }) => {
  return <Error status={status ?? 404} />
}

E.getInitialProps = ({ res, err }: NextPageContext) => {
  const status = res ? res.statusCode : err ? (err as any).statusCode : 404
  return { status }
}

export default E
