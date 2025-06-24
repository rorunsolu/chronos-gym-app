import type { ExerciseData } from "@/common/types";

export const getSingleExerciseStats = (
	mappedId: string | undefined,
	exercises: ExerciseData[]
) => {
	let totalVolume = 0;
	let totalSets = 0;

	for (const exercise of exercises || []) {
		if (exercise.mappedId === mappedId) {
			for (const set of exercise.sets || []) {
				totalVolume += Number(set.weight || 0) * Number(set.reps || 0);
				totalSets += 1;
			}
		}
	}

	return {
		totalVolume,
		totalSets,
	};
};
