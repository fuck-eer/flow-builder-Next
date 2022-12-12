import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useState, useCallback, useEffect } from "react";
import {
	Node,
	Edge,
	Connection,
	NodeChange,
	addEdge,
	MarkerType,
	useNodesState,
	useEdgesState,
	EdgeChange,
} from "reactflow";
import { useToast } from "./toastContext";

//! Created a Context for centralized FLOW related state management from throughout the application 🌍

type FlowType = {
	nodes: Node[];
	edges: Edge[];
	currentNode?: Node;
	onNodesChange: (changes: NodeChange[]) => void;
	onEdgesChange: (changes: EdgeChange[]) => void;
	onSetCurrent: (_: React.MouseEvent, node: Node) => void;
	onConnect: (connection: Connection) => void;
	onNodeValueChange: (value: string) => void;
	checkValidityOnSave: () => boolean;
	onSave: (id: string) => void;
	onReset: (
		nodes: Node[],
		edges: Edge[],
		pageId: string,
		time: number,
		discardCase?: string
	) => void;
};
const FlowContext = React.createContext<FlowType>({
	currentNode: undefined,
	edges: [],
	nodes: [],
	onConnect: () => {},
	onEdgesChange: () => {},
	onNodesChange: () => {},
	onSetCurrent: () => {},
	onNodeValueChange: () => {},
	checkValidityOnSave: () => false,
	onSave: (id) => {},
	onReset: (nodes, edges, pageId, time, discardCase) => {},
});

export const FlowContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	//? Nodes of the FLOW
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	//? Edges of the FLOW
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	//? currently selected Node of the FLOW
	const [currentNode, setCurrentNode] = useState<Node>();
	const { replace } = useRouter();
	//! Reset currently selected node on nodes state change
	useEffect(() => {
		setCurrentNode(undefined);
	}, [nodes.length]);

	//! For alert banner
	const { onToast } = useToast();

	//! All the functions below were memoized via useCallback for referential stability (AKA: to minimize unnecessary rerenders)
	//! Checking if state is valid, by seeing if there is more than one free node without any source or target 🎯
	const checkValidityOnSave = useCallback(() => {
		const nodesSourceSet = new Set<string>();
		const nodesTargetSet = new Set<string>();
		edges.forEach((edge) => {
			nodesSourceSet.add(edge.source);
			nodesTargetSet.add(edge.target);
		});

		if (nodesSourceSet.size < nodes.length - 1) {
			return false;
		}
		if (nodesTargetSet.size < nodes.length - 1) {
			return false;
		}
		return true;
	}, [nodes.length, edges]);

	//! function fired when we connect handlers(source ➡ target)
	const onConnect = useCallback(
		(connection: Connection) =>
			setEdges((edges) =>
				addEdge(
					{
						...connection,
						markerEnd: { type: MarkerType.ArrowClosed },
					},
					edges ?? []
				)
			),
		[setEdges]
	);

	//! when a node is clicked
	const onSetCurrent = useCallback((_: React.MouseEvent, node: Node) => {
		if (!node) return;
		setCurrentNode(node);
	}, []);
	const onNodeValueChange = useCallback(
		(value: string) => {
			setNodes((nodes) =>
				nodes.map((node) => {
					if (node.id === currentNode?.id) {
						node.data = {
							...node.data,
							value,
						};
					}

					return node;
				})
			);
		},
		[currentNode?.id, setNodes]
	);

	//! saving data to json file on server and session to local storage for reloads and stuff (You know just like a cloud.LOL) ⛅
	const onSave = useCallback(
		(id: string) => {
			const saving = async () => {
				const flowData = { nodes, edges, pageId: id };
				try {
					const {
						data: {
							data: { pageId, time },
						},
						status,
					} = await axios.post(`/api/saveFlowDataToFile`, flowData);
					if (status !== 201) {
						onToast("Data Failed to save!", "error-1", true);
						return;
					}
					localStorage.setItem(
						"sessionData",
						JSON.stringify({ sessionId: pageId, timeInMs: time })
					);
					onToast("Data Saved Successfully", "blue-1", true);
				} catch (e) {
					onToast(JSON.stringify(e), "error-1", true);
				}
			};
			void saving();
		},
		[nodes, edges, onToast]
	);

	//! this is setting data back to state after fetching from SSR and also updating local storage
	const onResetFromLocalStorage = useCallback(
		(
			nodes: Node[],
			edges: Edge[],
			pageId: string,
			time: number,
			discardCase?: string
		) => {
			if (discardCase === "dataTooOld") {
				onToast("Data was too old,So created a new Sesh", "dark-1", true);
				localStorage.removeItem("sessionData");
				return;
			} else if (discardCase === "dataNotFound") {
				onToast("Created a new Session for you!", "blue-1", true);
				localStorage.removeItem("sessionData");
				return;
			} else if (discardCase === "serverError") {
				onToast("Something Bad happened,Please Re-Try!", "pink-1", true);
				localStorage.removeItem("sessionData");
				replace("/500");
				return;
			}
			//fill loacal storage
			localStorage.setItem(
				"sessionData",
				JSON.stringify({ sessionId: pageId, timeInMs: time })
			);
			setNodes(nodes || []);
			setEdges(edges || []);
			onToast("Data Restored Successfully", "yellow-1", true);
		},
		[setEdges, setNodes, onToast, replace]
	);
	return (
		<FlowContext.Provider
			value={{
				nodes,
				edges,
				onConnect,
				onEdgesChange,
				onNodesChange,
				currentNode,
				onSetCurrent,
				onNodeValueChange,
				checkValidityOnSave,
				onSave,
				onReset: onResetFromLocalStorage,
			}}
		>
			{children}
		</FlowContext.Provider>
	);
};

export const useFlowContext = () => {
	const context = useContext(FlowContext);
	if (!context) {
		throw new Error(
			"useFlowContext can only be used inside a FlowContextProvider"
		);
	}
	return context;
};
