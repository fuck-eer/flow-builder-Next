import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Button from "../components/atoms/Button/Button";
import Logo from "../components/atoms/Icon/Logo";
import { useToast } from "../contexts/toastContext";
import generateRandomString from "../utils/randomStrings";

type SessionDataJsonType = {
	sessionId: string;
	timeInMs: number;
};

const Home: NextPage = () => {
	const { replace } = useRouter();
	const { onToast } = useToast();
	//! Getting data from local-storage for redirecting and fetching any available previous session
	useEffect(() => {
		const getSessionDetails = async () => {
			const sessionDataJson = await localStorage.getItem("sessionData");
			if (!sessionDataJson) return;
			const { sessionId, timeInMs } = JSON.parse(
				sessionDataJson
			) as SessionDataJsonType;
			//! just a random check if the toke is older than 2 days and if so deleting it
			if (timeInMs < new Date().getTime() - 2 * 24 * 60 * 60 * 1000) {
				onToast("Previous session has expired! Can't load", "dark-1", true);
				localStorage.removeItem("sessionDetails");
				//deleteFileFromDB too
				return;
			}
			//* redirect to the pageID if session is valid and in-scope
			await replace(`/${sessionId}`);
		};
		void getSessionDetails();
	}, [onToast, replace]);
	return (
		<>
			<Head>
				<title>Send-Nodes</title>
			</Head>
			<div className="overflow-hidden bg-dark-1 z-0 relative w-screen h-screen flex flex-col justify-center items-center gap-6 before:absolute before:content-['🚀'] before:text-black-1 before:animate-wiggle before:font-bebas before:overflow-hidden before:text-[300px] before:opacity-10 before:duration-[5s] before:z-[-1]">
				<Logo height={170} width={170} />
				<div className='flex flex-col justify-center gap-3 items-stretch max-w-[60%] text-center font-bebas text-6xl'>
					<h1 className='text-white'>Welcome to Send-Nodes!</h1>
					<p className='text-xl text-center font-josefin text-orange-1'>
						This tool will help you in creating flow of your process and you can
						send it with you teammates even without logging in just via URL.
					</p>
				</div>
				<Button
					classes='mt-10 gap-2'
					label='Create Session'
					variant='pink-1'
					size='lg'
					right={<span>🤘</span>}
					onClick={() => {
						void replace(`/${generateRandomString(18)}`);
					}}
				/>
			</div>
		</>
	);
};

export default Home;
