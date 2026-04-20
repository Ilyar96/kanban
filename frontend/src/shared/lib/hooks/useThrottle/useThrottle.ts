import { useCallback, useEffect, useRef } from "react";

type ThrottledFunction<T extends (...args: unknown[]) => void> = (...args: Parameters<T>) => void;

export const useThrottle = <T extends (...args: unknown[]) => void>(
	callback: T,
	delay: number,
): ThrottledFunction<T> => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const callbackRef = useRef(callback);
	const lastArgsRef = useRef<Parameters<T> | null>(null);
	const lastExecutedAtRef = useRef(0);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(
		() => () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		},
		[],
	);

	return useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now();
			const elapsed = now - lastExecutedAtRef.current;
			const remaining = delay - elapsed;

			if (remaining <= 0) {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}

				lastExecutedAtRef.current = now;
				callbackRef.current(...args);
				return;
			}

			lastArgsRef.current = args;

			if (!timeoutRef.current) {
				timeoutRef.current = setTimeout(() => {
					if (lastArgsRef.current) {
						callbackRef.current(...lastArgsRef.current);
						lastArgsRef.current = null;
					}

					lastExecutedAtRef.current = Date.now();
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current);
					}
					timeoutRef.current = null;
				}, remaining);
			}
		},
		[delay],
	);
};
