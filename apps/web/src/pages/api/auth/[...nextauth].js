import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import * as jwt from 'jsonwebtoken'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encode: async ({ secret, token }) => jwt.sign({ ...token, userId: token.id }, secret, {
      algorithm: 'HS256',
      expiresIn: 10 * 24 * 60 * 60, // 10 days
    }),
    decode: async ({ secret, token }) => jwt.verify(token, secret, { algorithms: ['HS256'] }),
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user.sub = token.sub
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME,
      options: {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        secure: false,
      },
    },
  },
}

export default NextAuth(authOptions)
