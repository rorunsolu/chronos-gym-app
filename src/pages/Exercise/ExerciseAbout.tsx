import styles from "@/accordion.module.css";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { useWorkOutHook } from "@/hooks/useWorkoutHook";
import classes from "@/hover.module.css";
import { format } from "date-fns";
import { ChevronRight, Info } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Container,
	Paper,
	Group,
	Stack,
	Text,
	Title,
	Table,
	Accordion,
	List,
} from "@mantine/core";

const ExerciseAbout = () => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();
	const { workouts, fetchWorkouts } = useWorkOutHook();
	const { FBExercises, fetchFBExercises } = useExercisesHook();

	const history = workouts
		.filter((workout) =>
			workout.exercises.some((exercise) => exercise.mappedId === id)
		)
		.map((workout) => {
			const matchedExercise = workout.exercises.find(
				(exercise) => exercise.mappedId === id
			);
			return {
				workoutId: workout.id,
				workoutName: workout.name,
				workoutExercises: workout.exercises,
				workoutDate: workout.createdAt,
				workoutSets: matchedExercise?.sets || [],
			};
		});

	useEffect(() => {
		const fetchData = async () => {
			await fetchWorkouts();
			await fetchFBExercises();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

	const exercise = FBExercises.find((ex) => ex.id === id);
	const name = exercise?.name;
	const muscle = exercise?.muscleGroup;
	const secondaryMuscle = exercise?.secondaryMuscleGroup;
	const instructions = exercise?.instructions;

	return (
		<Container
			size="xs"
			p="md"
			py="md"
		>
			<Stack>
				<Stack
					gap="5"
					mb="xs"
				>
					<Title
						order={3}
						c="white"
					>
						{name}
					</Title>

					<Stack
						gap="3"
						mb="xs"
					>
						{muscle && (
							<Text
								size="sm"
								c="dimmed"
							>
								Primary: {muscle}
							</Text>
						)}

						{secondaryMuscle && (
							<Text
								size="sm"
								c="dimmed"
							>
								Secondary: {secondaryMuscle}
							</Text>
						)}
					</Stack>

					{instructions && instructions.length > 0 && (
						<Accordion>
							<Accordion.Item
								value="instructions"
								className={styles.item}
							>
								<Accordion.Control
									p="0"
									px="sm"
									icon={<Info size={20} />}
									className={styles.control}
								>
									<Text
										size="sm"
										c="white"
									>
										Instructions
									</Text>
								</Accordion.Control>
								<Accordion.Panel>
									<List
										mt="xs"
										size="sm"
										spacing="7"
										type="ordered"
									>
										{instructions.map((instruction, index) => (
											<List.Item key={index}>
												{index + 1}. {instruction}
											</List.Item>
										))}
									</List>
								</Accordion.Panel>
							</Accordion.Item>
						</Accordion>
					)}
				</Stack>

				{history.length > 0 ? (
					<Stack gap="md">
						{history.map((workout) => (
							<Paper
								key={workout.workoutId}
								p="sm"
								bg="dark.9"
								radius="sm"
								style={{
									border:
										"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
								}}
							>
								<Stack
									gap="xs"
									mb="xs"
								>
									<Stack gap="xs">
										<Group
											justify="space-between"
											onClick={() => navigate(`/workout/${workout.workoutId}`)}
										>
											<Stack gap="0">
												<Title
													order={4}
													c="white"
												>
													{workout.workoutName}
												</Title>
												<Text
													size="xs"
													c="dimmed"
													fw={500}
												>
													{format(
														workout.workoutDate.toDate(),
														"dd/MM/yy, HH:mm"
													)}
												</Text>
											</Stack>
											<Paper
												//variant="outline"
												p={5}
												radius="sm"
												c="white"
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/workout-about/${workout.workoutId}`);
												}}
												className={classes.hover}
												style={{
													border:
														"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
												}}
											>
												<ChevronRight size={16} />
											</Paper>
										</Group>
									</Stack>

									<Title
										order={5}
										c="white"
										fw={500}
									>
										{name}
									</Title>
								</Stack>

								<Table
									striped
									withRowBorders={false}
								>
									<Table.Thead>
										<Table.Tr>
											<Table.Th className="text-center w-[50px]">
												<Text
													size="sm"
													className="text-center"
												>
													Set
												</Text>
											</Table.Th>
											<Table.Th>
												<Group gap="5">
													<Text size="sm">Weight & Reps</Text>
												</Group>
											</Table.Th>
										</Table.Tr>
									</Table.Thead>
									{workout.workoutSets.map((set, index) => (
										<Table.Tr key={index}>
											<Table.Td className="flex justify-center w-[50px]">
												<Text
													size="md"
													c="white"
													fw={500}
													className="flex justify-center w-[50px]"
												>
													{index + 1}
												</Text>
											</Table.Td>
											<Table.Td>
												<Group gap="5">
													<Text
														size="md"
														c="white"
														fw={500}
													>
														{set.weight}kg
													</Text>
													<Text
														size="md"
														c="white"
														fw={500}
													>
														x {set.reps}
													</Text>
												</Group>
											</Table.Td>
										</Table.Tr>
									))}
								</Table>
							</Paper>
						))}
					</Stack>
				) : (
					<Text
						size="sm"
						c="dimmed"
					>
						No session history found for this exercise.
					</Text>
				)}
			</Stack>
		</Container>
	);
};

export default ExerciseAbout;
