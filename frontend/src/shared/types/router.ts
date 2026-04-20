import type { JSX } from "react";
import type { UserRole } from "./auth";

export type AppRoutesProps = {
	path: string;
	element: JSX.Element;
	authOnly?: boolean;
	roles?: UserRole[];
};
