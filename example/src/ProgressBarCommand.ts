import { Command } from 'kodo-console'

export class ProgressBarCommand extends Command {
	name = 'example:bar'

	async handle() {
		const bar = this.output.progressBar()
		bar.start(200)

		let i = 0
		while (i < 200) {
			bar.advance()

			this.sleep(10)

			i++
		}

		bar.finish()
	}

	protected sleep(time: any) {
		const stop = new Date().getTime()
		while (new Date().getTime() < stop + time) {
			//
		}
	}
}
