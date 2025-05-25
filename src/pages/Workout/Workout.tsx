import { useRoutinesHook } from "@/hooks/useRoutinesHook";
import { formatDistanceToNow } from "date-fns";
import { Play, Plus, Search } from "lucide-react";
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
	ActionIcon,
} from "@mantine/core";

const Workout = () => {
	const navigate = useNavigate();
	const { routines, fetchRoutines } = useRoutinesHook();

	useEffect(() => {
		const fetchData = async () => {
			await fetchRoutines();
		};

		fetchData();
	}, []);

	return (
		<Container
			size="md"
			py="xs"
		>
			<Stack gap="xl">
				<Stack gap="xl">
					<Stack gap="xs">
						<Title order={1}>Quick Start</Title>
						<Text c="dimmed">
							Welcome to your workout dashboard. Here you can start a new
							workout or manage your routines.
						</Text>
					</Stack>

					<Group grow>
						<Button
							color="teal"
							variant="outline"
							leftSection={<Plus size={20} />}
							onClick={() => {
								navigate("/workout-in-progress");
							}}
							style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
						>
							Start Empty Workout
						</Button>
						<Button
							color="teal"
							leftSection={<Plus size={20} />}
							onClick={() => {
								navigate("/routines");
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
					</Group>
				</Stack>

				<Stack>
					<Group>
						<Title order={3}>My Routines</Title>
						<Card
							radius="md"
							shadow="xs"
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
							{routines.length}
						</Card>
					</Group>

					<SimpleGrid cols={3}>
						{routines.map((routine, index) => (
							<Card
								key={index}
								shadow="xs"
								padding="lg"
								radius="md"
								bg="dark.9"
								withBorder
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Stack gap="xs">
									<Text fw={500}>{routine.name}</Text>
									<Text size="sm">
										{routine.createdAt
											? formatDistanceToNow(routine.createdAt.toDate(), {
													addSuffix: true,
												})
											: "Unknown Date"}
									</Text>
								</Stack>

								<ActionIcon
									color="teal"
									variant="filled"
									size={40}
									aria-label="Start Workout"
									onClick={() => {
										navigate(`/routines/${routine.id}`);
									}}
								>
									<Play size={24} />
								</ActionIcon>
							</Card>
						))}
					</SimpleGrid>
				</Stack>
			</Stack>
		</Container>
	);
};

export default Workout;
