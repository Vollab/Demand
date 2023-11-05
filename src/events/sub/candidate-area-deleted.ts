import { JsMsg } from 'nats'

import { candidate_area_model } from '../../models'

import { CandidateAreaDeletedEvent } from 'common/types/events/candidate-area'
import { candidate_area_deleted_consumer } from 'common/global/consumers'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class CandidateAreaDeletedSub extends Subscriber<CandidateAreaDeletedEvent> {
	private static _instance: CandidateAreaDeletedSub = new CandidateAreaDeletedSub()

	protected consumer = candidate_area_deleted_consumer

	readonly subject = Subjects.CandidateAreaDeleted

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { candidate_id, activity_area_id } = this.parseMessage(msg.data)

		await candidate_area_model.delete(candidate_id, activity_area_id)

		msg.ack()
	}
}

const instance = CandidateAreaDeletedSub.instance
export { instance as candidate_area_deleted_sub }
