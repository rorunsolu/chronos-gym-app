import { UserAuth } from "@/auth/AuthContext";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import styles from "@/hover.module.css";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Card,
	Text,
	Group,
	Avatar,
	Menu,
	Button,
	Stack,
	Container,
	SimpleGrid,
	Title,
} from "@mantine/core";

const Home = () => {
	const { workouts, fetchWorkouts, deleteWorkout } = useWorkOutHook();
	const { user } = UserAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			await fetchWorkouts();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

	return (
		<Container
			size="xs"
			p="md"
			py="md"
		>
			<Stack gap="xl">
				<Stack gap="xs">
					{/* <Title order={1}>Your Workouts</Title>
					<Text c="dimmed">
						View your recent workouts below. Click on a workout to see details,
						or use the menu to delete a workout.
					</Text> */}
				</Stack>

				<SimpleGrid
					spacing="md"
					cols={{ base: 1, xs: 1, sm: 1, lg: 1 }}
				>
					{workouts.map((workout) => {
						return (
							<Card
								className={styles.hover}
								key={workout.id}
								withBorder
								radius="md"
								shadow="md"
								bg="dark.8"
								onClick={() => {
									navigate(`/workout-about/${workout.id}`, {
										state: { workout },
									});
								}}
							>
								<Group justify="space-between">
									<Group>
										<Avatar
											src={
												user?.photoURL ??
												"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
											}
											radius="xl"
											bg="dark.9"
										/>
										<div>
											<Text
												size="sm"
												fw={500}
											>
												{user?.displayName}
											</Text>
											<Text
												size="xs"
												c="dimmed"
											>
												{workout.createdAt
													? formatDistanceToNow(workout.createdAt.toDate(), {
															addSuffix: true,
														})
													: "Unknown Date"}
											</Text>
										</div>
									</Group>
									<Menu
										withinPortal
										position="bottom-end"
										shadow="md"
									>
										<Menu.Target>
											<Button
												p="xs"
												variant="outline"
												color="white"
												onClick={(e) => {
													e.stopPropagation();
												}}
												className="flex items-center justify-center"
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
												c="red"
												onClick={(e) => {
													e.stopPropagation();
													deleteWorkout(workout.id);
												}}
											>
												Delete
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>

								<Stack
									mt="lg"
									gap={8}
								>
									<Title
										order={4}
										mb="xs"
									>
										{workout.name}
									</Title>
									{workout.notes && <Text size="sm">{workout.notes}</Text>}

									{workout.exercises.slice(0, 3).map((exercise, index) => (
										<Group
											gap="xs"
											key={index}
										>
											<div
												className="flex items-center justify-center w-6 h-6 rounded-md"
												style={{
													border:
														"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
												}}
											>
												<Text size="sm">{index + 1}</Text>
											</div>
											<Text size="sm">{exercise.name}</Text>
										</Group>
									))}
								</Stack>
							</Card>
						);
					})}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Home;
