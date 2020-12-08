import { CheckResult } from './checker';

export class Differ {
	getDiff(checkResult1: CheckResult, checkResult2: CheckResult): CheckResult {
		const properties = checkResult1.properties.filter((item) => {
			return !checkResult2.properties.some(item2 => item2.id === item.id);
		});
		return { city: checkResult1.city, properties };
	}
}
