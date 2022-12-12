import { useRouter } from "next/router";
import React from "react";
import Button from "../components/atoms/Button/Button";
import Logo from "../components/atoms/Icon/Logo";
import { HiHome } from "react-icons/hi";
const ServerErrorPage = () => {
	const { replace } = useRouter();
	return (
		<div className="overflow-hidden z-0 relative w-screen h-screen bg-dark-1 flex flex-col justify-center items-center gap-6 before:absolute before:content-['500'] before:text-black-1 before:animate-wiggle before:font-bebas before:overflow-hidden before:text-[650px] before:opacity-20 before:duration-[5s] before:z-[-1]">
			<Logo height={170} width={170} />
			<div className='flex flex-col justify-center gap-3 items-stretch max-w-[60%] text-center font-bebas text-6xl'>
				<h1 className='text-white'>This doesn&apos;t seems to be working!</h1>
				<p className='text-xl text-center font-josefin text-error-1'>
					We are having some problem from our server😵, So Please Try again
					after some time 😓 or go to home page and create a new Session. We are
					really sorry... And one more thing you&apos;ve probably lost your
					previous session data too OOPS!😅 BYE👋
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

export default ServerErrorPage;
