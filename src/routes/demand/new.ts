import { body } from 'express-validator'
import express from 'express'

import { demand_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { demand_created_pub } from 'demand/src/events/pub'

const router = express.Router()

router.post(
	'/api/demands',
	require_auth(['orderer']),
	body('title', 'title must be between 5 and 30 characters').isLength({ min: 5, max: 30 }),
	body('resume', 'resume must not be empty').notEmpty(),
	body('description', 'description must not be empty').notEmpty(),
	validate_request,
	async (req, res) => {
		const orderer_id = req.current_user!.user_id
		const { title, resume, description } = req.body

		const [demand] = await demand_model.insert({ orderer_id, title, resume, description, status: 'OPEN' })

		await demand_created_pub.publish({ id: demand.id, orderer_id: demand.orderer_id, status: demand.status })

		res.status(201).json({ demand })
	}
)

export { router as new_demand_router }
