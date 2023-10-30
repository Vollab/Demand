import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.createTable(
		{ schema: 'demand', name: 'candidate_area' },
		{
			candiadte_id: {
				type: 'uuid',
				notNull: true,
				primaryKey: true,
				references: 'candidate'
			},
			activity_area_id: {
				type: 'uuid',
				notNull: true,
				primaryKey: true,
				references: 'activity_area'
			}
		}
	)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('candidate_area')
}
