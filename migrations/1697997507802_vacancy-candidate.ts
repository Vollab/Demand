import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
	pgm.addType('vacancy_candidate_status', ['PENDING', 'REFUSED', 'APPROVED', 'ACCEPTED', 'WAIVER'])
	pgm.createTable(
		{ schema: 'demand', name: 'vacancy_candidate' },
		{
			vacancy_id: {
				type: 'uuid',
				notNull: true,
				primaryKey: true,
				references: 'vacancy'
			},
			candidate_id: {
				type: 'uuid',
				notNull: true,
				primaryKey: true,
				references: 'candidate'
			},
			status: {
				type: 'vacancy_candidate_status',
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
}

export async function down(pgm: MigrationBuilder): Promise<void> {
	pgm.dropTable('vacancy_candidate')
}
