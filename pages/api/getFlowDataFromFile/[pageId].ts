import { getBaseURL } from "./../saveFlowDataToFile";
import axios from "axios";
import apiHandler from "../../../lib/apiHandler";
import UserFacingError from "../../../utils/UserFacingError";
import { promises as fs } from "fs";
import { Edge, Node } from "reactflow";
import path from "path";
export type FileDataType = {
	discardCase?: string;
	pageId?: string;
	nodes: Node[];
	edges: Edge[];
	time: number;
};
type ResponseType = {
	data: FileDataType;
	message: string;
};
//! fetching data back from  files on being called upon
export default apiHandler<ResponseType>(async (req, res) => {
	if (req.method !== "GET") {
		throw new UserFacingError("invalid request: incorrect method", 405);
	}
	const { pageId } = req.query as { pageId: string };
	const { data, status } = await axios.get(`${getBaseURL()}${pageId}.json`);
	if (status !== 200) {
		throw new UserFacingError("Unknown Error Occurred", status);
	}
	if (!data) {
		throw new UserFacingError("Data not Found", status);
	}
	return res.status(status).send({
		data: data as FileDataType,
		message: "Data Restored Successfully!",
	});
});
