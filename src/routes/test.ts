import { require_auth } from 'common/middlewares'
import express from 'express'

const router = express.Router()

router.get('/api/test', require_auth(['candidate']), async (req, res) => {
	res.status(200).json()
})

export { router as test_router }
