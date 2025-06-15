import { auth, db } from "@/auth/Firebase";
import { getAuthenticatedUser } from "@/common/authChecker";
import { getSessionStats } from "@/common/singleSessionStats";
import { WorkoutContext } from "@/hooks/useWorkoutHook";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	Timestamp,
	query,
	getDocs,
	where,
} from "firebase/firestore";
import { useState, type ReactNode } from "react";
import type { SessionData, ExerciseData } from "@/common/types";

export type WorkoutContextType = {
	workouts: SessionData[];
	fetchWorkouts: () => Promise<void>;
	createWorkout: (
		name: string,
		exercises: ExerciseData[],
		totalElapsedTimeSec: number,
		notes?: string
	) => Promise<string>;
	deleteWorkout: (id: string) => Promise<void>;
};

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
	const [workouts, setWorkouts] = useState<SessionData[]>([]);

	const fetchWorkouts = async () => {
		const workoutsQuery = query(
			collection(db, "workouts"),
			where("userId", "==", auth.currentUser?.uid)
		);
		const snapshotOfWorkouts = await getDocs(workoutsQuery);

		const workoutList = snapshotOfWorkouts.docs.map((doc) => {
			const data = doc.data();
			const stats = getSessionStats(data.exercises);
			return {
				id: doc.id,
				name: data.name,
				createdAt: data.createdAt,
				exercises: data.exercises,
				totalElapsedTimeSec: data.totalElapsedTimeSec,
				userId: data.userId,
				notes: data.notes,
				stats,
			};
		});
		setWorkouts(
			workoutList.sort(
				(a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
			)
		);
	};

	const createWorkout = async (
		name: string,
		exercises: ExerciseData[],
		totalElapsedTimeSec: number,
		notes?: string
	): Promise<string> => {
		const user = getAuthenticatedUser();

		const dataToAdd = {
			name,
			exercises,
			userId: user.uid,
			createdAt: Timestamp.now(),
			totalElapsedTimeSec,
			notes: notes || "",
			stats: getSessionStats(exercises),
		};

		try {
			const workoutRef = await addDoc(collection(db, "workouts"), dataToAdd);

			setWorkouts((prevHistory) => [
				...prevHistory,
				{ ...dataToAdd, id: workoutRef.id, createdAt: dataToAdd.createdAt },
			]);

			// eslint-disable-next-line
			console.log("Workout created: ", workoutRef.id);
			return workoutRef.id;
		} catch (error) {
			throw new Error("Error creating workout");
		}
	};

	const deleteWorkout = async (id: string) => {
		try {
			// I wait for the workout to be deleted in firebase before then updating the state
			// the workout to be deleted is determined by the id that is passed into the function at the start
			await deleteDoc(doc(db, "workouts", id));
			setWorkouts((prevWorkouts) =>
				prevWorkouts.filter((workout) => workout.id !== id)
			);
			// eslint-disable-next-line
			console.log("Workout deleted:", id);
		} catch (error) {
			// eslint-disable-next-line
			console.error("Error creating workout:", error);
			throw new Error("Error deleting workout");
		}
	};

	return (
		<WorkoutContext.Provider
			value={{
				workouts,
				fetchWorkouts,
				createWorkout,
				deleteWorkout,
			}}
		>
			{children}
		</WorkoutContext.Provider>
	);
};
