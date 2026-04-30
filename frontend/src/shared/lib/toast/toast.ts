import {
	toast,
	type Id,
	type ToastContent,
	type ToastOptions,
	type ToastPromiseParams,
	type UpdateOptions,
} from "react-toastify";

const DEFAULT_TOAST_OPTIONS: Pick<ToastOptions, "position" | "autoClose"> = {
	position: "top-right",
	autoClose: 3000,
};

const getToastTheme = (): "light" | "dark" => {
	if (typeof document === "undefined") {
		return "light";
	}

	return document.body.classList.contains("app_dark_theme") ? "dark" : "light";
};

const withTheme = <TData = unknown>(options?: ToastOptions<TData>): ToastOptions<TData> => ({
	...DEFAULT_TOAST_OPTIONS,
	theme: getToastTheme(),
	...options,
});

export const appToast = {
	show(content: ToastContent, options?: ToastOptions): Id {
		return toast(content, withTheme(options));
	},

	success(content: ToastContent, options?: ToastOptions): Id {
		return toast.success(content, withTheme(options));
	},

	error(content: ToastContent, options?: ToastOptions): Id {
		return toast.error(content, withTheme(options));
	},

	info(content: ToastContent, options?: ToastOptions): Id {
		return toast.info(content, withTheme(options));
	},

	warning(content: ToastContent, options?: ToastOptions): Id {
		return toast.warning(content, withTheme(options));
	},

	loading(content: ToastContent, options?: ToastOptions): Id {
		return toast.loading(content, withTheme(options));
	},

	promise<TData>(
		promise: Promise<TData> | (() => Promise<TData>),
		messages: ToastPromiseParams<TData>,
		options?: ToastOptions<TData>,
	) {
		return toast.promise<TData, unknown, unknown>(promise, messages, withTheme(options));
	},

	update(id: Id, options: UpdateOptions) {
		toast.update(id, {
			...options,
			theme: options.theme ?? getToastTheme(),
		});
	},

	dismiss(id?: Id) {
		toast.dismiss(id);
	},
};
