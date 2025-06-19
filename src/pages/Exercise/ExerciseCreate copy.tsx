import { UserAuth } from "@/auth/AuthContext";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { useState } from "react";
import {
	Container,
	Stack,
	TextInput,
	Select,
	Textarea,
	Title,
	Button,
} from "@mantine/core";

import {
	primaryMuscleGroups,
	secondaryMuscleGroups,
	equipment,
} from "@/common/index";

const ExerciseCreate = () => {
	const [exerciseName, setExerciseName] = useState("");
	const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState("");
	const [secondaryMuscleGroup, setSecondaryMuscleGroup] = useState("");
	const [equipmentType, setEquipmentType] = useState("");
	const [instructions, setInstructions] = useState("");

	const { user } = UserAuth();
	const { createExercise } = useExercisesHook();
	const handleExerciseCreate = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!user) {
			throw new Error("You must be logged in to create an exercise.");
		}

		await createExercise(
			exerciseName,
			primaryMuscleGroup,
			secondaryMuscleGroup,
			equipmentType,
			instructions
		);

		setExerciseName("");
		setPrimaryMuscleGroup("");
		setSecondaryMuscleGroup("");

		setEquipmentType("");
		setInstructions("");
	};

	return (
		<Container
			size="sm"
			p="md"
			py="md"
		>
			<form onSubmit={handleExerciseCreate}>
				<Stack gap="md">
					<Title
						order={3}
						fw={500}
					>
						Create New Exercise
					</Title>

					<TextInput
						c="white"
						label="Exercise Name"
						placeholder="e.g. Barbell Bench Press"
						required
						value={exerciseName}
						onChange={(e) => setExerciseName(e.target.value)}
					/>

					<Select
						label="Muscle Group"
						placeholder="Select a primary muscle"
						data={primaryMuscleGroups}
						required
						clearable
						searchable
						value={primaryMuscleGroup}
						onChange={(value) => setPrimaryMuscleGroup(value || "")}
					/>

					<Select
						label="Secondary Muscle Group"
						placeholder="Select a secondary muscle"
						data={secondaryMuscleGroups}
						clearable
						searchable
						value={secondaryMuscleGroup}
						onChange={(value) => setSecondaryMuscleGroup(value || "")}
					/>

					<Select
						label="Equipment Type"
						placeholder="Select equipment"
						data={equipment}
						required
						clearable
						searchable
						value={equipmentType}
						onChange={(value) => setEquipmentType(value || "")}
					/>

					<Textarea
						c="white"
						label="Instructions"
						placeholder="Describe how to perform the exercise..."
						autosize
						minRows={4}
						maxRows={8}
						value={instructions}
						onChange={(e) => setInstructions(e.target.value)}
					/>

					<Stack mt={10}>
						<Button
							type="submit"
							fullWidth
						>
							Create Exercise
						</Button>
					</Stack>
				</Stack>
			</form>
		</Container>
	);
};

export default ExerciseCreate;
