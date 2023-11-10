import { DemandCreatedEvent } from 'common/types/events/demand'
import { Publisher } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandCreatedPub extends Publisher<DemandCreatedEvent> {
	private static _instance: DemandCreatedPub = new DemandCreatedPub()

	readonly subject = Subjects.DemandCreated

	static get instance() {
		return this._instance
	}
}

const instance = DemandCreatedPub.instance
export { instance as demand_created_pub }
