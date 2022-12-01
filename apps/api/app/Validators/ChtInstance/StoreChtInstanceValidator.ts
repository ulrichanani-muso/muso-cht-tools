import { schema } from '@ioc:Adonis/Core/Validator'
import { EnvironmentType } from 'App/Models/ChtInstance'
import BaseValidator, { defaultMessages } from '../BaseValidator'

export default class StoreChtInstanceValidator extends BaseValidator {
  public schema = schema.create({
    name: schema.string(),
    description: schema.string.optional(),
    environment: schema.enum(Object.values(EnvironmentType)),
    url: schema.string(),
    username: schema.string(),
    password: schema.string(),
  })

  // public messages: CustomMessages = {
  //   ...defaultMessages,
  // }
}
