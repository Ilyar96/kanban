type SameSite = "Strict" | "Lax" | "None";

interface SetCookieOptions {
	maxAgeSeconds?: number;
	expires?: Date;
	path?: string;
	domain?: string;
	secure?: boolean;
	sameSite?: SameSite;
}

export const setCookie = (
	name: string,
	value: string,
	daysOrOptions: number | SetCookieOptions = 7,
): void => {
	if (typeof document === "undefined") {
		return;
	}

	const options: SetCookieOptions =
		typeof daysOrOptions === "number"
			? { maxAgeSeconds: Math.max(0, Math.floor(daysOrOptions * 24 * 60 * 60)) }
			: daysOrOptions;

	const sameSite = options.sameSite ?? "Lax";
	const shouldUseSecure =
		options.secure ?? (typeof window !== "undefined" && window.location.protocol === "https:");

	const cookieParts: string[] = [
		`${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
		`Path=${options.path ?? "/"}`,
		`SameSite=${sameSite}`,
	];

	if (options.maxAgeSeconds !== undefined) {
		cookieParts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAgeSeconds))}`);
	}

	if (options.expires instanceof Date) {
		cookieParts.push(`Expires=${options.expires.toUTCString()}`);
	}

	if (options.domain) {
		cookieParts.push(`Domain=${options.domain}`);
	}

	if (shouldUseSecure || sameSite === "None") {
		cookieParts.push("Secure");
	}

	document.cookie = cookieParts.join("; ");
};
