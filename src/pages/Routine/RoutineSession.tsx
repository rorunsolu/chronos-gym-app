import { db } from "@/auth/Firebase";
import { getSessionStats } from "@/common/singleSessionStats";
import ExerciseCardList from "@/components/Exercises/ExerciseCardList";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import styles from "@/style.module.css";
import { useDisclosure } from "@mantine/hooks";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import { v4 as uuidv4 } from "uuid";
import {
	Check,
	CheckCircle,
	EllipsisVertical,
	Plus,
	Search,
	Trash,
	X,
} from "lucide-react";
import {
	Container,
	Group,
	Stack,
	Text,
	Button,
	Table,
	TextInput,
	Modal,
	Card,
	Switch,
	Checkbox,
	Menu,
	Textarea,
	NumberInput,
} from "@mantine/core";
import { type ExerciseData } from "@/common/types";

const RoutineSession = () => {
	const { id } = useParams<{ id: string }>();
	const [search, setSearch] = useState("");
	const [, setIsLoading] = useState(true);
	const [rountineName, setRoutineName] = useState("");
	const [notes, setNotes] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [error, setError] = useState("");
	const [totalVol, setTotalVol] = useState<number>(0);
	const [totalSets, setTotalSets] = useState<number>(0);

	const { FBExercises, fetchFBExercises } = useExercisesHook();
	const [finishOpen, finishHandler] = useDisclosure(false);
	const [checked, setChecked] = useState(false);
	const [duration, setDuration] = useState(0);

	const { totalSeconds, seconds, minutes, hours, pause, start } = useStopwatch({
		autoStart: true,
		interval: 20,
	});

	const navigate = useNavigate();
	const { createWorkout } = useWorkOutHook();

	useEffect(() => {
		const fetchData = async () => {
			await fetchFBExercises();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

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
						weight: "",
						reps: "",
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

	const handleRoutineUpdate = async (
		updatedRoutineName: string,
		updatedRoutineExercises: ExerciseData[]
	) => {
		try {
			if (!id) {
				return;
			}

			await setDoc(
				doc(db, "routines", id),
				{
					name: updatedRoutineName,
					exercises: updatedRoutineExercises,
				},
				{ merge: true }
			);
		} catch (error) {
			new Error("Error updating routine");
		}
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

	const handleUpdatePreConfirmation = async () => {
		const hasEmptySets = exercises.some((exercise) =>
			exercise.sets.some((set) => !set.weight || !set.reps || !set.isCompleted)
		);

		if (hasEmptySets) {
			setError(
				"Some sets are incomplete. Please complete them before saving the routine."
			);
			return;
		}

		if (checked) {
			await handleRoutineUpdate(rountineName, exercises);
		}

		setError("");
		navigate("/home");
	};

	const handlePreConfirmation = () => {
		pause();
		setDuration(totalSeconds);
		finishHandler.open();
	};

	const handleCreateWorkoutFromRoutine = async () => {
		const hasEmptySets = exercises.some((exercise) =>
			exercise.sets.some((set) => !set.weight || !set.reps || !set.isCompleted)
		);

		if (hasEmptySets) {
			setError(
				"Some sets are empty. Please complete them before saving the routine."
			);
			return;
		}

		await createWorkout(rountineName, exercises, duration);
		handleUpdatePreConfirmation();
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

	const handeleDeleteExercise = (exerciseid: string) => {
		setExercises((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseid)
		);
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
		if (isInitialLoad) {
			setIsInitialLoad(false);
			return;
		}

		const fetchData = async () => {
			try {
				if (!id) {
					new Error("Could not find routine ID");
					return;
				}

				const objectRef = doc(db, "routines", id);
				const objectSnapshot = await getDoc(objectRef);

				if (!objectSnapshot.exists()) {
					throw new Error("Routine snapshot not found");
				}

				// Firestore automatically assigns an id to the document reference, but it's not part of the document data unless explicitly saved.
				// In RoutineSession.tsx, use objectSnapshot.id to access the routine's ID instead of checking objectData.id.

				const objectData = objectSnapshot.data();

				if (!objectData) {
					throw new Error("Routine data not found");
				}

				const validatedExercises = (objectData.exercises || []).map(
					(exercise: ExerciseData) => ({
						...exercise,
						sets: Array.isArray(exercise.sets)
							? exercise.sets.map((set) => ({ ...set, isCompleted: false }))
							: [],
					})
				);

				setRoutineName(objectData.name || "");
				setExercises(validatedExercises);
			} catch (error) {
				new Error("Error fetching routine data");
				setIsLoading(false);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, isInitialLoad]);

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
				px="sm"
				py="md"
			>
				<Stack
					gap="xs"
					w="100%"
				>
					<Stack>
						<Text
							fw={500}
							size="xl"
						>
							{rountineName}
						</Text>
					</Stack>
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

					<Stack gap="xl">
						{exercises.map((exercise, index) => (
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
													onClick={() => handeleDeleteExercise(exercise.id)}
												>
													<Text size="sm">Delete Exercise</Text>
												</Menu.Item>
											</Menu.Dropdown>
										</Menu>
									</Group>

									<Textarea
										c="white"
										size="sm"
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
										{/* Never map over the same array (in this case it's exercises) twice in the same component or file? It will throw a error like "exercise2.sets is undefined"*/}
										{exercise.sets.map((set, index) => (
											<Table.Tr
												key={set.id}
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
														value=""
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
														value=""
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
						))}
					</Stack>

					<Group
						justify="center"
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
						>
							Finish
						</Button>
					</Group>
				</Stack>
			</Container>

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
				<Text
					size="sm"
					c="dimmed"
					mb="md"
				>
					Elapsed Time: {hours >= 0.1 && <>{hours} hours</>}{" "}
					{minutes >= 0.1 && <>{minutes} minutes,</>} {seconds} seconds
				</Text>

				<Stack gap="xs">
					<Switch
						size="sm"
						color="teal"
						label="Update routine with current session?"
						checked={checked}
						onChange={(event) => setChecked(event.currentTarget.checked)}
						thumbIcon={
							checked ? (
								<Check
									size={12}
									color="var(--mantine-color-teal-6)"
								/>
							) : (
								<X
									size={12}
									color="var(--mantine-color-red-6)"
								/>
							)
						}
					/>

					{checked && (
						<Stack gap={0}>
							<TextInput
								c="white"
								size="md"
								variant="unstyled"
								placeholder="Name your routine"
								value={rountineName}
								onChange={(e) => setRoutineName(e.target.value)}
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
					)}

					{error && (
						<Text
							size="sm"
							c="red.7"
						>
							{error}
						</Text>
					)}

					<Group
						justify="flex-end"
						{...(!checked ? { mt: "md" } : {})}
					>
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
								handleCreateWorkoutFromRoutine();
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
				bg="dark.9"
				fullScreen
				h="100%"
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

export default RoutineSession;
