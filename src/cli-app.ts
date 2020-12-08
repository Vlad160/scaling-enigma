import * as readline from 'readline';
import { Checker } from './checker';
import { ConsoleFormatter } from './console-formatter';

export class CliApp {

	constructor(private checker: Checker, private formatter: ConsoleFormatter) {}

	async start() {
		const cities = await this.getCities();
		const checkResult = await this.checker.check(cities);
		const formatted = this.formatter.format(checkResult);
		console.log(formatted.toString());

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
					resolve(trimmed)
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
