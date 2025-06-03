import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import {
	Button,
	Card,
	Checkbox,
	Container,
	Divider,
	Group,
	Input,
	Menu,
	Modal,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CheckCircle, Plus, Search, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	equipment,
	localExerciseInfo,
	primaryMuscleGroups,
} from "@/assets/index";
import type { ExerciseData } from "@/contexts/RoutineContext";

const Routine = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [search, setSearch] = useState("");
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		null
	);
	const [, setExerciseSetCompleted] = useState(false);
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [exercises, setExercises] = useState<ExerciseData[]>([]);

	const { createRoutine } = useRoutinesHook();

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

	const handleDeleteSet = (exerciseId: string, setId: string) => {
		setExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.filter((set) => set.id !== setId),
						}
					: exercise
			)
		);
	};

	const handleExerciseRender = (exercise: { name: string }) => {
		setExercises((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				name: exercise.name, // the type defintion (exercise: { name: string }) for the exercise paramater is for this ONLY
				sets: [
					// This is an ARRAY not just an object
					{
						id: Date.now().toString(), // the prev error was becasue i forgot to add the id property here
						reps: "",
						weight: "",
						isCompleted: false,
					},
				],
			},
		]);
	};

	const handleRowRender = (exerciseId: string) => {
		setExercises((prev) =>
			prev.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: [
								...exercise.sets,
								{
									id: Date.now().toString(),
									reps: "",
									weight: "",
									isCompleted: false,
								},
							],
						}
					: exercise
			)
		);
	};

	const handleInputChange = (
		exerciseId: string,
		setId: string,
		field: "reps" | "weight",
		value: string
	) => {
		setExercises((prev) =>
			prev.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.map((set) =>
								set.id === setId ? { ...set, [field]: value } : set
							),
						}
					: exercise
			)
		);
	};

	const handleSetCompletion = (
		exerciseId: string,
		setId: string,
		isCompleted: boolean
	) => {
		setExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.map((set) =>
								set.id === setId ? { ...set, isCompleted } : set
							),
						}
					: exercise
			)
		);
	};

	const handleRoutineUpload = async () => {
		createRoutine(name, exercises);
		setExercises([]);
		setName("");
	};

	return (
		<>
			<Container
				size="xs"
				p="md"
				py="md"
			>
				<Stack gap="md">
					<Stack gap="xs">
						<TextInput
							size="lg"
							variant="unstyled"
							value={name}
							placeholder="Enter routine name"
							onChange={(e) => setName(e.target.value)}
						/>
					</Stack>

					<Stack gap="xl">
						{exercises.map((exercise) => {
							return (
								<div key={exercise.id}>
									<Group mb="xs">
										<Text
											fw={500}
											size="lg"
										>
											{exercise.name}
										</Text>
									</Group>

									<Table
										striped
										withRowBorders={false}
									>
										<Table.Thead>
											<Table.Tr>
												<Table.Th>Set</Table.Th>
												<Table.Th>Weight</Table.Th>
												<Table.Th>Reps</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{/* Accessing the exercises from the instanceOfexercises STATE and then rendering rows for each set */}
											{/* The set in this case is coming from the array of sets INSIDE the instanceOfexercises STATE */}
											{exercise.sets.map((set, index) => (
												<Table.Tr key={index}>
													<Table.Td>
														<Menu
															shadow="md"
															width={200}
														>
															<Menu.Target>
																<Text
																	size="sm"
																	className="flex items-center justify-center cursor-pointer"
																>
																	{index + 1}
																</Text>
															</Menu.Target>
															<Menu.Dropdown>
																<Menu.Item
																	leftSection={
																		<Trash
																			size={14}
																			color="red"
																		/>
																	}
																	onClick={() =>
																		handleDeleteSet(exercise.id, set.id)
																	}
																>
																	<Text size="xs">Delete set</Text>
																</Menu.Item>
															</Menu.Dropdown>
														</Menu>
													</Table.Td>
													<Table.Td>
														<TextInput
															variant="unstyled"
															placeholder="0kg"
															value={set.weight}
															onChange={(event) =>
																handleInputChange(
																	exercise.id, // this is refered to as exerciseId and setId as parameters inside the function
																	set.id,
																	"weight",
																	event.currentTarget.value
																)
															}
														/>
													</Table.Td>
													<Table.Td>
														<TextInput
															variant="unstyled"
															placeholder="0"
															value={set.reps}
															onChange={(event) => {
																handleInputChange(
																	exercise.id,
																	set.id,
																	"reps",
																	event.currentTarget.value
																);
															}}
														/>
													</Table.Td>
													<Table.Td>
														<Checkbox
															color="teal.6"
															size="md"
															checked={set.isCompleted || false}
															onChange={(e) => {
																handleSetCompletion(
																	exercise.id,
																	set.id,
																	e.currentTarget.checked
																);
																setExerciseSetCompleted(
																	e.currentTarget.checked
																);
															}}
														/>
													</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>

									<Group mt="md">
										<Button
											variant="light"
											color="teal"
											leftSection={<Plus size={20} />}
											// pass the exercise.id taken from the id property of an exercise
											onClick={() => handleRowRender(exercise.id)}
										>
											Add Set
										</Button>
									</Group>
								</div>
							);
						})}
					</Stack>

					<Group
						justify="center"
						mt="md"
					>
						<Button
							leftSection={<Plus size={20} />}
							variant="default"
							onClick={open}
						>
							Add Exercise
						</Button>
						<Button
							leftSection={<CheckCircle size={20} />}
							color="green"
							onClick={() => {
								handleRoutineUpload();
								navigate("/home-page");
							}}
						>
							Finish
						</Button>
					</Group>
				</Stack>
			</Container>

			<Modal
				opened={opened}
				onClose={close}
				title="Add Exercise"
				fullScreen
				radius={0}
				transitionProps={{ transition: "fade", duration: 200 }}
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
								onClick={() => {
									handleExerciseRender(exercise);
									close();
								}}
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
			</Modal>
		</>
	);
};

export default Routine;
