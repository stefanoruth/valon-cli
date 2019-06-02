import { TableStyle } from './TableStyle'

export class TableRow {
	/**
	 * Text string to render.
	 */
	protected line: string = ''

	/**
	 * Initialate a new row.
	 */
	constructor(protected row: object, protected columnsWidth: number[], protected style: TableStyle) {}

	/**
	 * Build the row.
	 */
	render(): string {
		const keys = Object.keys(this.row)

		this.columnsWidth.forEach((width, key) => {
			if (!keys[key]) {
				this.line += this.style.fillEmpty(width)
				this.line += this.style.columnDivider(key + 1 !== this.columnsWidth.length)
				return
			}

			const objectKey = keys[key]

			if (!(this.row as any)[objectKey]) {
				this.line += this.style.fillEmpty(width)
				this.line += this.style.columnDivider(key + 1 !== this.columnsWidth.length)
				return
			}

			const text: string = String((this.row as any)[objectKey])

			this.line += this.style.pad(text, width)
			this.line += this.style.columnDivider(key + 1 !== this.columnsWidth.length)
		})

		return this.style.wrapRow(this.line)
	}
}
