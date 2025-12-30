import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = (user as any)?.id ?? token.sub
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      if (session.user) {
        ;(session.user as any).id = token.id ?? token.sub
      }
      return session
    }
  },
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt'
  }
}

export default NextAuth(authOptions)
