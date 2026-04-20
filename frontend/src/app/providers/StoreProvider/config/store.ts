import { configureStore } from "@reduxjs/toolkit";
import type { ReducersMapObject } from "@reduxjs/toolkit";
import { $api } from "@/shared/api/api";
import { rtkApi } from "@/shared/api/rtkApi";
import type { StateSchema, ThunkExtraArg } from "./StateSchema";
import { createReducerManager } from "./reducerManager";

export function createReduxStore(
	initialState?: StateSchema,
	asyncReducers?: ReducersMapObject<StateSchema>,
) {
	const rootReducer: ReducersMapObject<StateSchema> = {
		// counter: counterReducer,
		[rtkApi.reducerPath]: rtkApi.reducer,
		...asyncReducers,
	};

	const reducerManager = createReducerManager(rootReducer);

	const extraArg: ThunkExtraArg = {
		api: $api,
	};

	const store = configureStore({
		reducer: reducerManager.reduce,
		devTools: __IS_DEV__,
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				thunk: {
					extraArgument: extraArg,
				},
			}).concat(rtkApi.middleware),
	});

	// @ts-expect-error reducerManager is extended at runtime for dynamic reducers.
	store.reducerManager = reducerManager;

	return store;
}

export type AppDispatch = ReturnType<typeof createReduxStore>["dispatch"];
