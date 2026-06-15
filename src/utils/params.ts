export function parseId(raw: string): number | null {
	const id = Number(raw);
	return Number.isNaN(id) ? null : id;
}
