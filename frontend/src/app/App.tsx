import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRouter } from "./providers/router";
import { getUserInited, initAuthData } from "@/entities/User";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";

const App = () => {
	const dispatch = useAppDispatch();
	const inited = useSelector(getUserInited);

	useEffect(() => {
		dispatch(initAuthData());
	}, [dispatch]);

	if (!inited) {
		// TODO Добавить красивый спиннер
		return <div className="app">Loading...</div>;
	}

	return (
		<div className={"app"}>
			<Suspense>
				<main className="content-page">
					<AppRouter />
				</main>
			</Suspense>
		</div>
	);
};

export default App;
