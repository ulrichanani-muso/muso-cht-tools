import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.string('desc')
      table.integer('progress')
      table.boolean('running')
      table.string('file_path')
      table.timestamp('start_date', { useTz: true })
      table.timestamp('end_date', { useTz: true })

      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.integer('instance_id').unsigned().references('cht_instances.id').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
