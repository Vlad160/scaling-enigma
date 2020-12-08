import { CheckResult } from './checker';
import chalk from 'chalk';
import Table from 'cli-table3';

export class ConsoleFormatter {
	format(results: CheckResult[]) {
		const table = new Table({
			head: ['City', 'Id', 'Title', 'Link', 'Price', 'Type']
		});
		results.forEach(
			({ city, properties }) => {
				return properties.forEach(prop => {
					table.push([chalk.yellow(city), prop.id, prop.title, prop.link, prop.price, prop.type]);
				})
			}
		)

		return table;
	}
}
