import { getUserId } from 'src/helpers/auth'
import prisma from '../../../../lib/prisma'

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Route not found' })
  }

  const userId = await getUserId({ req })
  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' })
  }

  const result = await prisma.chtInstance.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      environment: req.body.environment,
      url: req.body.url,
      username: req.body.username,
      password: req.body.password,
      authorId: userId,
    },
  })

  return res.json(result)
}

export default handler
