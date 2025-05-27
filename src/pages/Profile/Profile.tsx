import { UserAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Avatar,
	Button,
	Container,
	Group,
	Menu,
	SegmentedControl,
	SimpleGrid,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import {
	Dumbbell,
	//TrendingUpDown,
	ChevronDown,
	//Calendar,
	Ruler,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ date: "Feb 24", value: 2.3 },
	{ date: "Mar 10", value: 4.1 },
	{ date: "Mar 24", value: 4 },
	{ date: "Apr 7", value: 4.3 },
	{ date: "Apr 21", value: 1.1 },
	{ date: "May 5", value: 4.8 },
	{ date: "May 12", value: 3.7 },
];

const Profile = () => {
	const [timeRange, setTimeRange] = useState("3m");
	const [metric, setMetric] = useState("duration");
	const navigate = useNavigate();

	const timeRangeLabel = {
		"3m": "Last 3 months",
		"1y": "Year",
		all: "All time",
	};

	const { user } = UserAuth();

	return (
		<Container
			size="xs"
			p="xs"
			py="md"
		>
			<Stack gap="lg">
				<Group justify="apart">
					<Group>
						<Avatar
							size="lg"
							radius="xl"
							src={user?.photoURL}
							alt="User Avatar"
						/>
						<div>
							<Text
								fw={700}
								size="md"
							>
								rorunsolu1
							</Text>
							<Text
								size="sm"
								c="dimmed"
							>
								Workouts: <strong>183</strong>
							</Text>
						</div>
					</Group>
				</Group>

				<Group justify="apart">
					<Text
						size="lg"
						fw={500}
					>
						4 hours{" "}
						<Text
							span
							size="sm"
							c="dimmed"
						>
							this week
						</Text>
					</Text>
					<Menu withinPortal>
						<Menu.Target>
							<Button
								variant="subtle"
								rightSection={<ChevronDown size={14} />}
							>
								{timeRangeLabel[timeRange as keyof typeof timeRangeLabel]}
							</Button>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item onClick={() => setTimeRange("3m")}>
								Last 3 months
							</Menu.Item>
							<Menu.Item onClick={() => setTimeRange("1y")}>Year</Menu.Item>
							<Menu.Item onClick={() => setTimeRange("all")}>
								All time
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>

				<ResponsiveContainer
					width="100%"
					height={200}
				>
					<BarChart data={data}>
						<XAxis
							dataKey="date"
							stroke="#8884d8"
						/>
						<YAxis />
						<Tooltip />
						<Bar
							dataKey="value"
							fill="#228be6"
							radius={[6, 6, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>

				<SegmentedControl
					fullWidth
					value={metric}
					onChange={setMetric}
					data={[
						{ label: "Duration", value: "duration" },
						{ label: "Volume", value: "volume" },
						{ label: "Reps", value: "reps" },
					]}
				/>

				<Title
					order={5}
					mt="lg"
				>
					Dashboard
				</Title>
				<SimpleGrid
					spacing="md"
					cols={{ base: 1, sm: 2, lg: 2 }}
				>
					{/* <Button
						leftSection={<TrendingUpDown size={18} />}
						variant="default"
						fullWidth
					>
						Statistics
					</Button> */}
					<Button
						leftSection={<Dumbbell size={18} />}
						variant="default"
						fullWidth
						onClick={() => navigate("/exercise")}
					>
						Exercises
					</Button>
					<Button
						leftSection={<Ruler size={18} />}
						variant="default"
						fullWidth
						onClick={() => navigate("/measurements")}
					>
						Measurements
					</Button>
					{/* <Button
						leftSection={<Calendar size={18} />}
						variant="default"
						fullWidth
					>
						Calendar
					</Button> */}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Profile;
