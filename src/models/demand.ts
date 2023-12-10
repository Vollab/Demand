import { PartialOmit } from 'common/types/utility'
import { database } from 'common/services'

import { FullOrderer } from './full-orderer'
import e from 'express'

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

export interface DemandWithOrderer extends Omit<Demand, 'orderer_id'> {
	orderer: Pick<FullOrderer, 'id' | 'name'>
}

type UpdateDemand = PartialOmit<Demand, 'id' | 'orderer_id' | 'updated_at' | 'created_at'>

class DemandModel {
	constructor(private db: typeof database) {}

	async findAll() {
		return this.db.query<DemandWithOrderer>(
			`
			SELECT
				d.id,
				d.title,
				d.resume,
				d.description,
				d.status,
				d.created_at,
				d.updated_at,
				json_build_object('id', o.id, 'name', o.name) orderer
			FROM
				demand.demand d
			JOIN
				demand.full_orderer o
			ON
				d.orderer_id = o.id
			;`
		)
	}

	async findById(id: Demand['id']) {
		return this.db.query<DemandWithOrderer>(
			`
			SELECT
				d.id,
				d.title,
				d.resume,
				d.description,
				d.status,
				d.created_at,
				d.updated_at,
				json_build_object('id', o.id, 'name', o.name) orderer
			FROM
				demand.demand d
			JOIN
				demand.full_orderer o
			ON
				d.orderer_id = o.id
			WHERE
				d.id = $1
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

	async insert(demand: Omit<Demand, 'id' | 'updated_at' | 'created_at'>) {
		const { orderer_id, title, resume, description, status } = demand

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

	async update(id: Demand['id'], orderer_id: Demand['orderer_id'], demand: UpdateDemand) {
		const entries = Object.entries(demand).filter(e => e[1])
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
