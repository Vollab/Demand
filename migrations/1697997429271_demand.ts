import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addType('demand_status', ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'])
	pgm.createTable(
		{ schema: 'demand', name: 'demand' },
		{
			id: {
				type: 'uuid',
				default: pgm.func('gen_random_uuid()'),
				notNull: true,
				primaryKey: true
			},
			orderer_id: {
				type: 'uuid',
				notNull: true,
				references: 'orderer',
				onDelete: 'CASCADE'
			},
			title: {
				type: 'varchar(80)',
				notNull: true
			},
			resume: {
				type: 'text',
				notNull: true
			},
			description: {
				type: 'text',
				notNull: true
			},
			status: {
				type: 'demand_status',
				notNull: true
			},
			created_at: {
				type: 'timestamp with time zone',
				notNull: true,
				default: pgm.func("(now() at time zone 'utc')")
			},
			updated_at: {
				type: 'timestamp with time zone',
				notNull: true,
				default: pgm.func("(now() at time zone 'utc')")
			}
		}
	)

	pgm.createTrigger('demand', 'updated_at', {
		when: 'BEFORE',
		operation: 'UPDATE',
		function: 'update_updated_at',
		level: 'ROW'
	})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTrigger('demand', 'updated_at', { ifExists: true })
	pgm.dropTable('demand')
	pgm.dropType('demand_status')
}
