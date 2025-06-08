import { Search } from "lucide-react";
import { useState } from "react";
import {
	equipment,
	localExerciseInfo,
	primaryMuscleGroups,
} from "@/common/index";
import {
	Container,
	Input,
	Stack,
	Group,
	Select,
	Paper,
	List,
	Pill,
	Title,
} from "@mantine/core";

const Exercise = () => {
	const [search, setSearch] = useState("");
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		null
	);

	const filtered = localExerciseInfo.filter((exercise) => {
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
			p="sm"
			py="md"
		>
			<Stack gap="sm">
				<Group>
					<Input
						w="100%"
						leftSection={<Search size={16} />}
						placeholder="Search exercise"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</Group>

				<Group grow>
					<Select
						placeholder="All Equipment"
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
						placeholder="All Muscles"
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

				<Stack>
					{filtered.map((exercise, index) => (
						<Paper
							key={index}
							p="md"
							withBorder
							shadow="md"
						>
							<Stack
								gap="xs"
								mb="md"
							>
								<Title order={3}>{exercise.name}</Title>
								<Group gap={5}>
									<Pill
										bg="teal"
										c="white"
									>
										{exercise.muscleGroup}
									</Pill>
									<Pill
										bg="dark.9"
										c="white"
									>
										{exercise.secondaryMuscleGroup}
									</Pill>
									<Pill
										bg="blue.9"
										c="white"
									>
										{exercise.equipment}
									</Pill>
								</Group>
							</Stack>
							<Stack>
								<List
									className="list-decimal list-inside"
									spacing={7}
									size="sm"
								>
									{exercise.instructions.map((instruction, index) => (
										<List.Item key={index}>{instruction}</List.Item>
									))}
								</List>
							</Stack>
						</Paper>
					))}
				</Stack>
			</Stack>
		</Container>
	);
};

export default Exercise;
