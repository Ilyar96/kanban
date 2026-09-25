import { useEffect } from "react";
import { authChannel } from "../../authChannel/authChannel";

type UseAuthChannelOptions = {
	onLogout: () => void;
	onAuthChange: () => void;
};

export const useAuthChannel = ({ onLogout, onAuthChange }: UseAuthChannelOptions) => {
	useEffect(() => {
		const handleAuthChange = (event: MessageEvent) => {
			if (event.data === "logout") {
				onLogout();
			} else if (event.data === "auth-changed") {
				onAuthChange();
			}
		};

		authChannel.addEventListener("message", handleAuthChange);

		return () => {
			authChannel.removeEventListener("message", handleAuthChange);
		};
	}, [onLogout, onAuthChange]);
};
