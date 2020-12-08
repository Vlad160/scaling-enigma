import { ParariusFetcher } from './pararius-fetcher';
import { PropertyParser } from './property-parser';
import { ConsoleFormatter } from './console-formatter';
import { Checker } from './checker';
import { CliApp } from './cli-app';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const ROOT = 'https://www.pararius.com';

async function main(cities: string[]) {
	const parser = new PropertyParser(ROOT);
	const fetcher = new ParariusFetcher(ROOT, parser);
	const formatter = new ConsoleFormatter();
	const checker = new Checker(fetcher, parser);

	const cliApp = new CliApp(checker, formatter);
	cliApp.start();
}

main(['leiden', 'den haag']);
