import { UserAuth } from "@/auth/AuthContext";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import styles from "@/hover.module.css";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
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
	const [, setLoading] = useState(true);
	const { workouts, fetchWorkouts, deleteWorkout } = useWorkOutHook();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
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
				<Stack gap="md">
					<Stack gap={0}>
						<Title order={1}>Workouts</Title>
						<Text c="dimmed">
							View all of your routines and create new ones.
						</Text>
					</Stack>

					<Button
						color="teal"
						variant="filled"
						leftSection={<Plus size={20} />}
						onClick={() => {
							navigate("/new-workout");
						}}
						style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
					>
						New Workout
					</Button>
				</Stack>

				<Stack>
					<Group
						mb="0"
						mt="0"
					>
						<Title
							order={3}
							fw={500}
						>
							My Workouts
						</Title>
						<Card
							//className={styles.hover}
							radius="md"
							shadow="md"
							bg="none"
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
									onClick={(e) => {
										navigate(`/workout-about/${workout.id}`);
										e.stopPropagation();
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
													px="5"
													py="0"
													variant="subtle"
													color="white"
													onClick={(e) => {
														e.stopPropagation();
													}}
												>
													<EllipsisVertical size={16} />
												</Button>
											</Menu.Target>
											<Menu.Dropdown bg="dark.9">
												<Menu.Item
													color="red"
													leftSection={<Trash size={14} />}
													className={styles.hover}
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
										mt="sm"
										gap="xs"
									>
										<Stack>
											<Stack gap={4}>
												<Title order={4}>{workout.name}</Title>
												{workout.notes && (
													<Text size="sm">{workout.notes}</Text>
												)}
											</Stack>

											<Group>
												{workout.stats.totalVolume && (
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
															<Text size="sm">
																{workout.stats.totalVolume}kg
															</Text>
														</Stack>
													</Group>
												)}

												{workout.stats.totalExercises && (
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
															<Text size="sm">
																{workout.stats.totalExercises || 0}
															</Text>
														</Stack>
													</Group>
												)}

												{workout.stats.totalSets && (
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
															<Text size="sm">
																{workout.stats.totalSets || 0}
															</Text>
														</Stack>
													</Group>
												)}
											</Group>

											<Stack gap="xs">
												{workout.exercises
													.slice(0, 3)
													.map((exercise, index) => (
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
										</Stack>
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
