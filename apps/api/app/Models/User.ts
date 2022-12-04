import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ChtInstance from './ChtInstance'
import Service from './Service'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public email: string

  @column()
  public avatar: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public password?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => ChtInstance)
  public chtInstances: HasMany<typeof ChtInstance>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>
}
