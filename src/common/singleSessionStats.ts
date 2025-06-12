import type { ExerciseData } from "@/common/types";

export const getSessionStats = (exercises: ExerciseData[]) => {
	let totalVolume = 0;
	let totalSets = 0;

	for (const exercise of exercises || []) {
		for (const set of exercise.sets || []) {
			totalVolume += Number(set.weight || 0) * Number(set.reps || 0);
			totalSets += 1;
		}
	}

	return {
		totalVolume,
		totalSets,
		totalExercises: exercises.length,
	};
};

// its a single workout and inside each workout is an array of exercises
// each exercise then has an array of sets
// each set has weight and reps

// -> workout
// --> exercises
// ----> sets
// -----> weight
// -----> reps

// for each exercise in a session
// for each set in an exercise
// for each weight and reps in a set
