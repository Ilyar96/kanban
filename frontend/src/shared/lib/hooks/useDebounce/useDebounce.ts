import { useCallback, useEffect, useRef } from "react";

export const useDebounce = <TArgs extends unknown[]>(
	callback: (...args: TArgs) => void,
	delay: number,
) => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		},
		[],
	);

	return useCallback(
		(...args: TArgs) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => callback(...args), delay);
		},
		[callback, delay],
	);
};
