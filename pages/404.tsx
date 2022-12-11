import { useRouter } from "next/router";
import React from "react";
import Button from "../components/atoms/Button/Button";
import Logo from "../components/atoms/Icon/Logo";
import { HiHome } from "react-icons/hi";
const NotFoundPage = () => {
	const { replace } = useRouter();
	return (
		<div className="overflow-hidden z-0 relative w-screen h-screen bg-dark-1 flex flex-col justify-center items-center gap-6 before:absolute before:content-['404'] before:text-black-1 before:animate-wiggle before:font-bebas before:overflow-hidden before:text-[650px] before:opacity-20 before:duration-[5s] before:z-[-1]">
			<Logo height={170} width={170} />
			<div className='flex flex-col justify-center gap-3 items-stretch max-w-[60%] text-center font-bebas text-6xl'>
				<h1 className='text-white'>This doesn&apos;t seems to be working!</h1>
				<p className='text-xl text-center font-josefin text-error-1'>
					The Page you&apos;re looking for either does not exist or has been
					cleared from the server, Try creating new session from Home! Sorry for
					the inconvenience
				</p>
			</div>
			<Button
				classes='mt-10 gap-2'
				label='Go Home'
				variant='yellow-1'
				right={<HiHome />}
				onClick={() => {
					replace("/");
				}}
			/>
		</div>
	);
};

export default NotFoundPage;
