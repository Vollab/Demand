import { database } from 'common/services'

export interface User {
	id: string
	email: string
	name: string
	updated_at: string
	created_at: string
}

class UserModel {
	constructor(private db: typeof database) {}

	async findByEmail(email: User['email']) {
		return this.db.query<User>(
			`
			SELECT
				*
			FROM
				demand.user
			WHERE
				email = $1
			LIMIT
				1
			;`,
			[email]
		)
	}
}

export const user_model = new UserModel(database)
