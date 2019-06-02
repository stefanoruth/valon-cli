import { Command } from '../Command'

export class TableCommand extends Command {
	name = 'test:table'

	async handle() {
		const rows = [
			{ id: 1, name: 'Foo' },
			{ id: 2, name: 'Bar' },
			{ id: 3, name: 'Baz' },
			{ id: 1020, name: 'Foobar', text: 'A long description here.' },
			{ id: 5 },
		]

		this.output.table(rows)
	}
}
