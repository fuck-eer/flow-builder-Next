import path from "path";
import { promises as fs } from "fs";
import { Edge, Node } from "reactflow";
import apiHandler from "../../lib/apiHandler";
import UserFacingError from "../../utils/UserFacingError";
type RequestBodyType = {
	nodes: Node[];
	edges: Edge[];
	pageId: string;
};
export type ResponseType = {
	data: object;
	message: string;
};
//! saving file in the backend on a valid save click
export default apiHandler<ResponseType>((req, res) => {
	if (req.method !== "POST") {
		throw new UserFacingError("invalid request: incorrect method", 405);
	}
	const { nodes, edges, pageId } = req.body as RequestBodyType;
	const pathToFile = path.join(process.cwd(), "data");

	return fs
		.writeFile(
			`${pathToFile}/flowDatabase/${pageId}.json`,
			JSON.stringify({ nodes, edges, time: new Date().getTime() }),
			{
				encoding: "utf-8",
			}
		)
		.then(() => {
			res.status(201).send({
				data: { pageId, time: new Date().getTime() },
				message: "Data Saved Successfully!",
			});
		})
		.catch((err) => {
			throw new UserFacingError(
				err.message ?? "Unable to save your data at this moment",
				500
			);
		});
});
