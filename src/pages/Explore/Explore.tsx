import { Dumbbell, FastForward, House, Plane } from "lucide-react";
import {
	Container,
	Group,
	Select,
	Button,
	Card,
	Text,
	Image,
	SimpleGrid,
	Title,
	Stack,
} from "@mantine/core";

const Explore = () => {
	const filters = [
		{ label: "Beginner Push/Pull/Legs", image: "/routine.jpeg", routines: 3 },
		{
			label: "Intermediate Full-Body",
			image: "/routine.jpeg",
			routines: 3,
		},
		{
			label: "Intermediate Push/Pull/Legs",
			image: "/routine.jpeg",
			routines: 3,
		},
	];

	const routineCategories = [
		{ label: "At home", icon: <House size={40} /> },
		{ label: "Travel", icon: <Plane size={40} /> },
		{ label: "Dumbbells", icon: <Dumbbell size={40} /> },
		{ label: "Band", icon: <FastForward size={40} /> },
	];

	return (
		<Container
			size="xs"
			py="xs"
		>
			<Stack gap="md">
				<Title order={3}>Programs</Title>

				<Group grow>
					<Select
						placeholder="Level"
						data={["Beginner", "Intermediate", "Advanced"]}
					/>
					<Select
						placeholder="Goal"
						data={["Build muscle", "Lose fat", "Get strong"]}
					/>
					<Select
						placeholder="Equipment"
						data={["Gym", "Home", "Bands"]}
					/>
				</Group>

				{filters.map((program, idx) => (
					<Card
						key={idx}
						radius="md"
						shadow="sm"
						withBorder
					>
						<Group>
							<Image
								src={program.image}
								w={80}
								h={80}
								radius="md"
							/>
							<Stack gap={4}>
								<Text fw={500}>{program.label} (Gym Equipment)</Text>
								<Text
									size="sm"
									c="dimmed"
								>
									{program.routines} routines
								</Text>
							</Stack>
						</Group>
					</Card>
				))}

				<Button
					variant="light"
					fullWidth
					mt="sm"
				>
					Show all 26 programs
				</Button>

				<Title
					order={4}
					mt="lg"
				>
					Routines
				</Title>
				<SimpleGrid
					cols={2}
					spacing="md"
				>
					{routineCategories.map((item, index) => (
						<Card
							key={index}
							radius="md"
							shadow="sm"
							withBorder
						>
							<Stack
								align="center"
								gap={6}
							>
								{item.icon}
								<Text size="sm">{item.label}</Text>
							</Stack>
						</Card>
					))}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Explore;
