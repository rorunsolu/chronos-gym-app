import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import styles from "@/hover.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import {
	CheckCircle,
	EllipsisVertical,
	Plus,
	Search,
	Trash,
} from "lucide-react";
import {
	Button,
	Card,
	Checkbox,
	Container,
	//Divider,
	Group,
	Input,
	Menu,
	Modal,
	NumberInput,
	Select,
	Stack,
	Table,
	Text,
	Textarea,
	TextInput,
} from "@mantine/core";
import {
	equipment,
	localExerciseInfo,
	primaryMuscleGroups,
} from "@/common/index";
import type { ExerciseData } from "@/common/types";

const WorkoutNew = () => {
	// Hooks
	const navigate = useNavigate();
	const { createWorkout } = useWorkOutHook();

	// For Mantine modal
	const [opened, { open, close }] = useDisclosure(false);
	const [finishOpen, finishHandler] = useDisclosure(false);

	// For the search functionality
	const [search, setSearch] = useState("");
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		null
	);

	// For createWorkout functionality
	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [duration, setDuration] = useState(0);
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [, setExerciseSetCompleted] = useState(false);

	// Filter exercises based on search, muscle group, and equipment
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

	// Docs referenced
	// Dealing with the exercise & row rendering - https://react.dev/learn/rendering-lists

	// Add a new exercise with an initial set that includes the required "id" property
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

	const handleDeleteExercise = (exerciseId: string) => {
		setExercises((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseId)
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

	const handlePreConfirmation = () => {
		pause();
		setDuration(totalSeconds);
		finishHandler.open();
	};

	const [error, setError] = useState("");

	const handleSessionUpload = async () => {
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
		await createWorkout(name, exercises, duration, notes);
		navigate("/workout-page");
	};

	const { totalSeconds, seconds, minutes, hours, pause, start } = useStopwatch({
		autoStart: true,
		interval: 20,
	});

	useEffect(() => {
		setDuration(totalSeconds);
	}, [totalSeconds]);

	const handleExerciseNotesChange = (exerciseId: string, notes: string) => {
		setExercises((prev) =>
			prev.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							notes,
						}
					: exercise
			)
		);
	};

	return (
		<>
			<Container
				size="xs"
				p="md"
				py="md"
			>
				<Stack justify="space-between">
					<Stack>
						<Group justify="space-between">
							<TextInput
								size="lg"
								variant="unstyled"
								value={name}
								placeholder="Enter workout name"
								onChange={(e) => setName(e.target.value)}
							/>

							<Text
								c="teal.4"
								fw={500}
								size="lg"
							>
								Duration: {hours}:{minutes}:{seconds}
							</Text>
						</Group>

						<Stack gap="xl">
							{exercises.map((exercise) => {
								return (
									<div key={exercise.id}>
										<Group
											mb="xs"
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
														onClick={() => handleDeleteExercise(exercise.id)}
													>
														<Text size="sm">Delete Exercise</Text>
													</Menu.Item>
												</Menu.Dropdown>
											</Menu>
										</Group>

										<Textarea
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
																variant="unstyled"
																placeholder="0kg"
																value={set.weight}
																onChange={(value) =>
																	handleInputChange(
																		exercise.id,
																		set.id,
																		"weight",
																		value || 0
																	)
																}
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
					</Stack>

					<Stack>
						<Group
							justify="right"
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
									handlePreConfirmation();
								}}
								disabled={!name || exercises.length === 0}
							>
								Finish
							</Button>
						</Group>
					</Stack>
				</Stack>
			</Container>

			<Modal
				opened={finishOpen}
				onClose={() => {
					finishHandler.close();
					start();
					setError("");
				}}
				title="Are you sure?"
				centered
			>
				<Stack
					gap="xs"
					mb="lg"
				>
					<Text
						size="sm"
						c="dimmed"
					>
						Elapsed Time: {hours >= 0.1 && <>{hours} hours</>}{" "}
						{minutes >= 0.1 && <>{minutes} minutes,</>} {seconds} seconds
					</Text>

					<Stack
						gap={0}
						mt="sm"
					>
						<TextInput
							size="md"
							value={notes}
							variant="unstyled"
							placeholder="How was your workout..."
							onChange={(event) => setNotes(event.currentTarget.value)}
						/>
					</Stack>

					{error && (
						<Text
							size="sm"
							c="red.7"
						>
							{error}
						</Text>
					)}
				</Stack>

				<Stack>
					<Group justify="flex-end">
						<Button
							variant="light"
							color="red"
							onClick={() => {
								finishHandler.close();
								start();
								setError("");
							}}
						>
							Cancel
						</Button>

						<Button
							bg="teal"
							variant="default"
							onClick={() => {
								handleSessionUpload();
							}}
						>
							Confirm
						</Button>
					</Group>
				</Stack>
			</Modal>

			<Modal
				opened={opened}
				onClose={close}
				title="Add Exercise"
				fullScreen
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
							placeholder="Select equipment"
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
							placeholder="Select muscle group"
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

					<Stack
						gap="5"
						mt="xs"
					>
						{filtered.map((exercise, index) => (
							<Card
								className={styles.hover}
								key={index}
								withBorder
								radius="md"
								//bg="dark.7"
								p="sm"
								//style={{ cursor: "pointer" }}
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

export default WorkoutNew;
