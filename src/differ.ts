import { CheckResult } from './checker';

export class Differ {
	getDiff(oldResult: CheckResult, newResult: CheckResult): CheckResult {
		const properties = newResult.properties.filter((item) => {
			return !oldResult.properties.some(item2 => item2.id === item.id);
		});
		return { city: newResult.city, properties };
	}
}
