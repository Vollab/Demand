import { database } from 'common/services'
import { User } from './user'

type PartialOmit<T extends object, U extends keyof T> = { [K in Exclude<keyof T, U>]?: T[K] }

export interface Candidate extends User {
	id: string
	updated_at: string
	created_at: string
}

class CandidateModel {
	constructor(private db: typeof database) {}

	async findByEmail(email: Candidate['email']) {
		return this.db.query<Candidate>(
			`
			SELECT
				*
			FROM
				demand.candidate
			WHERE
				email = $1
			LIMIT
				1
			;`,
			[email]
		)
	}

	async insert(candidate: Omit<Candidate, 'updated_at' | 'created_at'>) {
		const { id, name, email } = candidate

		return this.db.query<Candidate>(
			`
			INSERT INTO
				demand.candidate (id, name, email)
			VALUES
				($1, $2, $3)
			RETURNING
				*
			;`,
			[id, name, email]
		)
	}

	async update(id: Candidate['id'], candidate: PartialOmit<Candidate, 'id'>) {
		const entries = Object.entries(candidate).filter(e => e[1])
		const keys = entries.map((e, i) => `${e[0]} = $${i + 2}`)
		const values = entries.map(e => e[1])

		return this.db.query<Candidate>(
			`
			UPDATE
				demand.candidate
			SET
				${keys.join(', ')}${keys.length !== 0 ? ',' : ''} updated_at = now() at time zone 'utc'
			WHERE
				id = $1
			RETURNING
				*
			;`,
			[id, ...values]
		)
	}
}

export const candidate_model = new CandidateModel(database)
