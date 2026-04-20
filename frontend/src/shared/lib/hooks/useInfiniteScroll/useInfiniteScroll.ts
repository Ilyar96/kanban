import { useEffect, type MutableRefObject, useRef } from "react";

export interface UseInfiniteScrollOptions {
	callback?: () => void | Promise<void>;
	triggerRef: MutableRefObject<HTMLElement | null>;
	wrapperRef: MutableRefObject<HTMLElement | null>;
}

export const useInfiniteScroll = (props: UseInfiniteScrollOptions) => {
	const { callback, triggerRef, wrapperRef } = props;
	const inFlightRef = useRef(false);

	useEffect(() => {
		const el = triggerRef.current;
		const root = wrapperRef.current;

		let obs: IntersectionObserver | null = null;

		if (el && root && callback) {
			const options: IntersectionObserverInit = {
				root,
				rootMargin: "0px",
				threshold: 1,
			};

			obs = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				if (inFlightRef.current) return;
				inFlightRef.current = true;
				Promise.resolve(callback()).finally(() => {
					inFlightRef.current = false;
				});
			}, options);

			obs.observe(el);
		}

		return () => {
			if (obs && el) {
				obs.unobserve(el);
				obs.disconnect();
			}
		};
	}, [callback, triggerRef, wrapperRef]);
};
