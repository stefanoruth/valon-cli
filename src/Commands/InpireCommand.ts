import { Command } from '../Command/Command'
import { setInterval, setTimeout } from 'timers'
import { Signature } from '../Command/Signature'
import { Argument } from '../Command/Argument'
import { Option } from '../Command/Option'

function sleep(time: any) {
	const stop = new Date().getTime()
	while (new Date().getTime() < stop + time) {
		//
	}
}

export class InspireCommand extends Command {
	name = 'demo:inspire'
	signature = new Signature([new Argument('demo'), new Option('epic')])

	async handle() {
		console.log(this)

		this.output.success('Success')
		this.output.error('Error')
		this.output.warning('Warning')
		this.output.note('Note')
		this.output.caution('Caution')

		const progress = this.output.progressBar(10)

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		sleep(2000)

		progress.advance()

		progress.finish()

		// console.log(await this.output.confirm('Are you okay?'))

		console.log('Quote')
	}
}
