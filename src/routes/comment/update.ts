import { body, param } from 'express-validator'
import express from 'express'

import { comment_model, demand_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { NotFoundError } from 'common/errors'

const router = express.Router()

router.patch(
	'/api/demands/:demand_id/comments/:comment_id',
	require_auth(['orderer', 'candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	body('text', 'text must have at least 5 characters').isLength({ min: 5, max: 30 }).optional(),
	validate_request,
	async (req, res) => {
		const user_id = req.current_user!.user_id
		const { demand_id, comment_id } = req.params
		const { text } = req.body

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [comment] = await comment_model.update(comment_id, user_id, text)
		if (!comment) throw new NotFoundError('Comment not found!')

		res.status(200).json({ comment })
	}
)

export { router as update_comment_router }
