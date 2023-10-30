import { candidate_created_sub, orderer_created_sub, customer_updated_sub } from './events/sub'
import { app } from './app'

import { logger, checkEnv, database } from 'common/services'
import { nats_stream } from 'common/services/nats'

const start = async () => {
	try {
		checkEnv('SERVER_PORT', 'PG_HOST', 'PG_USER', 'PG_PASS', 'PG_DB', 'NATS_HOST', 'JWT_KEY')

		await nats_stream.connect({ servers: process.env.NATS_HOST!, name: 'nats' })

		await database.connect({
			host: process.env.PG_HOST,
			user: process.env.PG_USER,
			password: process.env.PG_PASS,
			database: process.env.PG_DB,
			min: 0,
			max: 7
		})

		await orderer_created_sub.subscribe()
		await customer_updated_sub.subscribe()
		await candidate_created_sub.subscribe()

		app.listen(process.env.SERVER_PORT!, () => logger.info(`${logger.BRIGHT('Listening on port:')} ${process.env.SERVER_PORT!}`))
	} catch (error) {
		logger.error(error)
	}
}

start()
