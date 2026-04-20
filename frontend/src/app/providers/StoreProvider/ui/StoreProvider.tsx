import type { ReactNode } from "react";
import { useState } from "react";
import { Provider } from "react-redux";
import type { ReducersMapObject } from "@reduxjs/toolkit";
import { createReduxStore } from "../config/store";
import type { StateSchema } from "../config/StateSchema";

interface StoreProviderProps {
	children: ReactNode;
	initialState?: DeepPartial<StateSchema>;
	asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>;
}

export const StoreProvider = (props: StoreProviderProps) => {
	const { children, initialState, asyncReducers } = props;

	const [store] = useState(() =>
		createReduxStore(initialState as StateSchema, asyncReducers as ReducersMapObject<StateSchema>),
	);

	return <Provider store={store}>{children}</Provider>;
};
