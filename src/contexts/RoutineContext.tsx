import { auth, db } from "@/auth/Firebase";
import { getAuthenticatedUser } from "@/common/helper";
import { RoutinesContext } from "@/hooks/useRoutinesHook";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	query,
	getDocs,
	Timestamp,
	where,
} from "firebase/firestore";
import { useState, type ReactNode } from "react";
import type { SessionData, ExerciseData } from "@/common/types";

export interface RoutinesContextType {
	routines: SessionData[];
	fetchRoutines: () => Promise<void>;
	createRoutine: (
		name: string,
		exercises: ExerciseData[],
		totalElapsedTimeSec: number
	) => Promise<string>;
	deleteRoutine: (id: string) => Promise<void>;
}

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
	const [routines, setRoutines] = useState<SessionData[]>([]);

	const fetchRoutines = async () => {
		const routineCollection = collection(db, "routines");
		const routinesQuery = query(
			routineCollection,
			where("userId", "==", auth.currentUser?.uid)
		);
		const snapshotOfRoutines = await getDocs(routinesQuery);

		const routineList = snapshotOfRoutines.docs.map((doc) => ({
			id: doc.id,
			name: doc.data().name,
			createdAt: doc.data().createdAt,
			exercises: doc.data().exercises,
			totalElapsedTimeSec: doc.data().totalElapsedTimeSec,
			userId: doc.data().userId,
			notes: doc.data().notes,
		}));

		setRoutines(
			routineList.sort(
				(a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
			)
		);
	};

	const createRoutine = async (
		name: string,
		exercises: ExerciseData[],
		totalElapsedTimeSec: number
	): Promise<string> => {
		const user = getAuthenticatedUser();

		const dataToAdd = {
			name,
			exercises,
			userId: user.uid,
			createdAt: Timestamp.now(),
			totalElapsedTimeSec,
		};

		try {
			const routineRef = await addDoc(collection(db, "routines"), dataToAdd);

			setRoutines((prev) => [
				...prev,
				{ ...dataToAdd, id: routineRef.id, createdAt: dataToAdd.createdAt },
			]);

			// eslint-disable-next-line
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
			// eslint-disable-next-line
			console.log("Routine deleted with ID: ", id);
		} catch (error) {
			throw new Error("Error deleting routine");
		}
	};

	return (
		<RoutinesContext.Provider
			value={{
				routines,
				fetchRoutines,
				createRoutine,
				deleteRoutine,
			}}
		>
			{children}
		</RoutinesContext.Provider>
	);
};
