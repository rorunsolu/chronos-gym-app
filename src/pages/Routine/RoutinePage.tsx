import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical, Play, Plus, Search, Trash } from "lucide-react";
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
} from "@mantine/core";

const RoutinePage = () => {
	const navigate = useNavigate();
	const { routines, fetchRoutines, deleteRoutine } = useRoutinesHook();

	useEffect(() => {
		const fetchData = async () => {
			await fetchRoutines();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

	return (
		<Container
			size="md"
			p="md"
			py="md"
		>
			<Stack gap="xl">
				<Stack gap="xl">
					<Stack gap={0}>
						<Title order={1}>Routines</Title>
						<Text c="dimmed">View all your routines and create new ones.</Text>
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
							New Routine
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
						<Title order={3}>My Routines</Title>
						<Card
							radius="md"
							shadow="md"
							bg="dark.8"
							withBorder
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: "30px",
								height: "30px",
							}}
						>
							{routines.length}
						</Card>
					</Group>

					<SimpleGrid
						spacing="md"
						cols={{ base: 1, xs: 2, sm: 2, lg: 2 }}
					>
						{routines.map((routine, index) => (
							<Card
								key={index}
								shadow="md"
								padding="sm"
								radius="md"
								bg="dark.8"
								withBorder
								onClick={() => {
									navigate(`/routine-about/${routine.id}`);
								}}
							>
								<Stack
									justify="space-between"
									style={{ flex: 1 }}
								>
									<Group
										justify="space-between"
										align="top"
									>
										<Stack gap={8}>
											<Title order={4}>{routine.name}</Title>
											<Text
												size="sm"
												mb="sm"
											>
												{routine.createdAt
													? formatDistanceToNow(routine.createdAt.toDate(), {
															addSuffix: true,
														})
													: "Unknown Date"}
											</Text>

											{routine.exercises.slice(0, 3).map((exercise, index) => (
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
														deleteRoutine(routine.id);
													}}
												>
													Delete
												</Menu.Item>
											</Menu.Dropdown>
										</Menu>
									</Group>

									<div className="flex flex-col lg:flex-row gap-4 w-full">
										{/* <Button
											fullWidth
											variant="filled"
											color="teal"
											leftSection={<Play size={20} />}
											aria-label="View routine"
											onClick={() => {
												navigate(`/routine-about/${routine.id}`);
											}}
										>
											View Routine
										</Button> */}
										<Button
											fullWidth
											variant="filled"
											color="teal"
											leftSection={<Play size={20} />}
											aria-label="Start routine"
											onClick={() => {
												navigate(`/routines/${routine.id}`);
											}}
										>
											Start
										</Button>
									</div>
								</Stack>
							</Card>
						))}
					</SimpleGrid>
				</Stack>
			</Stack>
		</Container>
	);
};

export default RoutinePage;
