import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	CheckCircle,
	Plus,
	Search,
	Trash,
	EllipsisVertical,
} from "lucide-react";
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
	Textarea,
	NumberInput,
} from "@mantine/core";
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

	const handeleDeleteExercise = (exerciseid: string) => {
		setExercises((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseid)
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
						id: Date.now().toString(),
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
		value: string | number
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

	const handleExerciseNotesChange = (exerciseId: string, notes: string) => {
		setExercises((prev) =>
			prev.map((exercise) =>
				exercise.id === exerciseId ? { ...exercise, notes } : exercise
			)
		);
	};

	const [error, setError] = useState("");

	const handleRoutineUpload = async () => {
		const hasEmptySets = exercises.some((exercise) =>
			exercise.sets.some((set) => !set.weight || !set.reps || !set.isCompleted)
		);

		if (hasEmptySets) {
			setError(
				"Some sets are empty. Please complete them before saving the routine."
			);
			return;
		}

		setError("");
		createRoutine(name, exercises);
		setExercises([]);
		setName("");
		navigate("/home-page");
	};

	return (
		<>
			<Container
				size="xs"
				p="md"
				py="md"
			>
				<Stack gap="md">
					<TextInput
						size="lg"
						variant="unstyled"
						value={name}
						placeholder="Enter routine name"
						onChange={(e) => setName(e.target.value)}
					/>

					<Stack gap="xl">
						{exercises.map((exercise, index) => {
							return (
								<div key={exercise.id}>
									<Stack gap="0">
										<Group
											justify="space-between"
											align="center"
										>
											<Text
												fw={500}
												size="lg"
											>
												{exercise.name}
											</Text>
											<Menu
												shadow="md"
												width={200}
											>
												<Menu.Target>
													<Button
														variant="subtle"
														color="gray"
													>
														<EllipsisVertical size={16} />
													</Button>
												</Menu.Target>
												<Menu.Dropdown>
													<Menu.Item
														leftSection={
															<Trash
																size={14}
																color="red"
															/>
														}
														onClick={() => handeleDeleteExercise(exercise.id)}
													>
														<Text size="sm">Delete Exercise</Text>
													</Menu.Item>
												</Menu.Dropdown>
											</Menu>
										</Group>

										<Textarea
											key={index}
											autosize
											minRows={1}
											maxRows={4}
											variant="unstyled"
											placeholder="Add notes here..."
											value={exercise.notes}
											onChange={(e) =>
												handleExerciseNotesChange(exercise.id, e.target.value)
											}
										/>

										{/* <Menu
											shadow="md"
											width={200}
										>
											<Menu.Target>
												<Button
													variant="subtle"
													color="gray"
												>
													<EllipsisVertical size={16} />
												</Button>
											</Menu.Target>
											<Menu.Dropdown>
												<Menu.Item>
													<Text size="sm">Rest Timer</Text>
												</Menu.Item>
											</Menu.Dropdown>
										</Menu> */}
									</Stack>

									<Stack>
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
															<NumberInput
																value={set.weight}
																onChange={(value) =>
																	handleInputChange(
																		exercise.id,
																		set.id,
																		"weight",
																		value || 0
																	)
																}
																variant="unstyled"
																placeholder="0kg"
															/>
														</Table.Td>
														<Table.Td>
															<NumberInput
																variant="unstyled"
																placeholder="0"
																value={set.reps}
																onChange={(value) => {
																	handleInputChange(
																		exercise.id,
																		set.id,
																		"reps",
																		value || 0
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
									</Stack>

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

					<Stack>
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
								}}
								disabled={!name || exercises.length === 0}
							>
								Finish
							</Button>
							{error && <Text c="red">{error}</Text>}
						</Group>
					</Stack>
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
