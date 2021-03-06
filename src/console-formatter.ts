import chalk from 'chalk';
import Table from 'cli-table3';
import { CheckResult } from './checker';

export class ConsoleFormatter {
	format(results: CheckResult[], highlightIds: string[] = []) {
		const table = new Table({
			head: ['City', 'Id', 'Title', 'Link', 'Price', 'Type']
		});
		results.forEach(
			({ city, properties }) =>
				properties.forEach(prop => {
					let row = [city, prop.id, prop.title, prop.link, prop.price, prop.type];
					if (highlightIds.includes(prop.id)) {
						row = row.map(x => chalk.yellow(x));
					}
					table.push(row);
				})
		)
		return table;
	}
}
