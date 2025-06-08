import { UserAuth } from "@/auth/AuthContext";
import { getUserWorkoutStats } from "@/common/calculateStats";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import { Dumbbell, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Avatar,
	Button,
	Container,
	Group,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Paper,
} from "@mantine/core";

const Profile = () => {
	const navigate = useNavigate();

	const { workouts, fetchWorkouts } = useWorkOutHook();
	const [, setLoading] = useState(true);
	const [stats, setStats] = useState<{
		totalVolume: number;
		totalSets: number;
		totalWorkouts: number;
		totalDuration: number;
	} | null>(null);

	useEffect(() => {
		const loadStats = async () => {
			setLoading(true);
			await fetchWorkouts();
			const calculated = getUserWorkoutStats(workouts);
			setStats(calculated);
			setLoading(false);
		};

		loadStats();
	}, [fetchWorkouts, workouts]);

	const { user } = UserAuth();

	return (
		<Container
			size="sm"
			p="md"
			py="md"
		>
			<Stack gap="lg">
				<Group justify="apart">
					<Group>
						<Avatar
							size="lg"
							radius="xl"
							src={user?.photoURL}
							alt="User Avatar"
						/>

						{user?.displayName && (
							<Text
								fw={700}
								size="md"
							>
								{user.displayName}
							</Text>
						)}
					</Group>
				</Group>

				<SimpleGrid
					spacing="md"
					cols={{ base: 1, sm: 2, lg: 2 }}
				>
					<Paper
						shadow="md"
						withBorder
						p="xs"
					>
						<Stack gap={0}>
							<Text
								size="xl"
								fw={500}
							>
								{stats?.totalWorkouts}
							</Text>
							<Text
								c="dimmed"
								size="sm"
							>
								All time workouts
							</Text>
						</Stack>
					</Paper>

					<Paper
						shadow="md"
						withBorder
						p="xs"
					>
						<Stack gap={0}>
							<Text
								size="xl"
								fw={500}
							>
								{stats?.totalSets}
							</Text>
							<Text
								c="dimmed"
								size="sm"
							>
								Total sets completed
							</Text>
						</Stack>
					</Paper>

					<Paper
						shadow="md"
						withBorder
						p="xs"
					>
						<Stack gap={0}>
							<Text
								size="xl"
								fw={500}
							>
								{stats?.totalVolume} kg
							</Text>
							<Text
								c="dimmed"
								size="sm"
							>
								Total volume lifted
							</Text>
						</Stack>
					</Paper>
					<Paper
						shadow="md"
						withBorder
						p="xs"
					>
						<Stack gap={0}>
							<Text
								size="xl"
								fw={500}
							>
								{stats && typeof stats.totalDuration === "number" && (
									<>
										{stats.totalDuration > 60
											? `Total Time: ${Math.floor(stats.totalDuration / 60)} minutes`
											: `Total Time: ${stats.totalDuration} seconds`}{" "}
									</>
								)}
							</Text>
							<Text
								c="dimmed"
								size="sm"
							>
								Total time spent working out
							</Text>
						</Stack>
					</Paper>
				</SimpleGrid>

				<Title
					order={5}
					mt="lg"
				>
					Dashboard
				</Title>
				<SimpleGrid
					spacing="md"
					cols={{ base: 1, sm: 2, lg: 2 }}
				>
					<Button
						leftSection={<Dumbbell size={18} />}
						variant="default"
						fullWidth
						onClick={() => navigate("/exercise-page")}
					>
						Exercises
					</Button>
					<Button
						leftSection={<Ruler size={18} />}
						variant="default"
						fullWidth
						onClick={() => navigate("/measurement-page")}
					>
						Measurements
					</Button>
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Profile;
