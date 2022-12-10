import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import ChtInstance from './ChtInstance'
import Doc from './Doc'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public desc: string

  @column()
  public running: boolean

  @column()
  public progress: number

  @column()
  public filePath: string

  @column.dateTime({ autoCreate: false })
  public startDate: DateTime

  @column.dateTime({ autoCreate: false })
  public endDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public instanceId: number

  @belongsTo(() => ChtInstance)
  public chtInstance: BelongsTo<typeof ChtInstance>

  @hasMany(() => Doc)
  public doc: HasMany<typeof Doc>
}
