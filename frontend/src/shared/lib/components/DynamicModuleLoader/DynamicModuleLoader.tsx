import type { Reducer } from "@reduxjs/toolkit";
import { useEffect } from "react";
import type { FC, ReactElement } from "react";
import { useDispatch, useStore } from "react-redux";
import type { ReduxStoreWithManager } from "@/app/providers/StoreProvider";
import type { StateSchema, StateSchemaKey } from "@/app/providers/StoreProvider/config/StateSchema";

export type ReducersList = {
	[name in StateSchemaKey]?: Reducer<NonNullable<StateSchema[name]>>;
};

interface DynamicModuleLoaderProps {
	reducers: ReducersList;
	children: ReactElement;
	removeAfterUnmount?: boolean;
}

export const DynamicModuleLoader: FC<DynamicModuleLoaderProps> = (props) => {
	const { reducers, removeAfterUnmount = true, children } = props;
	const dispatch = useDispatch();
	const store = useStore() as ReduxStoreWithManager;

	useEffect(() => {
		const mountedReducers = store.reducerManager.getReducerMap();

		Object.entries(reducers).forEach(([name, reducer]) => {
			const isMountedReducer = mountedReducers[name as StateSchemaKey];

			if (!isMountedReducer) {
				store.reducerManager.add(name as StateSchemaKey, reducer);
				dispatch({ type: `@INIT ${name} Reducer` });
			}
		});

		return () => {
			if (removeAfterUnmount) {
				Object.entries(reducers).forEach(([name]) => {
					store.reducerManager.remove(name as StateSchemaKey);
					dispatch({ type: `@DESTROY ${name} Reducer` });
				});
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return children;
};
