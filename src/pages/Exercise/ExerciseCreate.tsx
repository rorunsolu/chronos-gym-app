import {
	Container,
	Stack,
	TextInput,
	Select,
	Textarea,
	Title,
	Button,
} from "@mantine/core";

const muscleGroups = [
	"Chest",
	"Back",
	"Shoulders",
	"Biceps",
	"Triceps",
	"Forearms",
	"Neck",
	"Abdominals",
	"Obliques",
	"Lower Back",
	"Glutes",
	"Quadriceps",
	"Hamstrings",
	"Calves",
	"Hip Flexors",
	"Adductors",
	"Lats",
];

const equipmentTypes = [
	"Barbell",
	"Dumbbell",
	"Kettlebell",
	"Machine",
	"Cable",
	"Resistance Band",
	"Bodyweight",
	"Smith Machine",
	"EZ Bar",
	"Trap Bar",
	"Bench",
	"Pull-up Bar",
	"Dip Bar",
	"Medicine Ball",
	"Stability Ball",
	"Foam Roller",
	"Bosu Ball",
	"Treadmill",
	"Elliptical",
	"Stationary Bike",
	"Rowing Machine",
	"Sled",
	"Battle Ropes",
];

const ExerciseCreate = () => {
	return (
		<Container
			size="sm"
			p="xs"
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
					label="Primary Muscle Group"
					placeholder="Select a primary muscle"
					data={muscleGroups}
					required
					clearable
					searchable
				/>

				<Select
					label="Secondary Muscle Group"
					placeholder="Select a secondary muscle"
					data={muscleGroups}
					clearable
					searchable
				/>

				<Select
					label="Equipment Type"
					placeholder="Select equipment used"
					data={equipmentTypes}
					required
					clearable
					searchable
				/>

				<Textarea
					label="How To"
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
