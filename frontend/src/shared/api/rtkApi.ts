import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { USER_TOKEN_KEY } from "@/shared/const/cookie";
import { getCookie } from "@/shared/lib/cookies/getCookie";

export const rtkApi = createApi({
	reducerPath: "api",
	tagTypes: [],
	baseQuery: fetchBaseQuery({
		baseUrl: __API__,
		prepareHeaders: (headers) => {
			const token = getCookie(USER_TOKEN_KEY);

			if (token) {
				headers.set("Authorization", token);
			}

			return headers;
		},
	}),
	endpoints: () => ({}),
});
