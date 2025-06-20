import classes from "@/accordion.module.css";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import styles from "@/hover.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
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
	Group,
	Input,
	Menu,
	Modal,
	//Select,
	Stack,
	Table,
	Text,
	TextInput,
	Textarea,
	NumberInput,
} from "@mantine/core";

import { type ExerciseData } from "@/common/types";

const Routine = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [search, setSearch] = useState("");

	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [finishOpen, finishHandler] = useDisclosure(false);

	const { createRoutine } = useRoutinesHook();
	const { totalSeconds, seconds, minutes, hours, pause, start } = useStopwatch({
		autoStart: true,
		interval: 20,
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

	const handleExerciseRender = (
		exercise: { name: string },
		mappedId: string
	) => {
		setExercises((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				name: exercise.name, // the type defintion (exercise: { name: string }) for the exercise paramater is for this ONLY
				notes: "",
				mappedId,
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
		await createRoutine(name, exercises, duration, notes);
		navigate("/home");
	};

	const handlePreConfirmation = () => {
		pause();
		finishHandler.open();
	};

	const [duration, setDuration] = useState(0);

	useEffect(() => {
		setDuration(totalSeconds);
	}, [totalSeconds]);

	const { FBExercises, fetchFBExercises } = useExercisesHook();

	useEffect(() => {
		const fetchData = async () => {
			await fetchFBExercises();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Container
				size="xs"
				p="md"
				py="md"
			>
				<Stack gap="md">
					<Group
						px="sm"
						py="4"
						justify="space-between"
						className={classes.item}
						bg="dark.9"
					>
						<TextInput
							c="white"
							size="lg"
							variant="unstyled"
							placeholder="Name your routine"
							onChange={(e) => setName(e.target.value)}
						/>
						<Card
							className={classes.item}
							py="5"
							px="10"
							withBorder
						>
							<Text
								fw={500}
								size="sm"
							>
								Duration: {hours > 0 ? `${hours}s:` : ""}
								{minutes}min {seconds}s
							</Text>
						</Card>
					</Group>

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
												width="fit-content"
												position="bottom-end"
											>
												<Menu.Target>
													<Button
														px="5"
														py="0"
														variant="subtle"
														color="white"
														className={styles.hover}
														style={{
															border:
																"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
														}}
													>
														<EllipsisVertical size={16} />
													</Button>
												</Menu.Target>
												<Menu.Dropdown bg="dark.9">
													<Menu.Item
														className={styles.hover}
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
											c="white"
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
																width="fit-content"
																position="bottom-start"
															>
																<Menu.Target>
																	<Text
																		size="sm"
																		className="flex items-center justify-center cursor-pointer"
																	>
																		{index + 1}
																	</Text>
																</Menu.Target>
																<Menu.Dropdown bg="dark.9">
																	<Menu.Item
																		className={styles.hover}
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
								onClick={open}
								className={styles.hover}
								style={{
									border:
										"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color) !important",
								}}
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
				opened={opened}
				onClose={close}
				title="Add Exercise"
				//fullScreen
				radius={0}
				transitionProps={{ transition: "fade", duration: 200 }}
				bg="dark.9"
			>
				<Stack gap="sm">
					<Input
						leftSection={<Search size={16} />}
						placeholder="Search exercise"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<Stack
						gap="5"
						mt="xs"
					>
						{FBExercises.map((exercise, id) => (
							<Card
								className={styles.hover}
								key={id}
								withBorder
								radius="md"
								p="sm"
								style={{ cursor: "pointer" }}
								onClick={() => {
									handleExerciseRender(exercise, exercise.id);
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

			<Modal
				opened={finishOpen}
				onClose={() => {
					finishHandler.close();
					start();
					setError("");
				}}
				title="Are you sure you want to finish?"
				size="lg"
				centered
				transitionProps={{ transition: "fade", duration: 200 }}
				//bg="dark.9"
				//className={classes.modal}
			>
				<Stack
					gap={0}
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
							c="white"
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
							className={styles.hover}
							style={{
								border:
									"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
							}}
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
								handleRoutineUpload();
							}}
						>
							Confirm
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	);
};

export default Routine;
