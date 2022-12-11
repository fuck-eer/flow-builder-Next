//For better error handling from apiHandlers
export default class UserFacingError extends Error {
	code: number;
	constructor(message: string, httpCode?: number) {
		super(message);
		Object.setPrototypeOf(this, UserFacingError.prototype);
		this.name = "UserFacingError";
		this.code = httpCode ?? 500;
	}
}
