import { getToken } from 'next-auth/jwt'
import * as jwt from 'jsonwebtoken'

const getSessionToken: Promise<jwt.JwtPayload | null> = async ({ req }) => {
  const token = await getToken({ req, raw: true })

  if (!token) {
    return
  }

  const session = await jwt.verify(token, process.env.NEXTAUTH_SECRET)

  return session
}

export { getSessionToken }
