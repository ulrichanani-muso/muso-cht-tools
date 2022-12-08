import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'

export default class Doc extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public key: string
  @column()
  public value: Object

  @column()
  public service_id: number

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
