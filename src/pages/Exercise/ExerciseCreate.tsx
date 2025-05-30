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
} from "@/assets/index";

const ExerciseCreate = () => {
	return (
		<Container
			size="sm"
			p="md"
			py="md"
		>
			<Stack gap="md">
				<Title order={3}>Create New Exercise</Title>

				<TextInput
					label="Exercise Name"
					placeholder="e.g. Barbell Bench Press"
					required
				/>

				<Select
					label="Muscle Group"
					placeholder="Select a primary muscle"
					data={primaryMuscleGroups}
					required
					clearable
					searchable
				/>

				<Select
					label="Secondary Muscle Group"
					placeholder="Select a secondary muscle"
					data={secondaryMuscleGroups}
					clearable
					searchable
				/>

				<Select
					label="Equipment Type"
					placeholder="Select equipment"
					data={equipment}
					required
					clearable
					searchable
				/>

				<Textarea
					label="Instructions"
					placeholder="Describe how to perform the exercise..."
					autosize
					minRows={4}
				/>
				<Stack mt={10}>
					<Button fullWidth>Create Exercise</Button>
				</Stack>
			</Stack>
		</Container>
	);
};

export default ExerciseCreate;
