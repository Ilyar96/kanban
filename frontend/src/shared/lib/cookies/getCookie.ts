export function getCookie(name: string): string {
	if (typeof document === "undefined") {
		return "";
	}

	const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));

	return match ? decodeURIComponent(match[1]) : "";
}
