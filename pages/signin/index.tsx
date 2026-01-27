import SignaturePrimaryButton from '@components/button/signature-primary-btn'
import Page from '@components/page'
import Quote from '@components/quote'
import { signIn } from 'next-auth/react'

const SignInPage = () => {
  const callbackUrl = '/signature'

  const handleSignInGitHub = () => {
    signIn('github', { callbackUrl })
  }

  const handleSignInGoogle = () => {
    signIn('google', { callbackUrl })
  }

  return (
    <Page description="Sign In." title="Sign In">
      <Quote
        title="Sign in to leave your signature."
        quote="Please don’t draw anything cursed. Or do, but make it funny."
        author="Devollox"
      />

      <div
        style={{
          marginTop: '1.5rem'
        }}
      >
        <p
          style={{
            fontSize: '0.9rem',
            opacity: 0.8,
            marginBottom: '0.5rem'
          }}
        >
          Choose a provider to continue:
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxWidth: '100%'
          }}
        >
          <SignaturePrimaryButton onClick={handleSignInGitHub}>
            Sign in with GitHub
          </SignaturePrimaryButton>
          <SignaturePrimaryButton onClick={handleSignInGoogle}>
            Sign in with Google
          </SignaturePrimaryButton>
        </div>
      </div>
    </Page>
  )
}

export default SignInPage
