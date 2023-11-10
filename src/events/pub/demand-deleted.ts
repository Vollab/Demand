import { DemandDeletedEvent } from 'common/types/events/demand'
import { Publisher } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandDeletedPub extends Publisher<DemandDeletedEvent> {
	private static _instance: DemandDeletedPub = new DemandDeletedPub()

	readonly subject = Subjects.DemandDeleted

	static get instance() {
		return this._instance
	}
}

const instance = DemandDeletedPub.instance
export { instance as demand_deleted_pub }
