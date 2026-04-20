import { useSyncExternalStore } from "react";

export const useBreakpoint = (query: string) => {
	const subscribe = (onStoreChange: () => void) => {
		if (typeof window === "undefined") {
			return () => undefined;
		}

		const media = window.matchMedia(query);
		const listener = () => onStoreChange();

		media.addEventListener("change", listener);

		return () => {
			media.removeEventListener("change", listener);
		};
	};

	const getSnapshot = () => {
		if (typeof window === "undefined") {
			return false;
		}

		return window.matchMedia(query).matches;
	};

	return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
