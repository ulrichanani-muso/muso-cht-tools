import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ChtInstance from 'App/Models/ChtInstance'

export default class ChtInstancesController {
  public async index({ user }: HttpContextContract) {
    const users = await ChtInstance.query().where('user_id', user.id)

    return { data: users }
  }
}
