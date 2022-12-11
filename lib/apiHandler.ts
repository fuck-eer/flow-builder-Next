import { NextApiHandler } from "next";
import UserFacingError from "../utils/UserFacingError";
type ErrorResponse = {
	message: string;
	success?: false;
};
//Middleware for backend apis
const apiHandler = <T>(
	handler: NextApiHandler<T>
): NextApiHandler<T | ErrorResponse> => {
	return async (req, res) => {
		try {
			return await handler(req, res);
		} catch (e) {
			if (e instanceof UserFacingError) {
				const { code, message } = e;
				res.status(code).send({ message, success: false });
				return;
			}
			const message = "Request failed!";
			res.status(500).send({ message, success: false });
		}
	};
};
export default apiHandler;
