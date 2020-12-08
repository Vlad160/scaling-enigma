import fetch from 'node-fetch';
import UserAgent from 'user-agents';
import { Property, PropertyParser } from './property-parser';

export class ParariusFetcher {

	private userAgent = new UserAgent();

	constructor(private siteRoot: string,
	            private parser: PropertyParser,
	            private proxyURL?: string) {
	}

	async fetch(city: string): Promise<Property[]> {
		const formattedCity = city.toLowerCase().replace(/\s/g, '-');
		const defaultFetchOptions: Record<string, any> = {};
		if (this.proxyURL) {
			const { default: HttpsProxyAgent } = await import('https-proxy-agent');
			const agent = HttpsProxyAgent(this.proxyURL);
			Object.assign(defaultFetchOptions, { agent });
		}
		const page = await fetch(`${this.siteRoot}/apartments/${formattedCity}`, {
			...defaultFetchOptions,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Language': 'en-US,en;q=0.5',
				// IDK, but Pararius needs this one
				'User-Agent': this.userAgent.toString()
			},
			body: JSON.stringify({
				filters: { type: 'for_rent', city: city },
				view_options: { view: 'list' },
				sorting_options: {}
			})
		});
		if (!page.ok) {
			throw new Error(`Request failed with status code ${page.status} and status text ${page.statusText}`);
		}
		const text = await page.text();
		return this.parser.parse(text);
	}
}
