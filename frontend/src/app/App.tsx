import { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRouter } from "./providers/router";
import { getUserInited, initAuthData } from "@/entities/User";
import { useAppDispatch } from "@/shared/lib/hooks/useAppDispatch/useAppDispatch";
import { Navbar } from "@/widgets/Navbar";
import { Theme, useTheme } from "./providers/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
	const dispatch = useAppDispatch();
	const inited = useSelector(getUserInited);
	const { theme } = useTheme();

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
				<Navbar />
				<main className="content-page">
					<AppRouter />
				</main>
			</Suspense>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				theme={theme === Theme.DARK ? "dark" : "light"}
			/>
		</div>
	);
};

export default App;
