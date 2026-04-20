import type { AnyAction, Reducer, ReducersMapObject } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import type { ReducerManager, StateSchema, StateSchemaKey } from "./StateSchema";

export function createReducerManager(
	initialReducers: ReducersMapObject<StateSchema>,
): ReducerManager {
	const reducers: Partial<ReducersMapObject<StateSchema>> = { ...initialReducers };

	let combinedReducer = combineReducers(
		reducers as ReducersMapObject<StateSchema>,
	) as Reducer<StateSchema>;

	let keysToRemove: StateSchemaKey[] = [];

	return {
		getReducerMap: () => reducers as ReducersMapObject<StateSchema>,
		reduce: (state: StateSchema | undefined, action: AnyAction) => {
			if (keysToRemove.length > 0) {
				const stateCopy: Partial<StateSchema> = { ...(state ?? {}) };
				keysToRemove.forEach((key) => {
					delete stateCopy[key];
				});
				keysToRemove = [];
				state = stateCopy as StateSchema;
			}
			return combinedReducer(state, action);
		},
		add: (key: StateSchemaKey, reducer: Reducer) => {
			if (!key || reducers[key]) {
				return;
			}
			reducers[key] = reducer;
			combinedReducer = combineReducers(
				reducers as ReducersMapObject<StateSchema>,
			) as Reducer<StateSchema>;
		},
		remove: (key: StateSchemaKey) => {
			if (!key || !reducers[key]) {
				return;
			}
			delete reducers[key];
			keysToRemove.push(key);
			combinedReducer = combineReducers(
				reducers as ReducersMapObject<StateSchema>,
			) as Reducer<StateSchema>;
		},
	};
}
