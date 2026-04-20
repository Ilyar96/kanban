export type Mods = Record<string, boolean | string | undefined>;

export function classNames(
	cls: string,
	mods: Mods = {},
	additional: Array<string | undefined> = [],
): string {
	return [
		cls,
		...additional.filter(Boolean),
		...Object.entries(mods)
			.filter(([className, value]) => {
				if (!value) return false;
				if (!className) return false;
				const trimmed = className.trim();
				if (!trimmed) return false;
				if (trimmed === "undefined" || trimmed === "null") return false;
				return true;
			})
			.map(([className]) => className),
	]
		.join(" ")
		.trim();
}
