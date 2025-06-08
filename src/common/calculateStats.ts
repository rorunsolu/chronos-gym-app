import type { SessionData } from "@/common/types";

export const getUserWorkoutStats = (workouts: SessionData[]) => {
	let totalVolume = 0;
	let totalSets = 0;
	let totalDuration = 0;

	for (const workout of workouts) {
		totalDuration += workout.totalElapsedTimeSec || 0;
		for (const exercise of workout.exercises || []) {
			for (const set of exercise.sets || []) {
				totalVolume += Number(set.weight || 0) * Number(set.reps || 0);
				totalSets += 1;
			}
		}
	}

	return {
		totalVolume,
		totalSets,
		totalWorkouts: workouts.length,
		totalDuration,
	};
};
