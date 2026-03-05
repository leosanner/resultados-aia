export function filterOcurrencies(
	obj: Record<string, number>,
	valueToCut: number = 0,
) {
	return Object.fromEntries(
		Object.entries(obj).filter(([, value]) => value > valueToCut),
	);
}
