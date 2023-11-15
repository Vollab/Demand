import { JsMsg } from 'nats'

import { orderer_model, user_model } from '../../models'
import { orderer_updated_consumer } from '../consumers'

import { OrdererUpdatedEvent } from 'common/types/events/orderer'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class OrderererUpdatedSub extends Subscriber<OrdererUpdatedEvent> {
	private static _instance: OrderererUpdatedSub = new OrderererUpdatedSub()

	protected consumer = orderer_updated_consumer

	readonly subject = Subjects.OrdererUpdated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id, name, updated_at } = this.parseMessage(msg.data)

		await user_model.update(id, { name, updated_at })
		await orderer_model.update(id, {})

		msg.ack()
	}
}

const instance = OrderererUpdatedSub.instance
export { instance as orderer_updated_sub }
