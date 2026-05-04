import { useEffect } from "react";

type UseClickOutsideParams = {
	ref: React.RefObject<HTMLElement | null>;
	handler: (event: MouseEvent | TouchEvent) => void;
};

export const useClickOutside = ({ ref, handler }: UseClickOutsideParams) => {
	useEffect(() => {
		const listener = (event: MouseEvent | TouchEvent) => {
			const el = ref.current;

			if (!el || el.contains(event.target as Node)) {
				return;
			}

			handler(event);
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
};
