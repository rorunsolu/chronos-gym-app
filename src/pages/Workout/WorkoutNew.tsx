import { useExercisesHook } from "../../hooks/useExercisesHook";
import { getSessionStats } from "@/common/singleSessionStats";
import ExerciseCardList from "@/components/Exercises/ExerciseCardList";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import styles from "@/style.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { v4 as uuidv4 } from "uuid";
import {
	Check,
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
	Group,
	Menu,
	Modal,
	NumberInput,
	Stack,
	Table,
	Text,
	Textarea,
	TextInput,
} from "@mantine/core";

import type { ExerciseData } from "@/common/types";

const WorkoutNew = () => {
	const [error, setError] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const [finishOpen, finishHandler] = useDisclosure(false);

	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [search, setSearch] = useState("");
	const [duration, setDuration] = useState(0);
	const [totalVol, setTotalVol] = useState<number>(0);
	const [totalSets, setTotalSets] = useState<number>(0);
	const [exercises, setExercises] = useState<ExerciseData[]>([]);

	const navigate = useNavigate();
	const { createWorkout } = useWorkOutHook();
	const { FBExercises, fetchFBExercises } = useExercisesHook();
	const { totalSeconds, seconds, minutes, hours, pause, start } = useStopwatch({
		autoStart: true,
		interval: 20,
	});

	const handleExerciseRender = (
		exercise: { name: string },
		mappedId: string
	) => {
		setExercises((prev) => [
			...prev,
			{
				id: uuidv4(),
				name: exercise.name,
				mappedId,
				sets: [
					{
						id: uuidv4(),
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
									id: uuidv4(),
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

	const handleDeleteExercise = (exerciseId: string) => {
		setExercises((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseId)
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

	const handlePreConfirmation = () => {
		pause();
		setDuration(totalSeconds);
		finishHandler.open();
	};

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
		navigate("/home");
	};

	const handleVolumeChange = () => {
		const totalVolume = getSessionStats(exercises).totalVolume;
		setTotalVol(totalVolume);
	};

	const handleSetChange = () => {
		const totalSets = getSessionStats(exercises).totalSets;
		setTotalSets(totalSets);
	};

	useEffect(() => {
		setDuration(totalSeconds);
	}, [totalSeconds]);

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
				<Stack justify="space-between">
					<Stack gap="xs">
						{exercises.length > 0 && (
							<Group
								mb="sm"
								w="100%"
							>
								<Card
									className={styles.item}
									py="5"
									px="10"
									withBorder
									w="100%"
								>
									<Group>
										<Stack
											gap="0"
											align="start"
										>
											<Text
												size="xs"
												c="dimmed"
											>
												Sets
											</Text>
											<Text
												fw={400}
												size="sm"
												c="white"
											>
												{totalSets}
											</Text>
										</Stack>
										<Stack
											gap="0"
											align="start"
										>
											<Text
												size="xs"
												c="dimmed"
											>
												Volume
											</Text>
											<Text
												fw={400}
												size="sm"
												c="white"
											>
												{totalVol}kg
											</Text>
										</Stack>
										<Stack
											gap="0"
											align="start"
										>
											<Text
												size="xs"
												c="dimmed"
											>
												Duration
											</Text>
											<Text
												fw={400}
												size="sm"
												c="white"
											>
												{hours > 0 ? `${hours}s:` : ""}
												{minutes}min {seconds}s
											</Text>
										</Stack>
									</Group>
								</Card>
							</Group>
						)}

						{exercises.length === 0 && (
							<Text
								mb="-5"
								mt="md"
								size="sm"
								c="dimmed"
							>
								No exercises added yet. Click "Add Exercise" to start.
							</Text>
						)}

						<Stack gap="xl">
							{exercises.map((exercise) => {
								return (
									<div key={exercise.id}>
										<Stack gap="0">
											<Group
												justify="space-between"
												align="center"
											>
												<Text
													fw={500}
													size="md"
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
															variant="subtle"
															color="gray"
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
															onClick={() => handleDeleteExercise(exercise.id)}
														>
															<Text size="sm">Delete Exercise</Text>
														</Menu.Item>
													</Menu.Dropdown>
												</Menu>
											</Group>

											<Textarea
												c="white"
												autosize
												size="sm"
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

										<Table
											striped
											withRowBorders={false}
										>
											<Table.Thead>
												<Table.Tr>
													<Table.Th>Set</Table.Th>
													<Table.Th>
														<Group gap="5">Weight</Group>
													</Table.Th>
													<Table.Th>
														<Group gap="5">Reps</Group>
													</Table.Th>
													<Table.Th>
														<Group justify="center">
															<Check size={16} />
														</Group>
													</Table.Th>
												</Table.Tr>
											</Table.Thead>
											<Table.Tbody>
												{/* Accessing the exercises from the instanceOfexercises STATE and then rendering rows for each set */}
												{/* The set in this case is coming from the array of sets INSIDE the instanceOfexercises STATE */}
												{exercise.sets.map((set, index) => (
													<Table.Tr
														key={index}
														bg={
															set.isCompleted
																? "var(--mantine-color-teal-light)"
																: undefined
														}
													>
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
																	handleVolumeChange();
																	handleSetChange();
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
								color="white"
								leftSection={<Plus size={20} />}
								variant="outline"
								onClick={open}
								className={styles.hover}
								style={{
									border:
										"calc(0.0625rem * var(--mantine-scale)) solid var(--mantine-color-dark-4)",
									boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
								}}
							>
								Add Exercise
							</Button>
							<Button
								leftSection={<CheckCircle size={20} />}
								color="teal"
								onClick={() => {
									handlePreConfirmation();
								}}
								disabled={exercises.length === 0}
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
				fullScreen
				transitionProps={{ transition: "fade", duration: 200 }}
			>
				<Stack gap="sm">
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
					setNotes("");
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
						mt="-8"
					>
						<Stack gap={0}>
							<TextInput
								c="white"
								size="md"
								variant="unstyled"
								placeholder="Name your workout"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<Textarea
								autosize
								minRows={1}
								maxRows={4}
								mt="-7"
								size="sm"
								value={notes}
								variant="unstyled"
								placeholder="How was your workout..."
								onChange={(event) => setNotes(event.currentTarget.value)}
							/>
						</Stack>
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

				<Group justify="flex-end">
					<Button
						variant="light"
						color="red"
						onClick={() => {
							finishHandler.close();
							start();
							setError("");
							setNotes("");
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
				bg="dark.9"
				fullScreen
				transitionProps={{ transition: "fade", duration: 200 }}
			>
				<Stack gap="xs">
					<TextInput
						leftSection={<Search size={16} />}
						placeholder="Search exercise"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<ExerciseCardList
						exercises={FBExercises}
						onSelect={(exercise) => {
							handleExerciseRender(exercise, exercise.id);
							close();
						}}
						search={search}
					/>
				</Stack>
			</Modal>
		</>
	);
};

export default WorkoutNew;
