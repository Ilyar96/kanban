import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ServerErrorPayload } from "@/shared/types/serverError";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const isIssuesRecord = (issues: unknown): issues is Record<string, string> => {
	if (!isRecord(issues)) {
		return false;
	}

	return Object.values(issues).every((value) => typeof value === "string");
};

export const getServerErrorPayload = (error: unknown): ServerErrorPayload | null => {
	if (!isRecord(error)) {
		return null;
	}

	const payloadCandidate = "data" in error ? (error as FetchBaseQueryError).data : error;

	if (!isRecord(payloadCandidate)) {
		return null;
	}

	const message = payloadCandidate.message;
	const issues = payloadCandidate.issues;

	if (typeof message !== "string" && !isIssuesRecord(issues)) {
		return null;
	}

	return {
		message: typeof message === "string" ? message : undefined,
		issues: isIssuesRecord(issues) ? issues : undefined,
	};
};

export const getServerErrorMessage = (error: unknown): string | null => {
	return getServerErrorPayload(error)?.message ?? null;
};

export const getServerErrorIssues = (error: unknown): Record<string, string> | null => {
	return getServerErrorPayload(error)?.issues ?? null;
};

export const applyServerFieldErrors = <TFieldValues extends FieldValues>(
	issues: Record<string, string>,
	normalizeIssueKey: (key: string) => Path<TFieldValues> | null,
	setError: UseFormSetError<TFieldValues>,
) => {
	Object.entries(issues).forEach(([key, message]) => {
		const fieldName = normalizeIssueKey(key);
		if (fieldName) {
			setError(fieldName, { type: "server", message });
		}
	});
};
