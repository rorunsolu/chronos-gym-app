import styles from "@/accordion.module.css";
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
	Group,
	Modal,
	NumberInput,
	Stack,
	Table,
	Text,
	Title,
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

	const { user } = UserAuth();
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

	const statCards = [
		{
			icon: (
				<Dumbbell
					size={20}
					color="#fff"
				/>
			),
			value: stats?.totalWorkouts,
			title: "Workouts",
			description: "Total number of workouts completed.",
		},
		{
			icon: (
				<Tally5
					size={20}
					color="#fff"
				/>
			),
			value: stats?.totalSets,
			title: "Sets",
			description: "Total sets performed.",
		},
		{
			icon: (
				<Weight
					size={20}
					color="#fff"
				/>
			),
			value: stats?.totalVolume,
			unit: "kg",
			title: "Volume",
			description: "Total weight lifted.",
		},
		{
			icon: (
				<Clock
					size={20}
					color="#fff"
				/>
			),
			value:
				stats && typeof stats.totalDuration === "number"
					? stats.totalDuration > 60
						? ` ${Math.floor(stats.totalDuration / 60)} mins`
						: `${stats.totalDuration} secs`
					: "-",
			title: "Time Spent",
			description: "Total time spent working out.",
		},
	];

	return (
		<Container
			size="xs"
			p="sm"
			py="md"
		>
			<Title order={1}>My Profile</Title>
			<Stack
				gap="lg"
				mt="md"
			>
				<Stack
					gap="sm"
					p="md"
					className={styles.item}
				>
					<Group
						justify="flex-start"
						gap="xs"
						mb="xs"
					>
						<Avatar
							size={40}
							radius={80}
							src={user?.photoURL ? user.photoURL : "p.png"}
							alt="User Avatar"
							bg="dark.9"
						/>

						{user?.displayName && (
							<Text
								fw={500}
								c="white"
								size="sm"
							>
								{user.displayName}
							</Text>
						)}
					</Group>

					<Stack gap="sm">
						{statCards.map((stat, index) => (
							<Group key={index}>
								<Group>
									{stat.icon}
									<Stack gap={0}>
										<Text
											c="gray.4"
											size="xs"
										>
											{stat.description}
										</Text>
										<Text
											size="lg"
											fw={600}
											c="#fff"
										>
											{stat.value}
											{stat.unit ? ` ${stat.unit}` : ""}
										</Text>
									</Stack>
								</Group>
							</Group>
						))}
					</Stack>
				</Stack>

				<Stack
					p="0"
					mt="sm"
				>
					<Group
						align="center"
						mb="5"
						justify="space-between"
					>
						<Text
							fw={500}
							c="white"
							size="md"
						>
							Measurements
						</Text>
						<Button
							variant="filled"
							color="teal"
							radius="xs"
							size="sm"
							leftSection={<Plus size={20} />}
							onClick={open}
						>
							Add
						</Button>
					</Group>

					<Table.ScrollContainer minWidth={200}>
						<Table striped>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>
										<Text
											size="sm"
											fw={500}
											c="white"
										>
											Date
										</Text>
									</Table.Th>
									<Table.Th>
										<Text
											size="sm"
											fw={500}
											c="white"
										>
											Weight
										</Text>
									</Table.Th>
									<Table.Th>
										<Text
											size="sm"
											fw={500}
											c="white"
										>
											Height
										</Text>
									</Table.Th>
									<Table.Th>
										<Text
											size="sm"
											fw={500}
											c="white"
										>
											BF
										</Text>
									</Table.Th>
									<Table.Th>&nbsp;</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{measurements.map((measurement) => {
									return (
										<Table.Tr key={measurement.id}>
											<Table.Td c="white">
												{format(measurement.date.toDate(), "dd/MM/yy")}
											</Table.Td>
											<Table.Td c="white">{measurement.weight}kg</Table.Td>
											<Table.Td c="white">{measurement.height}cm</Table.Td>
											<Table.Td c="white">
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
