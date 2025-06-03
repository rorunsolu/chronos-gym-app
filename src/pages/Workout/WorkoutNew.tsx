import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import { useDisclosure } from "@mantine/hooks";
import { CheckCircle, Plus, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import {
	equipment,
	localExerciseInfo,
	primaryMuscleGroups,
} from "@/assets/index";
import { type ExerciseData } from "@/contexts/RoutineContext";
import {
	Container,
	Group,
	Stack,
	Text,
	Button,
	Table,
	Modal,
	TextInput,
	Card,
	Divider,
	Select,
	Input,
	Checkbox,
	Menu,
	Textarea,
} from "@mantine/core";

const WorkoutNew = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [finishOpen, finishHandler] = useDisclosure(false);

	const [duration, setDuration] = useState(0);
	const [, setExerciseSetCompleted] = useState(false);

	const [search, setSearch] = useState("");
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		null
	);
	const [name, setName] = useState("");
	const [exercises, setExercises] = useState<ExerciseData[]>([]);

	const navigate = useNavigate();
	const { createWorkout } = useWorkOutHook();

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

	// when the function is called
	// pass the exerciseId as a parameter to the function
	// make use of the instancesOfexercises state and map through it
	// for ech exercise check if the exerciseId paramater matches the exercise.id field of the exercise (thats from the state)
	// if it is true then spread open that same exercise
	// the sprewad open the array of sets inside of the exercise
	// declare the properties of what each set should have to be used when a new row is rendered

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

	const handlePreConfirmation = () => {
		pause();
		setDuration(totalSeconds);
		finishHandler.open();
	};

	const handleSessionUpload = async () => {
		createWorkout(name, exercises, duration);
		setExercises([]);
		setName("");
		setDuration(0);
		navigate("/home-page");
	};

	const { totalSeconds, seconds, minutes, hours, pause, start } = useStopwatch({
		autoStart: true,
		interval: 20,
	});

	useEffect(() => {
		setDuration(totalSeconds);
		// eslint-disable-next-line
		console.log(`Total elapsed time in seconds: ${totalSeconds}`);
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
				size="sm"
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
										<Group mb="xs">
											<Text
												fw={500}
												size="lg"
											>
												{exercise.name}
											</Text>
											{exercises.map((exercise, index) => (
												<Textarea
													key={index}
													autosize
													minRows={1}
													maxRows={4}
													variant="unstyled"
													placeholder="Add notes here..."
													value={exercise.notes}
													onChange={(e) =>
														handleExerciseNotesChange(
															exercise.id,
															e.target.value
														)
													}
												/>
											))}
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
					</Stack>

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
						>
							Finish
						</Button>
					</Group>
				</Stack>
			</Container>

			<Modal
				opened={finishOpen}
				onClose={finishHandler.close}
				title="Are you sure?"
				centered
			>
				<Text
					size="sm"
					c="dimmed"
					mb="md"
				>
					Elapsed Time: {hours >= 0.1 && <>{hours} hours</>}{" "}
					{minutes >= 0.1 && <>{minutes} minutes,</>} {seconds} seconds
				</Text>

				<Group justify="flex-end">
					<Button
						variant="light"
						color="red"
						onClick={() => {
							finishHandler.close();
							start();
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
			</Modal>

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

export default WorkoutNew;
