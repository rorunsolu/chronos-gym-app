import { Search } from "lucide-react";
import { useState } from "react";
import {
	Container,
	Input,
	Button,
	Stack,
	Card,
	Group,
	Text,
	Image,
	Divider,
} from "@mantine/core";

const exercises = [
	{ name: "21s Bicep Curl", muscle: "Biceps", image: "/images/21s.png" },
	{
		name: "Ab Scissors",
		muscle: "Abdominals",
		image: "/images/ab-scissors.png",
	},
	{ name: "Ab Wheel", muscle: "Abdominals", image: "/images/ab-wheel.png" },
	{ name: "Aerobics", muscle: "Cardio", image: "/images/default.png" },
	{ name: "Air Bike", muscle: "Cardio", image: "/images/air-bike.png" },
	{
		name: "Arnold Press (Dumbbell)",
		muscle: "Shoulders",
		image: "/images/arnold-press.png",
	},
	{
		name: "Around The World",
		muscle: "Chest",
		image: "/images/around-world.png",
	},
	{
		name: "Assisted Pistol Squats",
		muscle: "Quadriceps",
		image: "/images/pistol-squats.png",
	},
];

const Exercise = () => {
	const [search, setSearch] = useState("");

	const filtered = exercises.filter((ex) =>
		ex.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<Container
			size="sm"
			py="md"
		>
			<Stack gap="sm">
				<Input
					leftSection={<Search size={16} />}
					placeholder="Search exercise"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<Group grow>
					<Button variant="default">All Equipment</Button>
					<Button variant="default">All Muscles</Button>
				</Group>

				<Divider />

				<Stack>
					{filtered.map((exercise, index) => (
						<Card
							key={index}
							withBorder
							radius="md"
							p="sm"
							style={{ cursor: "pointer" }}
							onClick={() => console.log(`Clicked ${exercise.name}`)}
						>
							<Group>
								<Image
									src={exercise.image}
									width={40}
									height={40}
									radius="xl"
									alt={exercise.name}
								/>
								<div>
									<Text fw={500}>{exercise.name}</Text>
									<Text
										size="xs"
										c="dimmed"
									>
										{exercise.muscle}
									</Text>
								</div>
							</Group>
						</Card>
					))}
				</Stack>
			</Stack>
		</Container>
	);
};

export default Exercise;
