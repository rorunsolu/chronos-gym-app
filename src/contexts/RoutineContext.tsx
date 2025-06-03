import { auth, db } from "@/auth/Firebase";
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

export type ExerciseData = {
	id: string;
	name: string;
	notes?: string;
	sets: {
		id: string;
		weight: string;
		reps: string;
		isCompleted: boolean;
	}[];
};
export interface RoutineData {
	id: string;
	name: string;
	createdAt: Timestamp;
	exercises: ExerciseData[];
	userId: string;
	notes?: string;
}

export interface RoutinesContextType {
	routines: RoutineData[];
	fetchRoutines: () => Promise<void>;
	createRoutine: (name: string, exercises: ExerciseData[]) => Promise<string>;
	deleteRoutine: (id: string) => Promise<void>;
}

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
	const [routines, setRoutines] = useState<RoutineData[]>([]);

	const fetchRoutines = async () => {
		// const routinesQuery = query(collection(db, "routines"));
		// const snapshotOfRoutines = await getDocs(routinesQuery);

		const routineCollection = collection(db, "routines");
		const routinesQuery = query(
			routineCollection,
			where("userId", "==", auth.currentUser?.uid)
		);
		const snapshotOfRoutines = await getDocs(routinesQuery);

		// create the local list of routines based on the data from Firebase
		// each routine has the mentioned properties in the routineList function

		const routineList = snapshotOfRoutines.docs.map((doc) => ({
			id: doc.id,
			name: doc.data().name,
			createdAt: doc.data().createdAt,
			exercises: doc.data().exercises,
			userId: doc.data().userId,
		}));

		setRoutines(
			routineList.sort(
				(a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
			)
		);
	};

	const createRoutine = async (
		name: string,
		exercises: ExerciseData[]
	): Promise<string> => {
		const dateOfCreation = Timestamp.fromDate(new Date());

		const user = auth.currentUser;

		if (!user) {
			throw new Error("User is not authenticated");
		}

		try {
			const dataToBeAdded = {
				name,
				exercises,
				createdAt: dateOfCreation,
				userId: user.uid,
			};

			const routineRef = await addDoc(
				collection(db, "routines"),
				dataToBeAdded
			);

			setRoutines([{ id: routineRef.id, ...dataToBeAdded }, ...routines]);
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
