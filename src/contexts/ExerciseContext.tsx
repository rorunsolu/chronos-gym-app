import { db } from "@/auth/Firebase";
import { ExerciseContext } from "@/hooks/useExercisesHook";
// import { getAuthenticatedUser } from "@/common/authChecker";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	query,
	getDocs,
	//where,
} from "firebase/firestore";
import { useState, type ReactNode } from "react";
import type { FBExerciseData } from "@/common/types";

export interface ExerciseContextType {
	FBExercises: FBExerciseData[];
	fetchFBExercises: () => Promise<void>;
	createExercise: (
		name: string,
		muscleGroup: string,
		equipment: string,
		secondaryMuscleGroup?: string,
		instructions?: string[]
	) => Promise<string>;
	deleteExercise: (id: string) => Promise<void>;
}

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
	const [FBExercises, setFBExercises] = useState<FBExerciseData[]>([]);

	const fetchFBExercises = async () => {
		const exercisesQuery = query(collection(db, "exercises"));

		const snapshotOfExercises = await getDocs(exercisesQuery);

		const exerciseList = snapshotOfExercises.docs.map((doc) => ({
			id: doc.id,
			name: doc.data().name,
			muscleGroup: doc.data().muscleGroup,
			secondaryMuscleGroup: doc.data().secondaryMuscleGroup,
			equipment: doc.data().equipment,
			instructions: doc.data().instructions,
		}));
		setFBExercises(exerciseList.sort((a, b) => b.name.localeCompare(a.name)));
	};

	const createExercise = async (
		name: string,
		muscleGroup: string,
		equipment: string,
		secondaryMuscleGroup?: string,
		instructions?: string[]
	) => {
		//const user = getAuthenticatedUser();
		const data = {
			name,
			muscleGroup,
			secondaryMuscleGroup,
			equipment,
			instructions: instructions || [],
			// userId: user.uid,
		};
		try {
			const exerciseDocRef = await addDoc(collection(db, "exercises"), data);
			setFBExercises((prev) => [...prev, { ...data, id: exerciseDocRef.id }]);
			// eslint-disable-next-line
			console.log("Exercise created: ", exerciseDocRef.id);
			return exerciseDocRef.id;
		} catch (error) {
			// eslint-disable-next-line
			console.error("Error creating exercise: ", error);
			throw new Error("Unable to create exercise.");
		}
	};

	const deleteExercise = async (id: string) => {
		try {
			await deleteDoc(doc(db, "exercises", id));
			setFBExercises((prev) => prev.filter((exercise) => exercise.id !== id));
			// eslint-disable-next-line
			console.log("Exercise deleted:", id);
		} catch (error) {
			// eslint-disable-next-line
			console.error("Error deleting exercise:", error);
			throw new Error("Error deleting exercise");
		}
	};

	return (
		<ExerciseContext.Provider
			value={{
				FBExercises,
				fetchFBExercises,
				createExercise,
				deleteExercise,
			}}
		>
			{children}
		</ExerciseContext.Provider>
	);
};
