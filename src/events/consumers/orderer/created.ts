import { orderer_stream } from 'common/global/streams'
import { Consumer } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class OrdererCreatedConsumer extends Consumer {
	private static _instance: OrdererCreatedConsumer = new OrdererCreatedConsumer()

	protected stream = orderer_stream
	readonly subject = Subjects.OrdererCreated
	readonly durable_name = 'Demand:OrdererCreated'
	readonly queue_group = 'queue'

	static get instance() {
		return this._instance
	}
}

const instance = OrdererCreatedConsumer.instance
export { instance as orderer_created_consumer }
