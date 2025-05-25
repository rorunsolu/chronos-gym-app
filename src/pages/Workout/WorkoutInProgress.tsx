import { equipment, exerciseData, primaryMuscleGroups } from "@/assets/index";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import { useDisclosure } from "@mantine/hooks";
import { CheckCircle, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
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
} from "@mantine/core";

const WorkoutInProgress = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [search, setSearch] = useState("");
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		null
	);
	const [name, setName] = useState("");
	const [exercises, setExercises] = useState<ExerciseData[]>([]);

	const navigate = useNavigate();
	const { fetchExercises } = useExercisesHook();
	const { createWorkout } = useWorkOutHook();

	// Part of the logic for the add exercise modal
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
								{ id: Date.now().toString(), reps: "", weight: "" },
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

	const handleSessionUpload = async () => {
		createWorkout(name, exercises);
		setExercises([]);
		setName("");
	};

	const {
		//totalSeconds,
		seconds,
		minutes,
		hours,
	} = useStopwatch({ autoStart: true, interval: 20 });

	useEffect(() => {
		fetchExercises();
	}, []);

	return (
		<>
			<Container
				size="sm"
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
															<Text size="xs">{index + 1}</Text>
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
								handleSessionUpload();
								navigate("/home");
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

export default WorkoutInProgress;
