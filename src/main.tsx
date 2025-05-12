import App from "@/App";
import { AuthContextProvider } from "@/auth/AuthContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<BrowserRouter>
				<AuthContextProvider>
					<App />
				</AuthContextProvider>
			</BrowserRouter>
		</StrictMode>
	);
}
