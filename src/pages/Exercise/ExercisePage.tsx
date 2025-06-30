import { useExercisesHook } from "@/hooks/useExercisesHook";
import styles from "@/style.module.css";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Stack,
	Group,
	Badge,
	Title,
	Card,
	Button,
	TextInput,
} from "@mantine/core";

const Exercise = () => {
	const [, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const { FBExercises, fetchFBExercises } = useExercisesHook();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await fetchFBExercises();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

	const filteredExercises = FBExercises.filter((exercise) => {
		const matchesSearch = exercise.name
			.toLowerCase()
			.includes(search.toLowerCase());

		return matchesSearch;
	});

	return (
		<Container
			size="xs"
			px="sm"
			py="md"
		>
			<Stack
				gap="md"
				mb="lg"
			>
				<Title order={2}>Exercises</Title>{" "}
				<Stack>
					<div className="flex flex-col md:flex-row items-center justify-between flex-grow-0 gap-3">
						<TextInput
							c="white"
							leftSection={<Search size={20} />}
							placeholder="Search exercise"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							w="100%"
						/>

						<Button
							variant="filled"
							leftSection={<Plus size={20} />}
							onClick={() => navigate("/new-exercise")}
							color="teal"
							fullWidth
						>
							Create Exercise
						</Button>
					</div>
				</Stack>
			</Stack>

			<Stack
				mt="lg"
				gap="xs"
			>
				{filteredExercises.map((exercise, id) => (
					<Card
						key={id}
						p="sm"
						withBorder
						shadow="md"
						bg="dark.9"
						onClick={() => navigate(`/exercise-about/${exercise.id}`)}
						style={{
							cursor: "pointer",
						}}
						className={styles.hover}
					>
						<Stack gap="8">
							<Title
								order={5}
								fw={500}
								c="white"
							>
								{exercise.name}
							</Title>
							<Group gap={5}>
								{exercise.muscleGroup && (
									<Badge
										variant="dot"
										color="teal"
										fw={500}
										size="sm"
										className="border-man"
									>
										{exercise.muscleGroup}
									</Badge>
								)}
								{exercise.secondaryMuscleGroup && (
									<Badge
										variant="dot"
										color="blue"
										fw={500}
										size="sm"
										className="border-man"
									>
										{exercise.secondaryMuscleGroup}
									</Badge>
								)}
								{exercise.equipment && (
									<Badge
										variant="dot"
										color="orange"
										fw={500}
										size="sm"
										className="border-man"
									>
										{exercise.equipment}
									</Badge>
								)}
							</Group>
						</Stack>
					</Card>
				))}
			</Stack>
		</Container>
	);
};

export default Exercise;
