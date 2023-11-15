import { param } from 'express-validator'
import express from 'express'

import { Comment, comment_model, demand_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { NotFoundError } from 'common/errors'

interface CommentReplies extends Comment {
	replies: CommentReplies[]
}

const router = express.Router()

router.get(
	'/api/demands/:demand_id/comments',
	require_auth(['orderer', 'candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	validate_request,
	async (req, res) => {
		const { demand_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const comments = await comment_model.findByDemandId(demand_id)

		const parsed_comments = comments.filter(c => !c.parent_id).map(c => replies(c as CommentReplies, comments as CommentReplies[]))

		res.status(200).json({ comments: parsed_comments })
	}
)

const replies = (comment: CommentReplies, comments: CommentReplies[]) => {
	comment.replies = comments.filter(c => c.parent_id === comment.id).map(c => replies(c, comments))
	return comment
}

router.get(
	'/api/demands/:demand_id/comments/:comment_id',
	require_auth(['orderer', 'candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	param('comment_id', 'comment id must be a valid UUID').isUUID().notEmpty(),
	validate_request,
	async (req, res) => {
		const { demand_id, comment_id } = req.params

		const [demand] = await demand_model.findById(demand_id)
		if (!demand) throw new NotFoundError('Demand not found!')

		const [comment] = await comment_model.findById(comment_id)

		res.status(200).json({ comment })
	}
)

export { router as find_comment_router }
