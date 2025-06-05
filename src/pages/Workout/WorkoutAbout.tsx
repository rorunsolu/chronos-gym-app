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
	Divider,
	Title,
	Textarea,
} from "@mantine/core";

import type { SessionData, ExerciseData } from "@/common/types";

const WorkoutAbout = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [workoutName, setWorkoutName] = useState<string>("");
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [notes, setNotes] = useState<string>("");
	const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [, setIsLoading] = useState(true);
	const { user } = UserAuth();

	useEffect(() => {
		const fetchWorkoutData = async () => {
			try {
				if (!id) {
					throw new Error("Could not find workout ID");
				}

				if (!user) {
					throw new Error("User not authenticated");
				}

				const workoutRef = doc(db, "workouts", id);
				const workoutSnapshot = await getDoc(workoutRef);

				if (!workoutSnapshot.exists()) {
					throw new Error("Workout snapshot not found");
				}

				const workoutData = workoutSnapshot.data() as SessionData;

				setWorkoutName(workoutData.name || "");
				setExercises(workoutData.exercises || []);
				setNotes(workoutData.notes || "");
				setTotalElapsedTime(workoutData.totalElapsedTimeSec || 0);
			} catch (error) {
				setErrorMessage("Error fetching workout data. Please try again later.");
				setIsLoading(false);
				navigate("/");
			} finally {
				setIsLoading(false);
			}
		};

		fetchWorkoutData();
	}, [id, user, navigate]);

	return (
		<Container
			size="md"
			py="lg"
		>
			<Stack gap="md">
				{errorMessage && (
					<Text
						size="sm"
						c="red"
					>
						{errorMessage}
					</Text>
				)}

				<Stack gap={0}>
					<Title order={2}>{workoutName}</Title>
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
					aria-label="Start workout"
					leftSection={<Play size={20} />}
					onClick={() => {
						navigate(`/workouts/${id}`);
					}}
				>
					Start Workout
				</Button>

				<Divider
					label="Exercises"
					labelPosition="center"
				/>

				<Stack gap="lg">
					{exercises.map((exercise) => (
						<>
							<Paper
								key={exercise.id}
								bg="transparent"
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
										{exercise.notes && (
											<Group>
												<Textarea
													autosize
													minRows={1}
													maxRows={4}
													variant="unstyled"
													value={exercise.notes}
													readOnly
													prefix="Notes: "
												/>
											</Group>
										)}
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

				{notes && (
					<Paper
						mt="lg"
						p="md"
					>
						<Text
							size="sm"
							c="dimmed"
						>
							Notes: {notes}
						</Text>
					</Paper>
				)}

				<Text
					size="sm"
					c="dimmed"
				>
					{totalElapsedTime > 60
						? `Total Time: ${Math.floor(totalElapsedTime / 60)} minutes`
						: `Total Time: ${totalElapsedTime} seconds`}
				</Text>
			</Stack>
		</Container>
	);
};

export default WorkoutAbout;
