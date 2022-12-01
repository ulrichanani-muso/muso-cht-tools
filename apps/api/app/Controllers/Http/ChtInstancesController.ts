import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChtInstance from 'App/Models/ChtInstance'
import StoreChtInstanceValidator from 'App/Validators/ChtInstance/StoreChtInstanceValidator'

export default class ChtInstancesController {
  public async index({ user }: HttpContextContract) {
    const users = await ChtInstance.query().where('user_id', user.id)

    return { data: users }
  }

  public async store({ request, user }: HttpContextContract) {
    const data = await request.validate(StoreChtInstanceValidator)

    const instance = await user.related('chtInstances').create(data)

    return { data: instance }
  }

  public async show({ request, user }: HttpContextContract) {
    const instance = await user.related('chtInstances').query().where('id', request.params().id).firstOrFail()

    return { data: instance }
  }

  public async destroy({ request, user }: HttpContextContract) {
    const instance = await user.related('chtInstances').query().where('id', request.params().id).firstOrFail()

    return { data: instance }
  }
}
