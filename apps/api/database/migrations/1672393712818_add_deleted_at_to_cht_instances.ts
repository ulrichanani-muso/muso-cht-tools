import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cht_instances'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('deleted_at')
    })
  }
}
