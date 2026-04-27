import {
	type ForwardedRef,
	forwardRef,
	memo,
	useId,
	type InputHTMLAttributes,
	type ReactNode,
	type TextareaHTMLAttributes,
} from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { classNames } from "@/shared/lib/classNames/classNames";
import cls from "./TextField.module.scss";
import { Text } from "../Text/Text";

type BaseInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"value" | "onChange" | "readOnly"
>;

type BaseTextareaProps = Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	"value" | "onChange" | "readOnly"
>;

interface CommonTextFieldProps {
	className?: string;
	label?: string;
	value?: string | number;
	onChange?: (value: string) => void;
	registration?: UseFormRegisterReturn;
	autoFocus?: boolean;
	readonly?: boolean;
	size?: "s" | "m" | "l";
	error?: string;
}

type InputTextFieldProps = CommonTextFieldProps &
	BaseInputProps & {
		as?: "input";
	};

type TextareaTextFieldProps = CommonTextFieldProps &
	BaseTextareaProps & {
		as: "textarea";
		type?: never;
	};

export type TextFieldProps = InputTextFieldProps | TextareaTextFieldProps;

export const TextField = memo(
	forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
		(props: TextFieldProps, ref) => {
			const reactId = useId();
			const { size, id, error } = props;
			const fieldId = id ?? reactId;
			const fieldSize = size ?? "m";
			const fieldClass = classNames(cls.field, { [cls.error]: error }, [cls[fieldSize]]);

			const assignRef = <TElement extends HTMLInputElement | HTMLTextAreaElement>(
				element: TElement | null,
				registrationRef?: UseFormRegisterReturn["ref"],
				forwardedRef?: ForwardedRef<TElement>,
			) => {
				if (typeof forwardedRef === "function") {
					forwardedRef(element);
				} else if (forwardedRef) {
					forwardedRef.current = element;
				}

				registrationRef?.(element);
			};

			const renderFieldWrapper = (
				field: ReactNode,
				className: string | undefined,
				label: string | undefined,
				fieldSize: "s" | "m" | "l",
				fieldId: string,
			) => {
				const wrapperClass = classNames(cls.textField, {}, [className]);
				const labelClass = classNames(cls.label, {}, [cls[fieldSize]]);

				return (
					<div className={wrapperClass}>
						{label && (
							<label
								className={labelClass}
								htmlFor={fieldId}
							>
								{label}
							</label>
						)}
						{field}
						{error && (
							<Text
								className={classNames(cls.errorText, {}, [cls[fieldSize]])}
								theme="error"
								text={error}
								size={fieldSize === "s" ? "xs" : "s"}
							/>
						)}
					</div>
				);
			};

			if (props.as === "textarea") {
				const {
					className,
					label,
					value,
					onChange,
					registration,
					autoFocus,
					readonly,
					name,
					...textareaProps
				} = props;
				return renderFieldWrapper(
					<textarea
						ref={(element) =>
							assignRef(element, registration?.ref, ref as ForwardedRef<HTMLTextAreaElement>)
						}
						className={fieldClass}
						id={fieldId}
						name={registration?.name ?? name}
						value={value}
						onChange={(e) => {
							registration?.onChange(e);
							onChange?.(e.target.value);
						}}
						onBlur={registration?.onBlur}
						autoFocus={autoFocus}
						readOnly={readonly}
						{...textareaProps}
					/>,
					className,
					label,
					fieldSize,
					fieldId,
				);
			}

			const {
				className,
				label,
				value,
				onChange,
				registration,
				autoFocus,
				readonly,
				name,
				type = "text",
				...inputProps
			} = props;

			return renderFieldWrapper(
				<input
					ref={(element) =>
						assignRef(element, registration?.ref, ref as ForwardedRef<HTMLInputElement>)
					}
					className={fieldClass}
					id={fieldId}
					name={registration?.name ?? name}
					type={type}
					value={value}
					onChange={(e) => {
						registration?.onChange(e);
						onChange?.(e.target.value);
					}}
					onBlur={registration?.onBlur}
					autoFocus={autoFocus}
					readOnly={readonly}
					{...inputProps}
				/>,
				className,
				label,
				fieldSize,
				fieldId,
			);
		},
	),
);
