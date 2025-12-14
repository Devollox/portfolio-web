import { signIn, signOut, useSession } from 'next-auth/react'
import AuthButton from './auth-btn'

const AuthToggle = () => {
  const { data: session } = useSession()

  if (session) {
    return <AuthButton onClick={() => signOut()} label="Sign out" />
  }

  return <AuthButton onClick={() => signIn()} label="Sign in" />
}

export default AuthToggle
