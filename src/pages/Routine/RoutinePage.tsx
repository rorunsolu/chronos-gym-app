import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import styles from "@/hover.module.css";
import { EllipsisVertical, Info, Plus, Trash } from "lucide-react";
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

					<SimpleGrid
						spacing="md"
						cols={{ base: 1, xs: 1, sm: 1, lg: 1 }}
					>
						{routines.map((routine) => (
							<Card
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
										<Title order={4}>{routine.name}</Title>{" "}
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

									{routine.notes && (
										<Text
											size="sm"
											mt="-5"
										>
											{routine.notes}
										</Text>
									)}
								</Stack>

								<Button
									color="teal"
									variant="light"
									fullWidth
									mt="md"
									onClick={(e) => {
										e.stopPropagation();
										navigate(`/routine-about/${routine.id}`);
									}}
									leftSection={<Info size={20} />}
								>
									More Details
								</Button>
							</Card>
						))}
					</SimpleGrid>
				</Stack>
			</Stack>
		</Container>
	);
};

export default RoutinePage;
