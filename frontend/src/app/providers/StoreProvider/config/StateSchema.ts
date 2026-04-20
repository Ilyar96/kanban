import type { NavigateOptions, To } from "react-router-dom";
import type { AnyAction, EnhancedStore, Reducer, ReducersMapObject } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";
import { rtkApi } from "@/shared/api/rtkApi";

export interface StateSchema {
	// Статические редьюсеры
	// counter?: unknown;
	[rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;

	// Асинхронные редьюсеры
	// loginForm?: LoginSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
	getReducerMap: () => ReducersMapObject<StateSchema>;
	reduce: (state: StateSchema | undefined, action: AnyAction) => StateSchema;
	add: (key: StateSchemaKey, reducer: Reducer) => void;
	remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
	reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
	api: AxiosInstance;
	navigate?: (to: To, options?: NavigateOptions) => void;
}

export interface ThunkConfig<T> {
	rejectValue: T;
	extra: ThunkExtraArg;
	state: StateSchema;
}
