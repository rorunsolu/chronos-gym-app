import { MeasurementProvider } from "./contexts/MeasurementContext";
import App from "@/App";
import { AuthContextProvider } from "@/auth/AuthContext";
import { ExerciseProvider } from "@/contexts/ExerciseContext";
import { RoutineProvider } from "@/contexts/RoutineContext";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
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
					<WorkoutProvider>
						<ExerciseProvider>
							<RoutineProvider>
								<MeasurementProvider>
									<App />
								</MeasurementProvider>
							</RoutineProvider>
						</ExerciseProvider>
					</WorkoutProvider>
				</AuthContextProvider>
			</BrowserRouter>
		</StrictMode>
	);
}
