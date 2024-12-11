export const locales = ['fr', 'en'];

export function random(values: any[]) {
	const index = Math.floor(Math.random() * values.length);
	return values[index];
}

export function buildList<T>(number: Number, factory: () => T): T[] {
	return [...Array(number)].map(() => factory());
}
