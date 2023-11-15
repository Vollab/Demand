import { JsMsg } from 'nats'

import { orderer_model, user_model } from '../../models'
import { orderer_created_consumer } from '../consumers'

import { OrdererCreatedEvent } from 'common/types/events/orderer'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class OrdererCreatedSub extends Subscriber<OrdererCreatedEvent> {
	private static _instance: OrdererCreatedSub = new OrdererCreatedSub()

	protected consumer = orderer_created_consumer

	readonly subject = Subjects.OrdererCreated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id, name, email, created_at, updated_at } = this.parseMessage(msg.data)

		await user_model.insert({ id, name, email, created_at, updated_at })
		await orderer_model.insert({ id })
		msg.ack()
	}
}

const instance = OrdererCreatedSub.instance
export { instance as orderer_created_sub }
