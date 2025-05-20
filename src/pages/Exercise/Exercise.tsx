import { equipment, exerciseData, primaryMuscleGroups } from "@/assets/index";
import { Search } from "lucide-react";
import { useState } from "react";
import {
	Container,
	Input,
	//Button,
	Stack,
	Card,
	Group,
	Text,
	//Image,
	Select,
	Divider,
} from "@mantine/core";

const Exercise = () => {
	const [search, setSearch] = useState("");
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		null
	);

	const filtered = exerciseData.filter((exercise) => {
		const matchesSearch = exercise.name
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesMuscle = selectedMuscle
			? exercise.muscleGroup === selectedMuscle
			: true;
		const matchesEquipment = selectedEquipment
			? exercise.equipment === selectedEquipment
			: true;

		const showAllMuscles = selectedMuscle === "All Muscles";
		const showAllEquipment = selectedEquipment === "All Equipment";

		return (
			(matchesSearch && matchesMuscle && matchesEquipment) ||
			showAllMuscles ||
			showAllEquipment
		);
	});

	return (
		<Container
			size="sm"
			py="md"
		>
			<Stack gap="sm">
				<Input
					leftSection={<Search size={16} />}
					placeholder="Search exercise"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<Group grow>
					<Select
						//placeholder="Pick value"
						defaultValue="All Equipment"
						data={equipment}
						clearable
						searchable
						nothingFoundMessage="Nothing found..."
						checkIconPosition="right"
						comboboxProps={{
							transitionProps: { transition: "fade-down", duration: 200 },
						}}
						onChange={setSelectedEquipment}
					/>
					<Select
						//placeholder="Pick value"
						defaultValue="All Muscles"
						data={primaryMuscleGroups}
						clearable
						searchable
						nothingFoundMessage="Nothing found..."
						checkIconPosition="right"
						comboboxProps={{
							transitionProps: { transition: "fade-down", duration: 200 },
						}}
						onChange={setSelectedMuscle}
					/>
				</Group>

				<Divider />

				<Stack>
					{filtered.map((exercise, index) => (
						<Card
							key={index}
							withBorder
							radius="md"
							p="sm"
							style={{ cursor: "pointer" }}
							onClick={() => console.log(`Clicked ${exercise.name}`)}
						>
							<Group>
								<Text fw={500}>{exercise.name}</Text>
								<Text
									size="xs"
									c="dimmed"
								>
									{exercise.muscleGroup}
								</Text>
							</Group>
						</Card>
					))}
				</Stack>
			</Stack>
		</Container>
	);
};

export default Exercise;
