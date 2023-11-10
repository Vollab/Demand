import { orderer_stream } from 'common/global/streams'
import { Consumer } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class OrdererUpdatedConsumer extends Consumer {
	private static _instance: OrdererUpdatedConsumer = new OrdererUpdatedConsumer()

	protected stream = orderer_stream
	readonly subject = Subjects.OrdererUpdated
	readonly durable_name = 'Demand:OrdererUpdated'
	readonly queue_group = 'queue'

	static get instance() {
		return this._instance
	}
}

const instance = OrdererUpdatedConsumer.instance
export { instance as orderer_updated_consumer }
