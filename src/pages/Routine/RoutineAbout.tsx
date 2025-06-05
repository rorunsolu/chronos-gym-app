import { UserAuth } from "@/auth/AuthContext";
import { db } from "@/auth/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Play,
	//Timer
} from "lucide-react";
import {
	Container,
	Stack,
	Text,
	Button,
	Paper,
	Group,
	Table,
	//SegmentedControl,
	Divider,
	Title,
	Textarea,
} from "@mantine/core";
import { type ExerciseData } from "@/common/types";

const RoutineAbout = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [routineName, setRoutineName] = useState<string>("");
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [, setIsLoading] = useState(true);
	const { user } = UserAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!id) {
					new Error("Could not find routine ID");
					setIsLoading(false);
					navigate("/");
					return;
				}

				if (!user) {
					new Error("User not authenticated");
					setIsLoading(false);
					navigate("/");
					return;
				}

				const objectRef = doc(db, "routines", id);
				const objectSnapshot = await getDoc(objectRef);

				if (!objectSnapshot.exists()) {
					throw new Error("Routine snapshot not found");
				}

				const objectData = objectSnapshot.data();

				if (!objectData) {
					throw new Error("Routine data not found");
				}

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
	}, [id, user, navigate]);

	return (
		<Container
			size="md"
			py="lg"
		>
			<Stack gap="md">
				<Stack gap={0}>
					<Title order={2}>{routineName}</Title>
					<Text
						size="sm"
						c="dimmed"
					>
						Created by {user?.displayName || "Anonymous"}
					</Text>
				</Stack>

				<Button
					fullWidth
					size="md"
					variant="filled"
					color="teal"
					aria-label="Start routine"
					leftSection={<Play size={20} />}
					onClick={() => {
						navigate(`/routines/${id}`);
					}}
				>
					Start Routine
				</Button>

				{/* <Card
					withBorder
					padding="xl"
					radius="md"
					mt="md"
				>
					<Stack
						gap="xs"
						align="center"
					>
						<Text
							size="sm"
							c="dimmed"
						>
							No data yet
						</Text>
						<SegmentedControl
							fullWidth
							data={["Volume", "Reps", "Duration"]}
							defaultValue="Volume"
							color="blue"
						/>
					</Stack>
				</Card> */}

				<Divider
					label="Exercises"
					labelPosition="center"
				/>

				<Stack gap="lg">
					{exercises.map((exercise) => (
						<>
							{" "}
							<Paper
								key={exercise.id}
								bg="transparent"
								// my="xs"
							>
								<Stack gap="xs">
									<Stack gap="xs">
										<Group justify="space-between">
											<Text fw={500}>{exercise.name}</Text>
										</Group>
										{/* <Group
											gap={0}
											align="center"
										>
											<Timer size={16} />
											<Text
												size="sm"
												c="dimmed"
												ml={6}
											>
												Rest Timer:
												
											</Text>
										</Group> */}
										<Group>
											{exercise.notes && (
												<Textarea
													autosize
													minRows={1}
													maxRows={4}
													variant="unstyled"
													value={exercise.notes}
												/>
											)}
										</Group>
									</Stack>

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
											{exercise.sets.map((set, index) => (
												<Table.Tr key={set.id}>
													<Table.Td>{index + 1}</Table.Td>
													<Table.Td>{set.weight}</Table.Td>
													<Table.Td>{set.reps}</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
								</Stack>
							</Paper>
							<Divider />
						</>
					))}
				</Stack>
			</Stack>
		</Container>
	);
};

export default RoutineAbout;
