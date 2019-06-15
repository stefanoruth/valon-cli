import { Application } from '../Application'
import { Signature } from '../Input/Signature'
import { Output } from '../Output/Output'
import { Input } from '../Input/Input'

export abstract class Command {
	protected abstract name: string
	protected description: string = ''
	protected help: string = ''
	protected signature: Signature = new Signature()
	protected application?: Application
	private _input?: Input
	private _output?: Output

	/**
	 * Start running the command from inside the Console.
	 */
	async execute(input: Input, output: Output) {
		this._input = input
		this._output = output

		return this.handle()
	}

	/**
	 * Fetch application.
	 */
	getApplication(): Application {
		if (!this.application) {
			throw new Error('Application has not been set for the Command')
		}
		return this.application
	}

	/**
	 * Set the application.
	 */
	setApplication(application?: Application) {
		this.application = application

		return this
	}

	/**
	 * Returns the command name.
	 */
	getName() {
		return this.name
	}

	/**
	 * Returns the command description.
	 */
	getDescription() {
		return this.description
	}

	/**
	 * Returns the help for the command.
	 */
	getHelp(): string {
		return this.help
	}

	/**
	 * Gets the InputDefinition attached to this Command.
	 */
	getSignature(): Signature {
		return this.signature
	}

	/**
	 * Fetch the output from the Application.
	 */
	get output() {
		if (!this._output) {
			throw new Error('Output has not yet been set')
		}

		return this._output
	}

	/**
	 * Fetch the input from the Application.
	 */
	get input() {
		if (!this._input) {
			throw new Error('Input has not yet been set')
		}

		return this._input
	}

	/**
	 * Handle what ever the command is suppose to do.
	 */
	abstract async handle(): Promise<void>
}
