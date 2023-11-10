import { DemandUpdatedEvent } from 'common/types/events/demand'
import { Publisher } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandUpdatedPub extends Publisher<DemandUpdatedEvent> {
	private static _instance: DemandUpdatedPub = new DemandUpdatedPub()

	readonly subject = Subjects.DemandUpdated

	static get instance() {
		return this._instance
	}
}

const instance = DemandUpdatedPub.instance
export { instance as demand_updated_pub }
