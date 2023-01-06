import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('progress_label')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('progress_label')
    })
  }
}
