import { body, param } from 'express-validator'
import express from 'express'

import { demand_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { demand_updated_pub } from 'demand/src/events/pub'

const router = express.Router()

router.patch(
	'/api/demands/:demand_id',
	require_auth(['orderer']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	body('title', 'title must be between 5 and 30 characters').isLength({ min: 5, max: 30 }).optional(),
	body('resume', 'resume must not be empty').optional(),
	body('description', 'description must not be empty').optional(),
	validate_request,
	async (req, res) => {
		const orderer_id = req.current_user!.user_id
		const { demand_id } = req.params
		const { title, resume, description } = req.body

		const [demand] = await demand_model.update(demand_id, orderer_id, { title, resume, description })

		await demand_updated_pub.publish({ id: demand.id, status: demand.status })

		res.status(200).json({ demand })
	}
)

export { router as update_demand_router }
