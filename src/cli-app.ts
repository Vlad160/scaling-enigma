import * as readline from 'readline';
import * as sound from 'sound-play';
import * as path from 'path';
import { Checker, CheckResult } from './checker';
import { ConsoleFormatter } from './console-formatter';
import { Differ } from './differ';

export const DEFAULT_CHECK_INTERVAL = 15 * 60 * 1000;

export class CliApp {

	private timeoutId: NodeJS.Timeout = null;
	private checkResult: CheckResult[] = null;
	private cities: string[] = [];

	constructor(private checker: Checker,
	            private formatter: ConsoleFormatter,
	            private differ: Differ,
	            private checkInterval = DEFAULT_CHECK_INTERVAL) {}

	async start() {
		this.cities = await this.getCities();
		await this.check();
	}

	private async check() {
		const checkResult = await this.checker.check(this.cities);
		const diffIds: string[] = [];
		if (this.checkResult) {
			this.checkResult.forEach(value => {
				const newResult = checkResult.find(x => x.city === value.city);
				if (!newResult) {
					diffIds.push(...value.properties.map(p => p.id));
					return;
				}
				const diff = this.differ.getDiff(value, newResult);
				const ids = diff.properties.map(p => p.id);
				diffIds.push(...ids);
			})
		}
		this.checkResult = checkResult;
		const formatted = this.formatter.format(this.checkResult, diffIds);
		console.log(`Check time: ${new Date().toLocaleTimeString()}`);
		if (diffIds.length > 0) {
			this.playSound();
		}
		console.log(formatted.toString());
		this.scheduleCheck();
	}

	private scheduleCheck() {
		this.timeoutId = setTimeout(this.check.bind(this), this.checkInterval);
	}

	private playSound() {
		sound.play(path.resolve(__dirname, './bell.mp3'));
	}

	async getCities() {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		const ask = () => {
			return new Promise<string>(resolve => {
				rl.question('What cities we are going to check 🤔 (split with coma)?\n', (answer) => {
					const trimmed = answer.trim();
					resolve(trimmed);
				});
			})
		}
		const validAnswer = (ans: string) => ans.length > 0 && ans.length < 255;
		let answer = await ask();
		while (!validAnswer(answer)) {
			console.log(`Not like this. Please enter a valid string (length > 0 && length < 255) ☝️ \n`);
			answer = await ask();
		}
		rl.close();
		return answer.split(',').map(x => x.trim());
	}
}
