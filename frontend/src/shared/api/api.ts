import axios from "axios";
import { USER_TOKEN_KEY } from "@/shared/const/cookie";
import { getCookie } from "@/shared/lib/cookies/getCookie";

export const $api = axios.create({
	baseURL: __API__,
});

$api.interceptors.request.use((config) => {
	if (config.headers) {
		config.headers.authorization = getCookie(USER_TOKEN_KEY);
	}
	return config;
});
