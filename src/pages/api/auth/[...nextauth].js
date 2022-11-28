import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import * as jwt from 'jsonwebtoken'
import prisma from '../../../../lib/prisma.ts'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // session: {
  //   strategy: 'jwt',
  // },
  // jwt: {
  //   secret: process.env.NEXTAUTH_SECRET,
  //   encode: async ({ secret, token }) => jwt.sign({ ...token, userId: token.id }, secret, {
  //     algorithm: 'HS256',
  //     expiresIn: 30 * 24 * 60 * 60, // 30 days
  //   }),
  //   decode: async ({ secret, token }) => jwt.verify(token, secret, { algorithms: ['HS256'] }),
  // },
}

export default NextAuth(authOptions)
