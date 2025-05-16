import { db } from "@/auth/Firebase";
import { RoutinesContext } from "@/hooks/useRoutinesHook";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { useState, type ReactNode } from "react";
import { type ExerciseData } from "@/contexts/ExerciseContext";

export interface RoutineData {
	id: string;
	name: string;
	exercises: ExerciseData[];
}

export interface RoutinesContextType {
	routines: RoutineData[];
	createRoutine: (name: string, exercises: ExerciseData[]) => Promise<string>;
	deleteRoutine: (id: string) => Promise<void>;
}

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
	const [routines, setRoutines] = useState<RoutineData[]>([]);

	const createRoutine = async (name: string, exercises: ExerciseData[]) => {
		try {
			const dataToBeAdded = {
				name,
				exercises,
			};

			const routineRef = await addDoc(
				collection(db, "routines"),
				dataToBeAdded
			);

			setRoutines((prevRoutines) => [
				...prevRoutines,
				{
					...dataToBeAdded,
					id: routineRef.id,
				},
			]);
			console.log("Routine created with ID: ", routineRef.id);
			return routineRef.id;
		} catch (error) {
			throw new Error("Error creating routine");
		}
	};

	const deleteRoutine = async (id: string) => {
		try {
			await deleteDoc(doc(db, "routines", id));
			setRoutines((prevRoutines) =>
				prevRoutines.filter((routine) => routine.id !== id)
			);
		} catch (error) {
			throw new Error("Error deleting routine");
		}
	};

	return (
		<RoutinesContext.Provider
			value={{
				routines,
				createRoutine,
				deleteRoutine,
			}}
		>
			{children}
		</RoutinesContext.Provider>
	);
};
