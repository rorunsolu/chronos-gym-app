import { UserAuth } from "@/auth/AuthContext";
import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import styles from "@/hover.module.css";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical, Plus, Trash } from "lucide-react";
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

const RoutinePage = () => {
	const navigate = useNavigate();
	const { routines, fetchRoutines, deleteRoutine } = useRoutinesHook();
	const { user } = UserAuth();

	useEffect(() => {
		const fetchData = async () => {
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
			<Stack gap="xl">
				<Stack gap="md">
					<Stack gap={0}>
						<Title order={1}>Routines</Title>
						<Text c="dimmed">View all your routines and create new ones.</Text>
					</Stack>

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
								width: "30px",
								height: "30px",
							}}
						>
							{routines.length}
						</Card>
					</Group>

					<SimpleGrid
						spacing="md"
						cols={{ base: 1, xs: 1, sm: 1, lg: 1 }}
					>
						{routines.map((routine) => (
							<Card
								className={styles.hover}
								key={routine.id}
								withBorder
								radius="md"
								shadow="md"
								onClick={(e) => {
									navigate(`/routine-about/${routine.id}`);
									e.stopPropagation();
								}}
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
												{routine.createdAt
													? formatDistanceToNow(routine.createdAt.toDate(), {
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
													deleteRoutine(routine.id);
												}}
											>
												Delete
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>
								<Stack
									mt="lg"
									gap="xs"
								>
									<Title order={4}>{routine.name}</Title>
									<Stack>
										{routine.notes && <Text size="sm">{routine.notes}</Text>}
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
