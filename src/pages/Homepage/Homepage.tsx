import { ChevronDown, ChevronUp, Ellipsis } from "lucide-react";
import { useState } from "react";
import {
	Card,
	Text,
	Group,
	Avatar,
	Menu,
	Button,
	Stack,
	Container,
	Divider,
	Title,
} from "@mantine/core";

const mockData = [
	{
		id: 1,
		user: {
			name: "rorunsolu1",
			avatar: "https://i.pravatar.cc/150?img=1",
			timeAgo: "8 hours ago",
		},
		title: "Leg Day",
		note: "GG",
		duration: "1h 15min",
		volume: "15,065 kg",
		exercises: [
			"6 sets Leg Extension (Machine)",
			"3 sets Hack Squat (Machine)",
			"3 sets Lying Leg Curl (Machine)",
			"3 sets Seated Leg Curl (Machine)",
			"3 sets Standing Calf Raise",
			"3 sets Glute Kickback",
		],
	},
	{
		id: 2,
		user: {
			name: "rorunsolu1",
			avatar: "https://i.pravatar.cc/150?img=1",
			timeAgo: "Yesterday",
		},
		title: "Pull Day + Mini Push",
		note: "GG",
		duration: "1h 9min",
		volume: "9,782.5 kg",
		exercises: [
			"6 sets Iso-Lateral Low Row",
			"4 sets Lat Pulldown",
			"3 sets Seated Cable Row",
			"3 sets Dumbbell Curl",
			"3 sets Incline Chest Press",
		],
	},
	{
		id: 3,
		user: {
			name: "rorunsolu1",
			avatar: "https://i.pravatar.cc/150?img=2",
			timeAgo: "2 days ago",
		},
		title: "Push Day",
		note: "Solid session",
		duration: "1h 5min",
		volume: "11,450 kg",
		exercises: [
			"4 sets Bench Press",
			"3 sets Incline Dumbbell Press",
			"3 sets Cable Flys",
			"3 sets Tricep Dips",
			"3 sets Overhead Tricep Extension",
		],
	},
	{
		id: 4,
		user: {
			name: "rorunsolu1",
			avatar: "https://i.pravatar.cc/150?img=3",
			timeAgo: "3 days ago",
		},
		title: "Back + Biceps",
		note: "Felt strong",
		duration: "1h 20min",
		volume: "13,620 kg",
		exercises: [
			"4 sets Deadlift",
			"4 sets Pull-ups",
			"3 sets Barbell Row",
			"3 sets EZ Bar Curl",
			"3 sets Hammer Curl",
		],
	},
];

const WorkoutCard = ({ workout }: { workout: (typeof mockData)[0] }) => {
	const [showAll, setShowAll] = useState(false);
	const shownExercises = showAll
		? workout.exercises
		: workout.exercises.slice(0, 3);

	return (
		<Card
			withBorder
			radius="md"
			shadow="sm"
			mb="md"
			bg="dark.8"
			onClick={() => {
				//navigate to link based on workout.id
			}}
		>
			<Group justify="apart">
				<Group>
					<Avatar
						src={workout.user.avatar}
						radius="xl"
					/>
					<div>
						<Text
							size="sm"
							fw={500}
						>
							{workout.user.name}
						</Text>
						<Text
							size="xs"
							c="dimmed"
						>
							{workout.user.timeAgo}
						</Text>
					</div>
				</Group>
				<Menu
					withinPortal
					position="bottom-end"
					shadow="sm"
				>
					<Menu.Target>
						<Button
							variant="subtle"
							c="gray"
						>
							<Ellipsis size={20} />
						</Button>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item>Edit</Menu.Item>
						<Menu.Item c="red">Delete</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>

			<Stack
				mt="md"
				gap={4}
			>
				<Title order={4}>{workout.title}</Title>
				<Text size="sm">{workout.note}</Text>
				<Group gap="xl">
					<Text
						size="sm"
						c="dimmed"
					>
						Time
						<br />
						<strong>{workout.duration}</strong>
					</Text>
					<Text
						size="sm"
						c="dimmed"
					>
						Volume
						<br />
						<strong>{workout.volume}</strong>
					</Text>
				</Group>
				<Divider my="sm" />
				{shownExercises.map((ex, idx) => (
					<Text
						key={idx}
						size="sm"
					>
						{ex}
					</Text>
				))}
				{workout.exercises.length > 3 && (
					<Button
						variant="subtle"
						size="xs"
						onClick={() => setShowAll((s) => !s)}
						rightSection={
							showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />
						}
					>
						{showAll
							? "Show less"
							: `See ${workout.exercises.length - 3} more exercises`}
					</Button>
				)}
			</Stack>
		</Card>
	);
};

const Home = () => {
	return (
		<Container
			size="xs"
			py="xs"
		>
			{mockData.map((workout) => (
				<WorkoutCard
					key={workout.id}
					workout={workout}
				/>
			))}
		</Container>
	);
};

export default Home;
