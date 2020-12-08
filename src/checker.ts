import { Property, PropertyParser } from './property-parser';
import { ParariusFetcher } from './pararius-fetcher';

const ROOT = 'https://www.pararius.com';

export interface CheckResult {
	city: string;
	properties: Property[];
}

export class Checker {

	constructor(private fetcher: ParariusFetcher, parser: PropertyParser) {}

	async check(cities: string[]): Promise<CheckResult[]> {
		return Promise.all(cities.map<CheckResult>(this.checkCity.bind(this)));
	}

	private async checkCity(city: string): Promise<CheckResult> {
		let properties = [];
		try {
			properties = await this.fetcher.fetch(city);
		} catch (e) {
			console.error(`Failed to fetch city ${city}`);
		}
		return { city, properties };
	}
}
