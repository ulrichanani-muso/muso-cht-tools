import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  const session = await getSession({ req })

  if (!session) {
    return res.state(401).json({ error: 'Unauthenticated' })
  }

  const result = await prisma.chtInstance.findMany({
    where: {
      author: { email: session.user.email },
    },
  })

  return res.json(result)
}

export default handler
