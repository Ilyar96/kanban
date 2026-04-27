import axios from "axios";
import { USER_TOKEN_KEY } from "@/shared/const/cookie";
import { getCookie } from "@/shared/lib/cookies/getCookie";
import { getBearerToken } from "@/shared/lib/auth/getBearerToken";

export const $api = axios.create({
	baseURL: __API__,
});

$api.interceptors.request.use((config) => {
	if (config.headers) {
		const token = getBearerToken(getCookie(USER_TOKEN_KEY));

		if (token) {
			config.headers.authorization = token;
		}
	}
	return config;
});
