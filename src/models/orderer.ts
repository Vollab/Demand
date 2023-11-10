import { database } from 'common/services'
import { User } from './user'
import { PartialOmit } from 'common/types/utility'

export interface Orderer extends User {}

class OrdererModel {
	constructor(private db: typeof database) {}

	async findByEmail(email: Orderer['email']) {
		return this.db.query<Orderer>(
			`
			SELECT
				*
			FROM
				demand.orderer
			WHERE
				email = $1
			;`,
			[email]
		)
	}

	async insert(orderer: Omit<Orderer, 'updated_at' | 'created_at'>) {
		const { id, name, email } = orderer

		return this.db.query<Orderer>(
			`
			INSERT INTO
				demand.orderer (id, name, email)
			VALUES
				($1, $2, $3)
			RETURNING
				*
			;`,
			[id, name, email]
		)
	}

	async update(id: Orderer['id'], orderer: PartialOmit<Orderer, 'id' | 'updated_at' | 'created_at'>) {
		const entries = Object.entries(orderer)
		if (entries.length === 0) return []
		const keys = entries.map((e, i) => `${e[0]} = $${i + 2}`)
		const values = entries.map(e => e[1])

		return this.db.query<Orderer>(
			`
			UPDATE
				demand.orderer
			SET
				${keys.join(', ')}
			WHERE
				id = $1
			RETURNING
				*
			;`,
			[id, ...values]
		)
	}
}

export const orderer_model = new OrdererModel(database)
