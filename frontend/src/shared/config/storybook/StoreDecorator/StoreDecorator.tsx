import { StoreProvider } from "@/app/providers/StoreProvider";
import type { StateSchema } from "@/app/providers/StoreProvider";
import type { ReducersList } from "@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import type { Decorator } from "@storybook/react";

const defaultAsyncReducers: ReducersList = {};

export const StoreDecorator =
	(state: DeepPartial<StateSchema>, asyncReducers?: ReducersList): Decorator =>
	(Story) => (
		<StoreProvider
			initialState={state}
			asyncReducers={{ ...defaultAsyncReducers, ...asyncReducers }}
		>
			<Story />
		</StoreProvider>
	);
