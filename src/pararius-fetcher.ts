import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import { JSDOM } from 'jsdom';
import { Property, PropertyParser } from './property-parser';
import UserAgent from 'user-agents';

export class ParariusFetcher {

	private userAgent = new UserAgent();

	constructor(private siteRoot: string,
	            private parser: PropertyParser) {
	}

	async fetch(city: string): Promise<Property[]> {
		const formattedCity = city.toLowerCase().replace(/\s/g, '-');
		const page = await fetch(`${this.siteRoot}/apartments/${formattedCity}`, {
			agent: HttpsProxyAgent('http://127.0.0.1:8888'),
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
		const dom = new JSDOM(text);
		const items = Array.from(dom.window.document.querySelectorAll('.search-list__item.search-list__item--listing'));
		return items.map((property) => { return this.parser.parse(property); });
	}
}
