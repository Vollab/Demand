import { database } from 'common/services'

export interface Comment {
	id: string
	parent_id: string | null
	demand_id: string
	user_id: string
	text: string
	created_at: Date
	updated_at: Date
}

class CommentModel {
	constructor(private db: typeof database) {}

	async findById(id: Comment['id']) {
		return this.db.query<Comment>(
			`
			SELECT
				*
			FROM
				demand.comment
			WHERE
				id = $1
			;`,
			[id]
		)
	}

	async findByDemandId(demand_id: Comment['demand_id']) {
		return this.db.query<Comment>(
			`
			WITH RECURSIVE CommentTree AS (
				(
					SELECT
						*
					FROM
						demand.comment
					WHERE
						demand_id = $1
					AND
						parent_id IS NULL
					ORDER BY
						created_at
				)
			
				UNION ALL
			
				SELECT
					c.*
				FROM
					demand.comment c
				JOIN
					CommentTree ct ON c.parent_id = ct.id
			)
			
			SELECT
				*
			FROM
				CommentTree
			;`,
			[demand_id]
		)
	}

	async insert(demand: Omit<Comment, 'id' | 'updated_at' | 'created_at'>) {
		const { demand_id, user_id, parent_id, text } = demand

		return this.db.query<Comment>(
			`
			INSERT INTO
				demand.comment (demand_id, user_id, parent_id, text)
			VALUES
				($1, $2, $3, $4)
			RETURNING
				*
			;`,
			[demand_id, user_id, parent_id, text]
		)
	}

	async update(id: Comment['id'], user_id: Comment['user_id'], text: Comment['text']) {
		return this.db.query<Comment>(
			`
			UPDATE
				demand.comment
			SET
				text = $3
			WHERE
				id = $1
			AND
				user_id = $2
			RETURNING
				*
			;`,
			[id, user_id, text]
		)
	}

	async delete(id: Comment['id'], user_id: Comment['user_id']) {
		return this.db.query<Comment>(
			`
			DELETE FROM
				demand.comment
			WHERE
        id = $1
			AND
				user_id = $2
			RETURNING
				*
			;`,
			[id, user_id]
		)
	}
}

export const comment_model = new CommentModel(database)
