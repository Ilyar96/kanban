export const getBearerToken = (rawToken: string): string => {
	if (!rawToken) {
		return "";
	}

	let token = rawToken.trim();

	try {
		const parsed = JSON.parse(token);
		if (typeof parsed === "string") {
			token = parsed.trim();
		}
	} catch {
		// Token is already a plain string.
	}

	if (!token) {
		return "";
	}

	if (/^Bearer\s+/i.test(token)) {
		return token;
	}

	return `Bearer ${token}`;
};
