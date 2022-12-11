import "../styles/globals.css";
import type { AppProps } from "next/app";
import DummyErrorBoundary from "../DummyErrorBoundary";
import { ToastContextProvider } from "../contexts/toastContext";
import { FlowContextProvider } from "../contexts/flowContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<DummyErrorBoundary>
			<ToastContextProvider>
				<FlowContextProvider>
					<DndProvider backend={HTML5Backend}>
						<Component {...pageProps} />
					</DndProvider>
				</FlowContextProvider>
			</ToastContextProvider>
		</DummyErrorBoundary>
	);
}

export default MyApp;
