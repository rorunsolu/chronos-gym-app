import { ExerciseContext } from "@/hooks/useExercisesHook";
//import { db } from "@/auth/Firebase";
//import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { useState, type ReactNode } from "react";

// export interface MinorExerciseData {
// 	name: string;
// 	muscleGroup: string;
// 	secondaryMuscleGroup: string;
// 	equipment: string;
// 	instructions: string;
// }

import { type ExerciseData } from "@/common/types";

export interface ExerciseContextType {
	//exercises: MinorExerciseData[];
	//fetchExercises: () => Promise<void>;
	// createExercise: (
	// 	name: string,
	// 	muscleGroup: string,
	// 	secondaryMuscleGroup: string,
	// 	equipment: string,
	// 	instructions: string
	// ) => Promise<string>;
	// The promise type can't be a void otherwise the function won't be able to access any of the needed data
	handleDeleteSet: (exerciseId: string, setId: string) => void;
}

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
	const [, setExercises] = useState<ExerciseData[]>([]);

	// const fetchExercises = async () => {
	// 	const exercisesQuery = query(collection(db, "excercises"));

	// 	const snapshotOfExercises = await getDocs(exercisesQuery);

	// 	const exerciseList = snapshotOfExercises.docs.map((doc) => ({
	// 		id: doc.id,
	// 		name: doc.data().name,
	// 		muscleGroup: doc.data().muscleGroup,
	// 		secondaryMuscleGroup: doc.data().secondaryMuscleGroup,
	// 		equipment: doc.data().equipment,
	// 		instructions: doc.data().instructions,
	// 	}));

	// 	setExercises(exerciseList.sort((a, b) => b.name.localeCompare(a.name)));
	// };

	// const createExercise = async (
	// 	name: string,
	// 	muscleGroup: string,
	// 	secondaryMuscleGroup: string,
	// 	equipment: string,
	// 	instructions: string
	// ) => {
	// 	try {
	// 		const data = {
	// 			name,
	// 			muscleGroup,
	// 			secondaryMuscleGroup,
	// 			equipment,
	// 			instructions,
	// 		};

	// 		const exerciseDocRef = await addDoc(collection(db, "excercises"), data);

	// 		// get the prev/current list, add the new exercise to along with the id at the point of creation
	// 		setExercises((prev) => [
	// 			...prev, // open up the exisitng list to make space for the new exercise
	// 			{
	// 				// below is the new exercise in question
	// 				...data,
	// 				id: exerciseDocRef.id,
	// 			},
	// 		]);

	// 		console.log("Exercise created: ", exerciseDocRef.id);
	// 		return exerciseDocRef.id;
	// 	} catch (error) {
	// 		console.error("Error creating exercise: ", error);
	// 		throw new Error("Unable to create exercise.");
	// 	}
	// };

	const handleDeleteSet = (exerciseId: string, setId: string) => {
		setExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.filter((set) => set.id !== setId),
						}
					: exercise
			)
		);
	};

	return (
		<ExerciseContext.Provider
			value={{
				// exercises,
				// fetchExercises,
				// createExercise,
				handleDeleteSet,
			}}
		>
			{children}
		</ExerciseContext.Provider>
	);
};
