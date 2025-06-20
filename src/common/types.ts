import { Timestamp } from "firebase/firestore";

export type ExerciseData = {
	id: string;
	name: string;
	notes?: string;
	mappedId: string;
	sets: {
		id: string;
		weight: string | number;
		reps: string | number;
		isCompleted: boolean;
	}[];
};

export type FBExerciseData = {
	id: string;
	name: string;
	muscleGroup: string;
	equipment: string;
	secondaryMuscleGroup?: string;
	instructions?: string[];
};

export type SessionData = {
	id: string;
	name: string;
	notes?: string;
	userId: string;
	createdAt: Timestamp;
	exercises: ExerciseData[];
	totalElapsedTimeSec: number;
	stats: {
		totalVolume: number;
		totalSets: number;
		totalExercises: number;
	};
};
