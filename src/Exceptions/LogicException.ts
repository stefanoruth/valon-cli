export class LogicException extends Error {
	constructor(...args: any[]) {
		super(...args)
		this.name = this.constructor.name
	}
}
