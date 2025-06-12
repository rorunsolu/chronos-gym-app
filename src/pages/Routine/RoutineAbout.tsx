import { UserAuth } from "@/auth/AuthContext";
import { db } from "@/auth/Firebase";
import { getSessionStats } from "@/common/singleSessionStats";
import { format } from "date-fns";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
	Avatar,
} from "@mantine/core";
import { type ExerciseData } from "@/common/types";

const RoutineAbout = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [routineName, setRoutineName] = useState<string>("");
	const [exercises, setExercises] = useState<ExerciseData[]>([]);
	const [notes, setNotes] = useState<string>("");
	const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [, setIsLoading] = useState(true);
	const { user } = UserAuth();
	const [stats, setStats] = useState<{
		totalVolume: number;
		totalSets: number;
		totalExercises: number;
	} | null>(null);
	const [date, setDate] = useState<Timestamp | undefined>();

	useEffect(() => {
		const fetchRoutineData = async () => {
			try {
				if (!id) {
					throw new Error("Could not find routine ID");
				}

				if (!user) {
					throw new Error("User not authenticated");
				}

				const routineRef = doc(db, "routines", id);
				const routineSnapshot = await getDoc(routineRef);

				if (!routineSnapshot.exists()) {
					throw new Error("Routine snapshot not found");
				}

				const routineData = routineSnapshot.data();

				setRoutineName(routineData.name || "");
				setExercises(routineData.exercises || []);
				setNotes(routineData.notes || "");
				setTotalElapsedTime(routineData.totalElapsedTimeSec || 0);
				setDate(routineData.createdAt);
			} catch (error) {
				setErrorMessage("Error fetching routine data. Please try again later.");
				setIsLoading(false);
				navigate("/");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRoutineData();
	}, [id, user, navigate]);

	useEffect(() => {
		if (exercises.length > 0) {
			const calculatedStats = getSessionStats(exercises);
			setStats(calculatedStats);
		}
	}, [exercises]);

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
					<Title order={3}>{routineName}</Title>
					<Stack
						gap="sm"
						mt="sm"
					>
						<Group gap="xs">
							<Avatar
								size="md"
								radius="xl"
								src={user?.photoURL}
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
							{stats?.totalVolume !== undefined && (
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
							{stats?.totalExercises !== undefined && (
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
										<Text size="sm">{stats.totalExercises}</Text>
									</Stack>
								</Group>
							)}
							{stats?.totalSets !== undefined && (
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
										<Text size="sm">{stats.totalSets}</Text>
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

				<Button
					fullWidth
					size="sm"
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

				<Divider
					label="Exercises"
					labelPosition="center"
				/>

				<Stack gap="lg">
					{exercises.map((exercise) => (
						<Paper
							key={exercise.id}
							bg="transparent"
						>
							<Stack gap="md">
								<Stack gap={3}>
									<Text fw={500}>{exercise.name}</Text>
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
								<Table
									withTableBorder
									withColumnBorders
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

export default RoutineAbout;
