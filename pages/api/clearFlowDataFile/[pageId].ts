import { getBaseURL } from "./../saveFlowDataToFile";
import apiHandler from "../../../lib/apiHandler";
import UserFacingError from "../../../utils/UserFacingError";
import { promises as fs } from "fs";
import path from "path";
import axios from "axios";

//! deleting file in case of old token or time

export default apiHandler(async (req, res) => {
	if (req.method !== "DELETE") {
		throw new UserFacingError("invalid request: incorrect method", 405);
	}
	const { pageId } = req.query as { pageId: string };
	const { status, data } = await axios.delete(`${getBaseURL()}${pageId}.json`);
	if (status !== 200) {
		throw new UserFacingError("Unknown error occured", status);
	}
	if (!data) {
		throw new UserFacingError("No Such File Found!", 204);
	}
	return res
		.status(202)
		.send({ data: { pageId }, message: "Data deleted Successfully!" });
});
