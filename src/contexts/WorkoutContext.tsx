import { db } from "@/auth/Firebase";
import { WorkoutContext } from "@/hooks/useWorkoutHook";
import { addDoc, collection } from "firebase/firestore";
import { useState, type ReactNode } from "react";

// data required to create a workout
// Each exercise { name, sets done, reps per set, total weight, weight per set, notes }
// Compiled data to be turned into a workout which gets taken from each individual exercise logged in this workout

// Required UI
// 1. Add set btn
// 2. Add exercise btn
// 3. Discard workout btn
// 4. Finish workout btn
// 5. Individual tables for each excerise
// 6. Each row needs a set of inputs for ( set number, reps, weight, checkbox, delete btn)

export type WorkoutData = {
	name: string;
	exercises: {
		name: string;
		setsDone: number;
		repsPerSet: number;
		totalWeight: number;
		weightPerSet: number;
		notes: string;
	}[];
};

export type WorkoutContextType = {
	workouts: WorkoutData[];
	createWorkout: (
		name: string,
		exercises: {
			name: string;
			setsDone: number;
			repsPerSet: number;
			totalWeight: number;
			weightPerSet: number;
			notes: string;
		}[]
	) => Promise<string>;
};

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
	// the state will hold an array of data with the type of WorkoutData
	// ([]) sets the state as empty be default initially
	const [workouts, setWorkouts] = useState<WorkoutData[]>([]);

	const createWorkout = async (
		name: string,
		exercises: {
			name: string;
			setsDone: number;
			repsPerSet: number;
			totalWeight: number;
			weightPerSet: number;
			notes: string;
		}[]
	) => {
		try {
			// condense the data into an object (optional ofc)
			const dataToBeUsed = {
				name,
				exercises,
			};

			// create a reference for the workout thats being created
			const workoutRef = await addDoc(collection(db, "workouts"), dataToBeUsed);

			// here i change the state of the workouts by passing the previuos value of the state (workout list) and then spread it apart to insert the new workouts and its data
			setWorkouts((prevWorkouts) => [
				...prevWorkouts,
				{
					...dataToBeUsed,
					id: workoutRef.id,
				},
			]);
			return workoutRef.id;
			console.log("Workout created: ", workoutRef.id);
		} catch (error) {
			throw new Error("Error creating workout");
		}
	};

	return (
		<WorkoutContext.Provider
			value={{
				workouts,
				createWorkout,
			}}
		>
			{children}
		</WorkoutContext.Provider>
	);
};
