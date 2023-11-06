import { param } from 'express-validator'
import express from 'express'

import { demand_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'

const router = express.Router()

router.get('/api/demands', require_auth(['orderer', 'candidate']), async (req, res) => {
	const demands = await demand_model.findAll()

	res.status(200).json({ demands })
})

router.get(
	'/api/demands/:demand_id',
	require_auth(['orderer', 'candidate']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	validate_request,
	async (req, res) => {
		const { demand_id } = req.params

		const [demand] = await demand_model.findById(demand_id)

		res.status(200).json({ demand })
	}
)

export { router as find_demand_router }
