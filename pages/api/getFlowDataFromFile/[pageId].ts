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
export default apiHandler<ResponseType>((req, res) => {
	if (req.method !== "GET") {
		throw new UserFacingError("invalid request: incorrect method", 405);
	}
	const { pageId } = req.query as { pageId: string };
	const pathToFile = path.join(process.cwd(), "data");
	return fs
		.readFile(`${pathToFile}/flowDatabase/${pageId}.json`)
		.then((e) => {
			res.status(200).send({
				data: JSON.parse(e.toString()) as FileDataType,
				message: "Data Restored Successfully!",
			});
		})
		.catch((e) => {
			throw new UserFacingError("Unable to fetch data form this file", 404);
		});
});
