import { db } from "@/auth/Firebase";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import { useDisclosure } from "@mantine/hooks";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import {
	Check,
	CheckCircle,
	Hash,
	Plus,
	Search,
	Trash,
	Weight,
	X,
} from "lucide-react";
import {
	equipment,
	localExerciseInfo,
	primaryMuscleGroups,
} from "@/assets/index";
import {
	Container,
	Group,
	Stack,
	Text,
	Button,
	Table,
	TextInput,
	LoadingOverlay,
	Modal,
	Card,
	Divider,
	Select,
	Input,
	Switch,
	Checkbox,
	Menu,
} from "@mantine/core";
import type { ExerciseData } from "@/contexts/RoutineContext";

const RoutineSession = () => {
	const { id } = useParams<{ id: string }>();
	const [visible] = useDisclosure(false);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [rountineName, setRoutineName] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [muscle, setMuscle] = useState<string | null>(null);
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [modalEquipment, setModalEquipment] = useState<string | null>(null);

	const navigate = useNavigate();
	const { createWorkout } = useWorkOutHook();

	const modalExercises = localExerciseInfo.filter((modalExercise) => {
		const matchesSearch = modalExercise.name
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesMuscle = muscle ? modalExercise.muscleGroup === muscle : true;
		const matchesEquipment = equipment
			? modalExercise.equipment === modalEquipment
			: true;

		const showAllMuscles = muscle === "All Muscles";
		const showAllEquipment = modalEquipment === "All Equipment";

		return (
			(matchesSearch && matchesMuscle && matchesEquipment) ||
			showAllMuscles ||
			showAllEquipment
		);
	});

	const handleExerciseRender = (exerciseFromModal: { name: string }) => {
		setExercises((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				name: exerciseFromModal.name,
				sets: [
					{
						id: Date.now().toString(),
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

	const [, setExerciseSetCompleted] = useState(false);

	const [finishOpen, finishHandler] = useDisclosure(false);
	const [checked, setChecked] = useState(false);
	const [duration, setDuration] = useState(0);

	const { totalSeconds, seconds, minutes, hours, pause, start } = useStopwatch({
		autoStart: true,
		interval: 20,
	});

	const handleUpdatePreConfirmation = async () => {
		try {
			if (!rountineName || rountineName.trim() === "") {
				new Error("Session name cannot be empty");
				return;
			}

			if (checked) {
				await handleRoutineUpdate(rountineName, exercises);
			}
		} catch (error) {
			new Error("Error updating routine");
		} finally {
			navigate("/routine-page");
		}
	};

	const handlePreConfirmation = () => {
		pause();
		setDuration(totalSeconds);
		finishHandler.open();
	};

	const handleCreateWorkoutFromRoutine = async () => {
		createWorkout(rountineName, exercises, duration);
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
				setExerciseSetCompleted(false);
			} catch (error) {
				new Error("Error fetching routine data");
				setIsLoading(false);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, isInitialLoad]);

	return (
		<>
			<Container
				size="xs"
				p="md"
				py="md"
				pos="relative"
			>
				{isLoading && (
					<LoadingOverlay
						visible={visible}
						zIndex={1000}
						overlayProps={{ radius: "sm", blur: 2 }}
					/>
				)}

				<Stack gap="md">
					<Stack
						gap="xs"
						py="md"
					>
						<TextInput
							size="lg"
							variant="unstyled"
							value={rountineName}
							onChange={(e) => setRoutineName(e.target.value)}
						/>
					</Stack>

					<Stack gap="xl">
						{exercises.map((exercise) => (
							<Stack key={exercise.id}>
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
											<Table.Th>
												<Group gap="5">
													<Weight size={16} />
													Weight
												</Group>
											</Table.Th>
											<Table.Th>
												<Group gap="5">
													<Hash size={16} />
													Reps
												</Group>
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
														size="sm"
														variant="unstyled"
														placeholder="0kg"
														value={set.weight}
														onChange={(e) =>
															handleInputChange(
																exercise.id,
																set.id,
																"weight",
																e.currentTarget.value
															)
														}
													/>
												</Table.Td>
												<Table.Td>
													<TextInput
														variant="unstyled"
														placeholder="0"
														value={set.reps}
														onChange={(e) =>
															handleInputChange(
																exercise.id,
																set.id,
																"reps",
																e.currentTarget.value
															)
														}
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
															setExerciseSetCompleted(e.currentTarget.checked);
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
							</Stack>
						))}
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

				<Stack>
					<Switch
						size="md"
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
							onChange={setModalEquipment}
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
							onChange={setMuscle}
						/>
					</Group>

					<Divider />

					<Stack>
						{modalExercises.map((exerciseFromModal, index) => (
							<Card
								key={index}
								withBorder
								radius="md"
								p="sm"
								style={{ cursor: "pointer" }}
								onClick={() => {
									handleExerciseRender(exerciseFromModal);
									close();
								}}
							>
								<Group>
									<Text fw={500}>{exerciseFromModal.name}</Text>
									<Text
										size="xs"
										c="dimmed"
									>
										{exerciseFromModal.muscleGroup}
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

export default RoutineSession;
