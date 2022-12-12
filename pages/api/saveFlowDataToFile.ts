import path from "path";
import { promises as fs } from "fs";
import { Edge, Node } from "reactflow";
import apiHandler from "../../lib/apiHandler";
import UserFacingError from "../../utils/UserFacingError";
import axios from "axios";
type RequestBodyType = {
	nodes: Node[];
	edges: Edge[];
	pageId: string;
};
export type ResponseType = {
	data: object;
	message: string;
};
export const getBaseURL = () => {
	return process.env.NODE_ENV === "development"
		? process.env.FIRE_DATABASE_URL_TEST
		: process.env.FIRE_DATABASE_URL_PROD;
};
//! saving file in the backend on a valid save click
export default apiHandler<ResponseType>(async (req, res) => {
	if (req.method !== "POST") {
		throw new UserFacingError("invalid request: incorrect method", 405);
	}
	const { nodes, edges, pageId } = req.body as RequestBodyType;
	const time = new Date().getTime();
	const { data, status } = await axios.put(`${getBaseURL()}${pageId}.json`, {
		nodes,
		edges,
		pageId,
		time,
	});
	if (status !== 200) {
		throw new UserFacingError("Unknown Error Occurred", status);
	}
	if (!data) {
		throw new UserFacingError(
			"Unable to save your data at this moment",
			status
		);
	}
	return res
		.status(201)
		.send({ data: { pageId, time }, message: "Data Saved Successfully!" });
});
