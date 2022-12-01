import { getToken as getTokenBase } from 'next-auth/jwt'
import * as jwt from 'jsonwebtoken'
import { getSession } from 'next-auth/react'
import { getCookie } from './cookie'

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

const getCookieToken = () => {
  return getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME)
}

export { getToken, getUserId, getCookieToken }
