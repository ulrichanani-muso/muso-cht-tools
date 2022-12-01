import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async profile({ user }: HttpContextContract) {
    return { data: user }
  }
}
