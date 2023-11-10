import { param } from 'express-validator'
import express from 'express'

import { demand_model } from '../../models'

import { require_auth, validate_request } from 'common/middlewares'
import { demand_deleted_pub } from 'demand/src/events/pub'

const router = express.Router()

router.delete(
	'/api/demands/:demand_id',
	require_auth(['orderer']),
	param('demand_id', 'demand id must be a valid UUID').isUUID().notEmpty(),
	validate_request,
	async (req, res) => {
		const orderer_id = req.current_user!.user_id
		const { demand_id } = req.params

		const [demand] = await demand_model.delete(demand_id, orderer_id)

		await demand_deleted_pub.publish({ id: demand.id })

		res.status(200).json({ demand })
	}
)

export { router as delete_demand_router }
