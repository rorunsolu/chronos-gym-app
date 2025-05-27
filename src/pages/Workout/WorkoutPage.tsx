import { UserAuth } from "@/auth/AuthContext";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical, Eye, Plus, Search, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Container,
	Group,
	Stack,
	Text,
	Title,
	SimpleGrid,
	Card,
	Menu,
	Avatar,
} from "@mantine/core";

const WorkoutPage = () => {
	const navigate = useNavigate();
	const { user } = UserAuth();
	const { workouts, fetchWorkouts, deleteWorkout } = useWorkOutHook();

	useEffect(() => {
		const fetchData = async () => {
			await fetchWorkouts();
		};

		fetchData();
	}, []);

	return (
		<Container
			size="md"
			p="xs"
			py="md"
		>
			<Stack gap="xl">
				<Stack gap="xl">
					<Stack gap={0}>
						<Title order={1}>Workouts</Title>
						<Text c="dimmed">
							View all of your routines and create new ones.
						</Text>
					</Stack>

					<SimpleGrid
						spacing="md"
						cols={{ base: 1, xs: 2, sm: 2, lg: 2 }}
					>
						<Button
							color="teal"
							variant="filled"
							leftSection={<Plus size={20} />}
							onClick={() => {
								navigate("/new-routine");
							}}
							style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
						>
							New Workout
						</Button>
						<Button
							color="teal"
							variant="light"
							leftSection={<Search size={20} />}
							onClick={() => {
								navigate("/explore");
							}}
							style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
						>
							Explore
						</Button>
					</SimpleGrid>
				</Stack>

				<Stack>
					<Group
						mb="xs"
						mt="xs"
					>
						<Title order={3}>My Workouts</Title>
						<Card
							radius="md"
							shadow="md"
							bg="dark.9"
							withBorder
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: "30px",
								height: "30px",
							}}
						>
							{workouts.length}
						</Card>
					</Group>

					<SimpleGrid
						spacing="md"
						cols={{ base: 1, sm: 2, lg: 2 }}
					>
						{workouts.map((workout) => {
							return (
								<Card
									key={workout.id}
									withBorder
									radius="md"
									shadow="md"
									bg="dark.9"
									onClick={() => {
										navigate(`/workout/${workout.id}`, {
											state: { workout },
										});
									}}
									className="cursor-pointer"
								>
									<Group justify="space-between">
										<Group>
											<Avatar
												src={
													user?.photoURL ??
													"https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
												}
												radius="xl"
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
													{workout.dateOfWorkout
														? formatDistanceToNow(
																workout.dateOfWorkout.toDate(),
																{
																	addSuffix: true,
																}
															)
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
											<Menu.Dropdown>
												<Menu.Item
													color="red"
													leftSection={<Trash size={14} />}
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
										mb="lg"
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
									<Stack>
										<Button
											fullWidth
											variant="filled"
											color="teal"
											leftSection={<Eye size={20} />}
											aria-label="Start Workout"
											onClick={() => {
												navigate(`/workouts/${workout.id}`);
											}}
										>
											View Workout
										</Button>
									</Stack>
								</Card>
							);
						})}
					</SimpleGrid>
				</Stack>
			</Stack>
		</Container>
	);
};

export default WorkoutPage;
