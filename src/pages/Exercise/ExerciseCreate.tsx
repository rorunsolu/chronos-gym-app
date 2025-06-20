import { UserAuth } from "@/auth/AuthContext";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { useState } from "react";
import {
	Container,
	Stack,
	TextInput,
	Textarea,
	Title,
	Button,
} from "@mantine/core";

const ExerciseCreate = () => {
	const [exerciseName, setExerciseName] = useState("");
	const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState("");
	const [secondaryMuscleGroup, setSecondaryMuscleGroup] = useState("");
	const [equipment, setEquipment] = useState("");
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
			equipment,
			instructions
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line.length > 0)
		);

		setExerciseName("");
		setPrimaryMuscleGroup("");
		setSecondaryMuscleGroup("");
		setEquipment("");
		setInstructions("");
	};

	return (
		<Container
			size="xs"
			p="md"
			py="md"
		>
			<form onSubmit={handleExerciseCreate}>
				<Stack gap="md">
					<Title
						order={3}
						fw={600}
						c="white"
					>
						Create an Exercise
					</Title>

					<TextInput
						c="white"
						label="Name"
						placeholder="Enter a name"
						required
						value={exerciseName}
						onChange={(e) => setExerciseName(e.target.value)}
					/>

					<TextInput
						c="white"
						label="Muscle Group"
						placeholder="Select a primary muscle"
						required
						value={primaryMuscleGroup}
						onChange={(e) => setPrimaryMuscleGroup(e.target.value)}
					/>

					<TextInput
						c="white"
						label="Secondary Muscle Group"
						placeholder="Select a secondary muscle"
						value={secondaryMuscleGroup}
						onChange={(e) => setSecondaryMuscleGroup(e.target.value)}
					/>

					<TextInput
						c="white"
						label="Equipment"
						placeholder="Select equipment"
						required
						value={equipment}
						onChange={(e) => setEquipment(e.target.value)}
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
							disabled={!exerciseName || !primaryMuscleGroup || !equipment}
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
