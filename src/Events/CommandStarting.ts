import { Input } from '../Input'
import { Output } from '../Output'

export class CommandStarting {
	constructor(public command: string | undefined, public input: Input, public output: Output) {}
}
