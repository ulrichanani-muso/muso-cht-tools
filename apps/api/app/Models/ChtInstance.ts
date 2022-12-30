import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import { compose } from '@ioc:Adonis/Core/Helpers'

export enum EnvironmentType {
  'production',
  'development',
  'local',
  'test'
}

export default class ChtInstance extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description?: string

  @column()
  public environment: EnvironmentType

  @column()
  public url: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  @column()
  public userId: number

  @hasOne(() => User)
  public user: HasOne<typeof User>
}
