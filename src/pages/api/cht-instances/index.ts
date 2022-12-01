import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthenticated' })
  }

  const result = await prisma.chtInstance.findMany({
    where: {
      authorId: session.user.sub,
    },
  })

  return res.json(result)
}

export default handler
