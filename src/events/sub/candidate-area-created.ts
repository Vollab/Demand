import { JsMsg } from 'nats'

import { candidate_area_model } from '../../models'

import { CandidateAreaCreatedEvent } from 'common/types/events/candidate-area'
import { candidate_area_created_consumer } from 'common/global/consumers'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class CandidateAreaCreatedSub extends Subscriber<CandidateAreaCreatedEvent> {
	private static _instance: CandidateAreaCreatedSub = new CandidateAreaCreatedSub()

	protected consumer = candidate_area_created_consumer

	readonly subject = Subjects.CandidateAreaCreated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { candidate_id, activity_area_id } = this.parseMessage(msg.data)

		await candidate_area_model.insert({ candidate_id, activity_area_id })

		msg.ack()
	}
}

const instance = CandidateAreaCreatedSub.instance
export { instance as candidate_area_created_sub }
