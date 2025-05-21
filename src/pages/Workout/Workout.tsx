import { useNavigate } from "react-router-dom";
import {
	//Play,
	Plus,
	Search,
} from "lucide-react";
import {
	Box,
	Button,
	Group,
	//Paper,
	Stack,
	//Text,
	Title,
	ScrollArea,
} from "@mantine/core";

// const routines = [
// 	{
// 		name: "Full Body Beta",
// 		description:
// 			"Incline Bench Press (Smith Machine), Overhead Tricep Extension (Both Arms), Shoulder Press (Machine Plates)...",
// 	},
// 	{
// 		name: "Pull Day + Mini Push",
// 		description:
// 			"Iso-Lateral Low Row, Lat Pulldown - Close Grip (Cable), Hammer Curl (Cable), Bicep Curl (Cable)...",
// 	},
// 	{
// 		name: "Push Day + Mini Pull",
// 		description:
// 			"Incline Bench Press (Dumbbell), Chest Fly (Machine), Triceps Dip, Overhead Tricep Extension (Both Arms)...",
// 	},
// ];

const Workout = () => {
	const navigate = useNavigate();

	return (
		<ScrollArea
			style={{ height: "100vh" }}
			px="md"
			py="md"
		>
			<Stack gap="lg">
				<Box>
					<Title order={3}>Quick Start</Title>
					<Button
						color="teal"
						variant="outline"
						fullWidth
						mt="xs"
						leftSection={<Plus size={20} />}
						onClick={() => {
							navigate("/workout-in-progress");
						}}
					>
						Start Empty Workout
					</Button>
				</Box>

				<Box>
					<Title
						order={3}
						mb="xs"
					>
						Routines
					</Title>
					<Group grow>
						<Button
							color="teal"
							leftSection={<Plus size={20} />}
							onClick={() => {
								navigate("/routines");
							}}
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
						>
							Explore
						</Button>
					</Group>
				</Box>

				{/* <Box>
					<Title
						order={4}
						mb="xs"
					>
						My Routines ({routines.length})
					</Title>

					<Stack gap="md">
						{routines.map((routine, idx) => (
							<Paper
								key={idx}
								withBorder
								p="md"
								radius="md"
								shadow="sm"
							>
								<Stack gap="xs">
									<Text fw={600}>{routine.name}</Text>
									<Text
										size="sm"
										lineClamp={2}
									>
										{routine.description}
									</Text>
									<Button
										fullWidth
										mt="xs"
										color="teal"
										leftSection={<Play size={20} />}
									>
										Start Routine
									</Button>
								</Stack>
							</Paper>
						))}
					</Stack>
				</Box> */}
			</Stack>
		</ScrollArea>
	);
};

export default Workout;
