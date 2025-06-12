import { UserAuth } from "@/auth/AuthContext";
import { getUserWorkoutStats } from "@/common/calculateStats";
import { useMeasurementsHook } from "@/hooks/useMeasurementsHook";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import { Clock, Dumbbell, Plus, Tally5, Trash, Weight } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Avatar,
	Button,
	Container,
	//Divider,
	Group,
	Modal,
	NumberInput,
	Paper,
	SimpleGrid,
	Stack,
	Table,
	Text,
	Title,
	Card,
	Image,
} from "@mantine/core";

const Profile = () => {
	const [, setLoading] = useState(true);
	const [opened, { open, close }] = useDisclosure(false);
	const [weight, setWeight] = useState<string | number>("");
	const [height, setHeight] = useState<string | number>("");
	const [bodyFat, setBodyFat] = useState<string | number>("");
	const [stats, setStats] = useState<{
		totalVolume: number;
		totalSets: number;
		totalWorkouts: number;
		totalDuration: number;
	} | null>(null);

	const { workouts, fetchWorkouts } = useWorkOutHook();
	const {
		measurements,
		fetchMeasurements,
		createMeasurement,
		deleteMeasurement,
	} = useMeasurementsHook();

	const handleMeasurementCreation = async () => {
		await createMeasurement(weight, height, bodyFat);
		setWeight("");
		setHeight("");
		setBodyFat("");
		close();
	};

	useEffect(() => {
		const fetchData = async () => {
			await fetchMeasurements();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

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
				<Card
					//withBorder
					radius="md"
					//align="center"
					//gap="4"
					bg="none"
					p={0}
					//shadow="md"
				>
					<Card.Section>
						<Image
							src="\gym-bg.jpg"
							h={140}
							alt="Gym Background"
						/>
					</Card.Section>
					<Stack
						align="center"
						gap="xs"
						//radius="md"
					>
						<Avatar
							size={60}
							radius={80}
							mx="auto"
							mt={-30}
							src={user?.photoURL}
							alt="User Avatar"
						/>

						{user?.displayName && (
							<Text
								fw={500}
								c="white"
								size="md"
							>
								{user.displayName}
							</Text>
						)}
					</Stack>

					<Title
						c="dimmed"
						order={5}
						fw={400}
						size="sm"
					>
						Career Stats
					</Title>

					<SimpleGrid
						spacing="xs"
						cols={{ base: 1, xs: 2, sm: 2 }}
						mt="lg"
					>
						<Paper
							shadow="md"
							withBorder
							radius="md"
							p="xs"
							bg="none"
						>
							<Group gap="sm">
								<Dumbbell size={30} />
								<Stack
									gap={0}
									align="flex-start"
								>
									<Text
										size="xl"
										fw={700}
									>
										{stats?.totalWorkouts}
									</Text>
									<Text
										c="dimmed"
										size="sm"
									>
										Workouts
									</Text>
								</Stack>
							</Group>
						</Paper>

						<Paper
							shadow="md"
							withBorder
							p="xs"
							radius="md"
							bg="none"
						>
							<Group gap="sm">
								<Tally5 size={30} />
								<Stack
									align="flex-start"
									gap={0}
								>
									<Text
										size="xl"
										fw={700}
									>
										{stats?.totalSets}
									</Text>
									<Text
										c="dimmed"
										size="sm"
									>
										Sets
									</Text>
								</Stack>
							</Group>
						</Paper>

						<Paper
							shadow="md"
							withBorder
							p="xs"
							radius="md"
							bg="none"
						>
							<Group gap="sm">
								<Weight size={30} />
								<Stack
									gap={0}
									align="flex-start"
								>
									<Text
										size="xl"
										fw={700}
									>
										{stats?.totalVolume} kg
									</Text>
									<Text
										c="dimmed"
										size="sm"
									>
										Volume
									</Text>
								</Stack>
							</Group>
						</Paper>

						<Paper
							shadow="md"
							withBorder
							p="xs"
							radius="md"
							bg="none"
						>
							<Group gap="sm">
								<Clock size={30} />
								<Stack
									gap={0}
									align="flex-start"
								>
									<Text
										size="xl"
										fw={700}
									>
										{stats && typeof stats.totalDuration === "number" && (
											<>
												{stats.totalDuration > 60
													? ` ${Math.floor(stats.totalDuration / 60)} mins`
													: `${stats.totalDuration} secs`}{" "}
											</>
										)}
									</Text>
									<Text
										c="dimmed"
										size="sm"
									>
										Time Spent
									</Text>
								</Stack>
							</Group>
						</Paper>
					</SimpleGrid>
				</Card>

				{/* <Divider
					mt="lg"
					mb="xs"
				/> */}

				<Stack>
					<Stack
						align="center"
						mb="sm"
					>
						<Title
							order={3}
							fw={500}
						>
							Measurements
						</Title>
						<Button
							color="teal"
							radius="xs"
							size="sm"
							leftSection={<Plus size={20} />}
							onClick={open}
						>
							Add
						</Button>
					</Stack>

					<Table.ScrollContainer minWidth={200}>
						<Table
							//striped
							//highlightOnHover
							withTableBorder
							withColumnBorders
						>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Date</Table.Th>
									<Table.Th>Weight</Table.Th>
									<Table.Th>Height</Table.Th>
									<Table.Th>BF</Table.Th>

									<Table.Th>&nbsp;</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{measurements.map((measurement) => {
									return (
										<Table.Tr
											key={measurement.id}
											// style={{ cursor: "pointer" }}
										>
											<Table.Td>
												{format(measurement.date.toDate(), "dd/MM/yy")}
											</Table.Td>
											<Table.Td>{measurement.weight}kg</Table.Td>
											<Table.Td>{measurement.height}cm</Table.Td>
											<Table.Td>
												{measurement.bodyFat
													? `${measurement.bodyFat}%`
													: "N/A"}
											</Table.Td>
											<Table.Td className="w-[40px]">
												<Button
													variant="subtle"
													color="red.9"
													onClick={() => deleteMeasurement(measurement.id)}
													p={5}
													size="xs"
												>
													<Trash size={16} />
												</Button>
											</Table.Td>
										</Table.Tr>
									);
								})}
							</Table.Tbody>
						</Table>
					</Table.ScrollContainer>
				</Stack>
			</Stack>

			<Modal
				opened={opened}
				onClose={close}
				title="Add New Measurement"
				centered
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleMeasurementCreation();
					}}
				>
					<Stack gap="sm">
						<NumberInput
							label="Weight (kg)"
							onChange={(val: string | number) => setWeight(val)}
							placeholder="Weight in kg"
							suffix="kg"
							required
							min={0}
						/>

						<NumberInput
							label="Height (cm)"
							onChange={(val: string | number) => setHeight(val)}
							placeholder="Height in cm"
							suffix="cm"
							required
							min={0}
						/>

						<NumberInput
							label="Body Fat (%)"
							onChange={(val: string | number) => setBodyFat(val)}
							placeholder="Body Fat %"
							suffix="%"
						/>
					</Stack>

					<Group
						mt="lg"
						justify="flex-end"
					>
						<Button
							type="submit"
							color="teal"
							disabled={!weight || !height}
						>
							Save Measurement
						</Button>
					</Group>
				</form>
			</Modal>
		</Container>
	);
};

export default Profile;
