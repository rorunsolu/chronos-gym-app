import { db } from "@/auth/Firebase";
import { ExerciseContext } from "@/hooks/useExercisesHook";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
// Name
// Muscle group
// Secondary muscle group
// How to do it

// I will use this to create global default exercises that all users can use in their workouts but it will only be allowed to be edited by me. users cannot edit these exercises

export type MuscleGroupData =
	| "Chest"
	| "Back"
	| "Shoulders"
	| "Biceps"
	| "Triceps"
	| "Forearms"
	| "Neck"
	| "Abdominals"
	| "Obliques"
	| "Lower Back"
	| "Glutes"
	| "Quadriceps"
	| "Hamstrings"
	| "Calves"
	| "Hip Flexors"
	| "Adductors"
	| "Lats";

import { useState, type ReactNode } from "react";

export interface ExerciseData {
	name: string;
	muscleGroup: MuscleGroupData;
	secondaryMuscleGroup: MuscleGroupData;
	howTo: string;
}

export interface ExerciseContextType {
	exercises: ExerciseData[];
	fetchExercises: () => Promise<void>;
	createExercise: (
		name: string,
		muscleGroup: MuscleGroupData,
		secondaryMuscleGroup: MuscleGroupData,
		howTo: string
	) => Promise<string>;
	// The promise type can't be a void otherwise the function won't be able to access any of the needed data
}

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
	const [exercises, setExercises] = useState<ExerciseData[]>([]);

	const fetchExercises = async () => {
		const exercisesQuery = query(collection(db, "excercises"));

		const snapshotOfExercises = await getDocs(exercisesQuery);

		// create the local list of exercises based on the data from Firebase
		// each exercise has the mentioned properties in the exerciseList function

		const exerciseList = snapshotOfExercises.docs.map((doc) => ({
			id: doc.id,
			name: doc.data().name,
			muscleGroup: doc.data().muscleGroup,
			secondaryMuscleGroup: doc.data().secondaryMuscleGroup,
			howTo: doc.data().howTo,
		}));

		setExercises(exerciseList.sort((a, b) => b.name.localeCompare(a.name)));
	};

	const createExercise = async (
		name: string,
		muscleGroup: MuscleGroupData,
		secondaryMuscleGroup: MuscleGroupData,
		howTo: string
	) => {
		try {
			const data = {
				name,
				muscleGroup: muscleGroup as MuscleGroupData,
				secondaryMuscleGroup: secondaryMuscleGroup as MuscleGroupData,
				howTo,
			};

			// refers to the new exercise that is being created
			const exerciseDocRef = await addDoc(collection(db, "excercises"), data);

			// get the prev/current list, add the new exercise to along with the id at the point of creation
			setExercises((prev) => [
				...prev, // open up the exisitng list to make space for the new exercise
				{
					// below is the new exercise in question
					...data,
					id: exerciseDocRef.id,
				},
			]);

			console.log("Exercise created: ", exerciseDocRef.id);
			return exerciseDocRef.id;
		} catch (error) {
			throw new Error("Unable to create exercise.");
		}
	};

	return (
		<ExerciseContext.Provider
			value={{
				exercises,
				fetchExercises,
				createExercise,
			}}
		>
			{children}
		</ExerciseContext.Provider>
	);
};
