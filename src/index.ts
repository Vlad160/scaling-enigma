import { ParariusFetcher } from './pararius-fetcher';
import { PropertyParser } from './property-parser';
import { ConsoleFormatter } from './console-formatter';
import { Checker } from './checker';
import { CliApp } from './cli-app';
import { Differ } from './differ';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const ROOT = 'https://www.pararius.com';

async function main() {
	const parser = new PropertyParser(ROOT);
	// 'http://127.0.0.1:8888'
	const fetcher = new ParariusFetcher(ROOT, parser);
	const formatter = new ConsoleFormatter();
	const checker = new Checker(fetcher);
	const differ = new Differ();
	const cliApp = new CliApp(checker, formatter, differ);
	cliApp.start();
}

main();
