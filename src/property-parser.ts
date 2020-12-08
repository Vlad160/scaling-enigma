export enum RentType {
	HOUSE = 'House',
	APARTMENT = 'Apartment',
	ROOM = 'Room'
}

export interface Property {
	id: string;
	title: string;
	link: string;
	price: number;
	type: RentType;
}

export class PropertyParser {

	constructor(private siteRoot: string) {}

	parse(fragment: Element): Property {
		const title = this.getTitle(fragment);
		const link = this.getLink(fragment);
		const id = this.parseId(link);
		const type = this.getRentType(link);
		const price = this.getPrice(fragment);
		return { id, title, link, price, type };
	}

	private getTitleLink(fragment: Element): HTMLAnchorElement {
		const titleElement = fragment.querySelector('.listing-search-item__title');
		return titleElement.querySelector('.listing-search-item__link') as HTMLAnchorElement
	}

	private getTitle(fragment: Element): string {
		return this.getTitleLink(fragment).textContent;
	}

	private getLink(fragment: Element): string {
		return `${this.siteRoot}${this.getTitleLink(fragment).href}`;
	}

	private getPrice(fragment: Element): number {
		const priceElementContent = fragment.querySelector('.listing-search-item__price').textContent;
		const price = priceElementContent.match(/[\d,]+/gm)[0];
		return Number.parseInt(price.replace(/,/g, ''));
	}

	private parseId(link: string): string {
		return link.split('/')[5];
	}

	private getRentType(testString: string): RentType {
		if (testString.includes('apartment')) {
			return RentType.APARTMENT
		}
		if (testString.includes('house')) {
			return RentType.HOUSE
		}
		if (testString.includes('room')) {
			return RentType.ROOM
		}
	}
}
