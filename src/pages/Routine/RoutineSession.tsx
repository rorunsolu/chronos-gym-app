import { equipment, exerciseData, primaryMuscleGroups } from "@/assets/index";
import { db } from "@/auth/Firebase";
import { useDisclosure } from "@mantine/hooks";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CheckCircle, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@mantine/core";
import type { ExerciseData } from "@/contexts/RoutineContext";

const RoutineSession = () => {
	const { id } = useParams<{ id: string }>();
	const [visible] = useDisclosure(false);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [rountineName, setRoutineName] = useState("");
	const [opened, { open, close }] = useDisclosure(false);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [muscle, setMuscle] = useState<string | null>(null);
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [modalEquipment, setModalEquipment] = useState<string | null>(null);

	const navigate = useNavigate();

	const modalExercises = exerciseData.filter((modalExercise) => {
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
								{ id: Date.now().toString(), reps: "", weight: "" },
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

				// Validate exercises and sets
				const validatedExercises = (objectData.exercises || []).map(
					(exercise: ExerciseData) => ({
						...exercise,
						sets: Array.isArray(exercise.sets) ? exercise.sets : [],
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

	return (
		<>
			<Container
				size="sm"
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
					<Stack gap="xs">
						<TextInput
							size="lg"
							variant="unstyled"
							defaultValue={rountineName}
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
											<Table.Th>Weight</Table.Th>
											<Table.Th>Reps</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{/* Never map over the same array (in this case it's exercises) twice in the same component or file? It will throw a error like "exercise2.sets is undefined"*/}
										{exercise.sets.map((set, index) => (
											<Table.Tr key={set.id}>
												<Table.Td>
													<Text size="xs">{index + 1}</Text>
												</Table.Td>
												<Table.Td>
													<TextInput
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
							color="green"
							onClick={() => {
								handleRoutineUpdate(rountineName, exercises);
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
