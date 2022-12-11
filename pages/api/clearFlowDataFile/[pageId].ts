import apiHandler from "../../../lib/apiHandler";
import UserFacingError from "../../../utils/UserFacingError";
import { promises as fs } from "fs";
import path from "path";

//! deleting file in case of old token or time

export default apiHandler((req, res) => {
	if (req.method !== "DELETE") {
		throw new UserFacingError("invalid request: incorrect method", 405);
	}
	const { pageId } = req.query as { pageId: string };
	const pathToFile = path.join(process.cwd(), "data");
	return fs
		.unlink(`${pathToFile}/flowDatabase/${pageId}.json`)
		.then((e) => {
			res.status(200).send({
				message: "Data Restored Successfully!",
			});
		})
		.catch((e) => {
			throw new UserFacingError("Unable to delete this file", 404);
		});
});
