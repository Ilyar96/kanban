export const getCookie = (name: string): string => {
	if (typeof document === "undefined") {
		return "";
	}

	const encodedName = encodeURIComponent(name);
	const escapedName = encodedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));

	if (!match) {
		return "";
	}

	try {
		return decodeURIComponent(match[1]);
	} catch {
		return match[1];
	}
};
