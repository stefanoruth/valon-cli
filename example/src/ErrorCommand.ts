import { Command } from 'valon'

export class ErrorCommand extends Command {
	name = 'example:error'

	async handle() {
		throw new Error('My Error is shown')
	}
}
