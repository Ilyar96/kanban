interface RemoveCookieOptions {
	path?: string;
	domain?: string;
}

export const removeCookie = (name: string, options: RemoveCookieOptions = {}): void => {
	if (typeof document === "undefined") {
		return;
	}

	const parts: string[] = [
		`${encodeURIComponent(name)}=`,
		"Max-Age=0",
		"Expires=Thu, 01 Jan 1970 00:00:00 GMT",
		`Path=${options.path ?? "/"}`,
	];

	if (options.domain) {
		parts.push(`Domain=${options.domain}`);
	}

	document.cookie = parts.join("; ");
};
