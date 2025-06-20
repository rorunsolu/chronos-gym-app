import { localExerciseInfo } from "@/common";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { Button, Container, Stack } from "@mantine/core";
import { useState } from "react";

const BulkExUpload = () => {
	const [bulkLoading, setBulkLoading] = useState(false);
	const [bulkSuccess, setBulkSuccess] = useState(false);

	const { createExercise } = useExercisesHook();

	const handleBulkUpload = async () => {
		setBulkLoading(true);
		setBulkSuccess(false);
		try {
			for (const exercise of localExerciseInfo) {
				await createExercise(
					exercise.name,
					exercise.muscleGroup,
					exercise.equipment,
					exercise.secondaryMuscleGroup,
					exercise.instructions ? exercise.instructions : []
				);
			}
			setBulkSuccess(true);
		} catch (error) {
			// eslint-disable-next-line
			console.error("Bulk upload failed", error);
		} finally {
			setBulkLoading(false);
		}
	};

	return (
		<Container
			size="xs"
			p="md"
			py="md"
		>
			<Stack>
				<Button
					variant="outline"
					color="teal"
					onClick={handleBulkUpload}
					loading={bulkLoading}
					mt="sm"
				>
					Bulk Upload All Exercises
				</Button>
				{bulkSuccess && (
					<span style={{ color: "lightgreen" }}>Bulk upload successful!</span>
				)}
			</Stack>
		</Container>
	);
};

export default BulkExUpload;
