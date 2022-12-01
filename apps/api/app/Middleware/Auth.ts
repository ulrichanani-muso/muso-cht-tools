import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpException from 'App/Exceptions/HttpException'
import * as jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class AuthMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authHeader = ctx.request.header('Authorization')

    if (!authHeader) {
      throw new HttpException('Unauthenticated', 401)
    }

    const accessToken = authHeader.slice(7)

    let decodedToken
    try {
      decodedToken = jwt.verify(accessToken, Env.get('JWT_SECRET'), { algorithms: ['HS256'] })
    } catch (error) {
      console.error(error)
      throw new HttpException('Unauthenticated', 401)
    }

    const user = await User.firstOrCreate({
      email: decodedToken.email,
    }, {
      name: decodedToken.name,
      uid: decodedToken.sub,
      avatar: decodedToken.picture,
    })

    ctx.user = user

    await next()
  }
}
