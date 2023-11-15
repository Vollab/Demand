import { param } from 'express-validator'
import express from 'express'

import { comment_model, demand_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { NotFoundError } from 'common/errors'

const router = express.Router()

router.delete(
	'/api/demands/:demand_id/comments/:comment_id',
	require_auth(['orderer', 'candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	param('comment_id', 'comment id must be a valid UUID').isUUID().notEmpty(),
	validate_request,
	async (req, res) => {
		const user_id = req.current_user!.user_id
		const { demand_id, comment_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [comment] = await comment_model.delete(comment_id, user_id)

		res.status(200).json({ comment })
	}
)

export { router as delete_comment_router }
