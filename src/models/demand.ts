import { PartialOmit } from 'common/types/utility'
import { database } from 'common/services'

export type DemandStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'

export interface Demand {
	id: string
	orderer_id: string
	title: string
	resume: string
	description: string
	status: DemandStatus
	created_at: Date
	updated_at: Date
}

type UpdateDemand = PartialOmit<Demand, 'id' | 'orderer_id' | 'updated_at' | 'created_at'>

class DemandModel {
	constructor(private db: typeof database) {}

	async findById(id: Demand['id']) {
		return this.db.query<Demand>(
			`
			SELECT
				*
			FROM
				demand.demand
			WHERE
				id = $1
			;`,
			[id]
		)
	}

	async findByOrdererId(orderer_id: Demand['orderer_id']) {
		return this.db.query<Demand>(
			`
			SELECT
				*
			FROM
				demand.demand
			WHERE
				orderer_id = $1
			;`,
			[orderer_id]
		)
	}

	async findByIdAndOrdererId(id: Demand['id'], orderer_id: Demand['orderer_id']) {
		return this.db.query<Demand>(
			`
			SELECT
				*
			FROM
				demand.demand
			WHERE
				id = $1
			AND
				orderer_id = $2
			;`,
			[id, orderer_id]
		)
	}

	async insert(candidate: Omit<Demand, 'id' | 'updated_at' | 'created_at'>) {
		const { orderer_id, title, resume, description, status } = candidate

		return this.db.query<Demand>(
			`
			INSERT INTO
				demand.demand (orderer_id, title, resume, description, status)
			VALUES
				($1, $2, $3, $4, $5)
			RETURNING
				*
			;`,
			[orderer_id, title, resume, description, status]
		)
	}

	async update(id: Demand['id'], orderer_id: Demand['orderer_id'], candidate: UpdateDemand) {
		const entries = Object.entries(candidate).filter(e => e[1])
		if (entries.length === 0) return []
		const keys = entries.map((e, i) => `${e[0]} = $${i + 3}`)
		const values = entries.map(e => e[1])

		return this.db.query<Demand>(
			`
			UPDATE
				demand.demand
			SET
				${keys.join(', ')}
			WHERE
				id = $1
			AND
				orderer_id = $2
			RETURNING
				*
			;`,
			[id, orderer_id, ...values]
		)
	}

	async delete(id: Demand['id'], orderer_id: Demand['orderer_id']) {
		return this.db.query<Demand>(
			`
			DELETE FROM
				demand.demand
			WHERE
        id = $1
			AND
				orderer_id = $2
			RETURNING
				*
			;`,
			[id, orderer_id]
		)
	}
}

export const demand_model = new DemandModel(database)
