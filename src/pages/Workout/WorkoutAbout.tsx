import { UserAuth } from "@/auth/AuthContext";
import { db } from "@/auth/Firebase";
import { getSessionStats } from "@/common/singleSessionStats";
import { format } from "date-fns";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
	Container,
	Stack,
	Text,
	Paper,
	Group,
	Table,
	Divider,
	Title,
	Avatar,
} from "@mantine/core";

import type { SessionData, ExerciseData } from "@/common/types";

const WorkoutAbout = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [workoutName, setWorkoutName] = useState<string>("");

	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [notes, setNotes] = useState<string>("");
	const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
	const [date, setDate] = useState<Timestamp>();
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [, setIsLoading] = useState(true);
	const { user } = UserAuth();
	const [stats, setStats] = useState<{
		totalVolume: number;
		totalSets: number;
		totalExercises: number;
	} | null>(null);

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
				setDate(workoutData.createdAt);
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

	useEffect(() => {
		const loadStats = async () => {
			if (exercises.length > 0) {
				const calculatedStats = getSessionStats(exercises);
				setStats(calculatedStats);
			}
		};
		loadStats();
	}, [exercises]);

	// Todo: Add stats fior time, volume, sets, reps etc

	return (
		<Container
			size="xs"
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

				<Stack gap={3}>
					<Title order={3}>{workoutName}</Title>

					<Stack
						gap="sm"
						mt="sm"
					>
						<Group gap="xs">
							<Avatar
								size="md"
								radius="xl"
								src={user?.photoURL ? user.photoURL : "p.png"}
								alt="User Avatar"
							/>
							<Stack gap={3}>
								<Text size="sm">{user?.displayName || "Anonymous"}</Text>
								<Text
									size="xs"
									c="dimmed"
								>
									{date ? format(date.toDate(), "PPP") : "Unknown Date"}
								</Text>
							</Stack>
						</Group>

						<Group>
							{stats?.totalVolume && (
								<Group gap="sm">
									<Stack
										gap={0}
										align="flex-start"
									>
										<Text
											size="sm"
											fw={500}
											c="dimmed"
										>
											Volume
										</Text>
										<Text size="sm">{stats.totalVolume}kg</Text>
									</Stack>
								</Group>
							)}

							{stats?.totalExercises && (
								<Group gap="sm">
									<Stack
										gap={0}
										align="flex-start"
									>
										<Text
											size="sm"
											fw={500}
											c="dimmed"
										>
											Exercises
										</Text>
										<Text size="sm">{stats?.totalExercises || 0}</Text>
									</Stack>
								</Group>
							)}

							{stats?.totalSets && (
								<Group gap="sm">
									<Stack
										gap={0}
										align="flex-start"
									>
										<Text
											size="sm"
											fw={500}
											c="dimmed"
										>
											Sets
										</Text>
										<Text size="sm">{stats?.totalSets || 0}</Text>
									</Stack>
								</Group>
							)}
						</Group>
					</Stack>

					{notes && (
						<Stack
							gap={0}
							mt={5}
						>
							<Text
								size="sm"
								c="dimmed"
								fw={500}
							>
								Description
							</Text>

							<Text size="sm">{notes}</Text>
						</Stack>
					)}
				</Stack>

				<Divider
					label="Exercises"
					labelPosition="center"
				/>

				<Stack gap="xl">
					{exercises.map((exercise) => (
						<Paper
							key={exercise.id}
							bg="transparent"
						>
							<Stack gap="md">
								<Stack gap="3">
									<Text
										fw={500}
										onClick={() => {
											navigate(`/exercise-about/${exercise.mappedId}`);
										}}
										style={{ cursor: "pointer" }}
									>
										{exercise.name}
									</Text>

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
										<Group gap={5}>
											<Text
												size="sm"
												c="dimmed"
											>
												{exercise.notes}
											</Text>
										</Group>
									)}
								</Stack>

								<Table striped>
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
					))}
				</Stack>

				<Text
					size="sm"
					c="dimmed"
					mt={10}
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
