import { Output } from '../Output'
import { Verbosity } from '../Verbosity'
import { Terminal } from '../Terminal'

export class ProgressBar {
	protected barWidth: number = 28
	protected barChar?: string
	protected emptyBarChar: string = '-'
	protected progressChar: string = '>'
	protected format?: string
	protected internalFormat?: string
	protected redrawFreq: number = 1
	protected step: number = 0
	protected startTime?: number
	protected stepWidth?: number
	protected percent: number = 0.0
	protected formatLineCount?: number
	protected messages: string[] = []
	protected firstRun: boolean = true
	protected max: number = 0

	/**
	 * Build new progress bar.
	 */
	constructor(protected output: Output, protected terminal: Terminal) {}

	/**
	 * Starts the progress output.
	 */
	start(max?: number) {
		this.startTime = new Date().getTime()
		this.step = 0
		this.percent = 0.0

		if (max !== undefined) {
			this.setMaxSteps(max)
		}

		this.display()

		return this
	}

	/**
	 * Advances the progress output X steps.
	 */
	advance(step: number = 1) {
		this.setProgress(this.step + step)
	}

	/**
	 * Set the progress output X steps.
	 */
	setProgress(step: number) {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		if (this.max && step > this.max) {
			this.max = step
		} else if (step < 0) {
			step = 0
		}

		// Ensure we dont redraw to often.
		const prevPeriod = this.step / this.redrawFreq
		const currPeriod = step / this.redrawFreq
		// Change step
		this.step = step
		this.percent = this.max ? this.step / this.max : 0

		if (prevPeriod !== currPeriod || this.max === step) {
			this.display()
		}
	}

	/**
	 * Set max steps.
	 */
	setMaxSteps(max: number) {
		this.format = undefined
		this.max = Math.max.apply(null, [0, max])
		this.stepWidth = this.max ? this.max.toString().length : 4
	}

	/**
	 * Finishes the progress output.
	 */
	finish() {
		if (this.startTime === undefined) {
			throw new Error('Progress bar need to be started first.')
		}

		if (!this.max) {
			this.max = this.step
		}

		if (this.step === this.max && !this.overwrite) {
			// prevent double 100% output
			return
		}

		this.setProgress(this.max)
	}

	/**
	 * Outputs the current progress string.
	 */
	protected display(): void {
		if (this.output.getVerbosity() === Verbosity.quiet) {
			return
		}

		if (this.format === null) {
			this.setRealFormat(this.internalFormat || this.determineBestFormat())
		}

		this.overwrite(this.buildLine())
	}

	/**
	 * Removes the progress bar from the current line.
	 *
	 * This is useful if you wish to write some output
	 * while a progress bar is running.
	 * Call display() to show the progress bar again.
	 */
	protected clear() {
		this.terminal.clearLine()
		this.terminal.cursorReset()

		if (this.format === null) {
			this.setRealFormat(this.internalFormat || this.determineBestFormat())
		}

		this.overwrite('')
	}

	protected getMaxSteps() {
		return this.max
	}

	protected getProgress() {
		return this.step
	}

	protected getBarCharacter(): string {
		if (this.barChar === undefined) {
			return this.max ? '=' : this.emptyBarChar
		}
		return this.barChar
	}

	protected setRealFormat(format: string) {
		// try to use the _nomax variant if available
		if (!this.max) {
			//
		}
		// if (!$this -> max && null !== self:: getFormatDefinition($format.'_nomax')) {
		//     $this -> format = self:: getFormatDefinition($format.'_nomax');
		// } elseif(null !== self:: getFormatDefinition($format)) {
		//     $this -> format = self:: getFormatDefinition($format);
		// } else {
		//     $this -> format = $format;
		// }
		// $this -> formatLineCount = substr_count($this -> format, "\n");
	}

	/**
	 * Overwrites a previous message to the output.
	 */
	protected overwrite(message: string) {
		// if ($this -> overwrite) {
		//     if (!$this -> firstRun) {
		//         if ($this -> output instanceof ConsoleSectionOutput) {
		//             $lines = floor(Helper:: strlen($message) / $this -> terminal -> getWidth()) + $this -> formatLineCount + 1;
		//             $this -> output -> clear($lines);
		//         } else {
		//             // Erase previous lines
		//             if ($this -> formatLineCount > 0) {
		//                 $message = str_repeat("\x1B[1A\x1B[2K", $this -> formatLineCount).$message;
		//             }
		//             // Move the cursor to the beginning of the line and erase the line
		//             $message = "\x0D\x1B[2K$message";
		//         }
		//     }
		// } elseif($this -> step > 0) {
		//     $message = PHP_EOL.$message;
		// }
		// $this -> firstRun = false;
		// $this -> output -> write($message);
	}

	protected determineBestFormat(): string {
		switch (this.output.getVerbosity()) {
			// OutputInterface::VERBOSITY_QUIET: display is disabled anyway
			case Verbosity.verbose:
				return this.max ? 'verbose' : 'verbose_nomax'

			case Verbosity.veryVerbose:
				return this.max ? 'very_verbose' : 'very_verbose_nomax'

			case Verbosity.debug:
				return this.max ? 'debug' : 'debug_nomax'

			default:
				return this.max ? 'normal' : 'normal_nomax'
		}
	}

	protected getFormatters() {
		return {
			bar: (): string => {
				const completeBars = Math.floor(
					this.getMaxSteps() > 0 ? this.getProgress() * this.barWidth : this.getProgress() % this.barWidth
				)
				let display = this.getBarCharacter().repeat(completeBars)

				if (completeBars < this.barWidth) {
					const emptyBar = this.barWidth - completeBars - this.progressChar.length
					display += this.progressChar + this.emptyBarChar.repeat(emptyBar)
				}

				return display
			},
			elapsed: (): string => {
				return `${new Date().getTime() - this.startTime!} secs`
			},
			remaining: (): string => {
				return 'remaining'
				if (!this.max) {
					throw new Error('Unable to display the remaining time if the maximum number of steps is not set.')
				}

				if (!this.getProgress()) {
					const remaining = 0
				} else {
					// const remaining = Math.round()
				}

				// return Helper.formatTime(remaining)

				// if (!$bar -> getProgress()) {
				//     $remaining = 0;
				// } else {
				//     $remaining = round((time() - $bar -> getStartTime()) / $bar -> getProgress() * ($bar -> getMaxSteps() - $bar -> getProgress()));
				// }
				// return Helper:: formatTime($remaining);
			},
			estimated: (): string => {
				return 'estimated'
				// if (!$bar -> getMaxSteps()) {
				//     throw new LogicException('Unable to display the estimated time if the maximum number of steps is not set.');
				// }
				// if (!$bar -> getProgress()) {
				//     $estimated = 0;
				// } else {
				//     $estimated = round((time() - $bar -> getStartTime()) / $bar -> getProgress() * $bar -> getMaxSteps());
				// }
				// return Helper:: formatTime($estimated);
			},
			memory: (): string => {
				return 'memory'
				// return Helper:: formatMemory(memory_get_usage(true));
			},
			current: (): string => {
				return 'current'
				// return str_pad($bar -> getProgress(), $bar -> getStepWidth(), ' ', STR_PAD_LEFT);
			},
			max: (): string => {
				return 'max'
				// return bar.getMaxSteps()
			},
			percent: (): string => {
				return 'percent'
				// return Math.floor(bar.getProgressPercent() * 100)
			},
		}
	}

	protected fetchFormat() {
		const f = this.getFormatters()

		return {
			normal: () => `${f.current()}/${f.max()} [${f.bar()}] ${f.percent()}`,
			normal_nomax: () => `${f.current()} [${f.bar()}]`,
			verbose: () => `${f.current()}/${f.max()} [${f.bar()}] ${f.percent()} ${f.elapsed()}`,
			verbose_nomax: () => `${f.current()}} [${f.bar()}] ${f.elapsed()}`,
			veryVerbose: () => `${f.current()}/${f.max()} [${f.bar()}] ${f.percent()} ${f.elapsed()}/${f.estimated()}`,
			veryVerbose_nomax: () => `${f.current()}} [${f.bar()}] ${f.elapsed()}`,
			debug: () =>
				`${f.current()}/${f.max()} [${f.bar()}] ${f.percent()} ${f.elapsed()}/${f.estimated()} ${f.memory()}`,
			debug_nomax: () => `${f.current()}} [${f.bar()}] ${f.elapsed()} ${f.memory()}`,
		}
	}

	protected buildLine(): string {
		return ''
		// $regex = "{%([a-z\-_]+)(?:\:([^%]+))?%}i";
		// $callback = function ($matches) {
		//     if ($formatter = $this:: getPlaceholderFormatterDefinition($matches[1])) {
		//         $text = $formatter($this, $this -> output);
		//     } elseif(isset($this -> messages[$matches[1]])) {
		//         $text = $this -> messages[$matches[1]];
		//     } else {
		//         return $matches[0];
		//     }
		//     if (isset($matches[2])) {
		//         $text = sprintf('%'.$matches[2], $text);
		//     }
		//     return $text;
		// };
		// $line = preg_replace_callback($regex, $callback, $this -> format);
		// // gets string length for each sub line with multiline format
		// $linesLength = array_map(function ($subLine) {
		//     return Helper:: strlenWithoutDecoration($this -> output -> getFormatter(), rtrim($subLine, "\r"));
		// }, explode("\n", $line));
		// $linesWidth = max($linesLength);
		// $terminalWidth = $this -> terminal -> getWidth();
		// if ($linesWidth <= $terminalWidth) {
		//     return $line;
		// }
		// $this -> setBarWidth($this -> barWidth - $linesWidth + $terminalWidth);
		// return preg_replace_callback($regex, $callback, $this -> format);
	}
}
