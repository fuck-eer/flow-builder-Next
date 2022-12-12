import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { promises as fs } from "fs";
import React, { useEffect } from "react";
import Flow from "../components/molecules/Flow/Flow";
import PageLayout from "../components/molecules/PageLayout/PageLayout";
import { useFlowContext } from "../contexts/flowContext";
import axios from "axios";
import { FileDataType } from "./api/getFlowDataFromFile/[pageId]";
import Head from "next/head";
import path from "path";
import { getBaseURL } from "./api/saveFlowDataToFile";
//! Getting file data from data/flowDatabase folder through ServerSideRendering
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const {
		query: { pageId },
	} = ctx;
	try {
		const { data, status } = await axios.get(`${getBaseURL()}${pageId}.json`);
		if (status !== 200) {
			return {
				props: {
					data: { discardCase: "serverError" },
				},
				notFound: true,
			};
		}
		if (!data)
			return {
				props: {
					data: { discardCase: "dataNotFound" },
				},
			};
		//? added this time check as well not, if token time is less greater that this don't load data(2 days)
		if (data.time < new Date().getTime() - 2 * 24 * 60 * 60 * 1000) {
			void axios.delete(`${getBaseURL()}${pageId}.json`);
			return {
				props: {
					data: { discardCase: "dataTooOld" },
				},
			};
		}
		//? else fetch data
		return {
			props: {
				data,
			},
		};
	} catch (e) {
		return {
			props: {
				data: { discardCase: "serverError" },
			},
		};
	}
};
const PageId = ({ data }: { data: FileDataType }) => {
	const {
		query: { pageId },
	} = useRouter();
	const { onReset } = useFlowContext();
	useEffect(() => {
		//! Setting Flow state based on the server rendered props...
		onReset(
			data.nodes,
			data.edges,
			pageId as string,
			data.time,
			data.discardCase
		);
	}, [data.discardCase, data.nodes, data.edges, pageId, data.time, onReset]);
	return (
		<>
			<Head>
				<title>Send-Nodes</title>
			</Head>
			<PageLayout>
				<Flow />
			</PageLayout>
		</>
	);
};

export default PageId;
