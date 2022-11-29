import { getSessionToken } from '../../../helpers/jwt'
import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  const session = await getSessionToken({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthenticated' })
  }

  const result = await prisma.chtInstance.findMany({
    where: {
      authorId: session.sub,
    },
  })

  return res.json(result)
}

export default handler
