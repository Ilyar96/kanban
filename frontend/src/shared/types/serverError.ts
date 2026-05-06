export interface ServerErrorPayload {
	message?: string;
	issues?: Record<string, string>;
}
