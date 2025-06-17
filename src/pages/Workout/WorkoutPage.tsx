import { UserAuth } from "@/auth/AuthContext";
import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import styles from "@/hover.module.css";
import { useDisclosure } from "@mantine/hooks";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ChevronDown,
	ChevronUp,
	EllipsisVertical,
	Plus,
	Trash,
	ChevronRight,
} from "lucide-react";
import {
	Avatar,
	Button,
	Card,
	Collapse,
	Container,
	Group,
	Menu,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Paper,
} from "@mantine/core";

const WorkoutPage = () => {
	const [opened, { toggle }] = useDisclosure(false);
	const navigate = useNavigate();
	const { user } = UserAuth();
	const [, setLoading] = useState(true);
	const { workouts, fetchWorkouts, deleteWorkout } = useWorkOutHook();
	const { routines, fetchRoutines } = useRoutinesHook();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await fetchWorkouts();
			await fetchRoutines();
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
			<Stack gap="0">
				<Stack
					gap="md"
					mb="xl"
				>
					<Stack gap={0}>
						<Title order={1}>Home</Title>
					</Stack>
					<Group grow>
						<Button
							color="teal"
							variant="filled"
							leftSection={<Plus size={20} />}
							onClick={() => {
								navigate("/new-workout");
							}}
							style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
						>
							Create Workout
						</Button>

						<Button
							color="teal"
							variant="outline"
							leftSection={<Plus size={20} />}
							onClick={() => {
								navigate("/new-routine");
							}}
							style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
						>
							Create Routine
						</Button>
					</Group>
				</Stack>

				<Stack mb="-10">
					<Group justify="space-between">
						<Group
							mb="0"
							mt="0"
						>
							<Title
								order={3}
								fw={500}
							>
								My Routines
							</Title>
							<Card
								radius="md"
								shadow="md"
								bg="none"
								withBorder
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "25px",
									height: "25px",
								}}
							>
								<Text
									fw={500}
									size="sm"
								>
									{routines.length}
								</Text>
							</Card>
						</Group>
						<Button
							variant="subtle"
							color="gray"
							onClick={toggle}
							px="xs"
							py="xs"
							style={{
								minWidth: 0,
								width: 36,
								height: 36,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							{opened ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
						</Button>
					</Group>

					<Collapse in={opened}>
						<SimpleGrid
							spacing="xs"
							cols={{ base: 1, xs: 1, sm: 1, lg: 1 }}
							mb="xl"
						>
							{routines.map((routine) => (
								<Paper
									p="md"
									key={routine.id}
									withBorder
									radius="md"
									shadow="md"
									bg="dark.9"
								>
									<Stack gap="xs">
										<Group
											gap="xs"
											justify="space-between"
										>
											<Text
												size="md"
												fw={500}
											>
												{routine.name}
											</Text>
											<Paper
												p={5}
												radius="sm"
												c="white"
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/routine-about/${routine.id}`);
												}}
												className={styles.hover}
												style={{
													border:
														"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
												}}
											>
												<ChevronRight size={16} />
											</Paper>
										</Group>
									</Stack>
								</Paper>
							))}
						</SimpleGrid>
					</Collapse>
				</Stack>

				<Stack>
					<Group
						mt="md"
						mb="5"
					>
						<Title
							order={3}
							fw={500}
						>
							My Workouts
						</Title>
						<Card
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
													color="gray"
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
