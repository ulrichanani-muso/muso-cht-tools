import { getToken as getTokenBase } from 'next-auth/jwt'
import * as jwt from 'jsonwebtoken'
import { getSession } from 'next-auth/react'

const getToken: Promise<jwt.JwtPayload | null> = async ({ req }) => {
  const token = await getTokenBase({ req, raw: true })

  if (!token) {
    return
  }

  const session = await jwt.verify(token, process.env.NEXTAUTH_SECRET)

  return session
}

const getUserId = async ({ req }) => {
  const session = await getSession({ req })

  return session?.user?.sub
}

export { getToken, getUserId }
