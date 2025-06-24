import styles from "@/style.module.css";
import { Badge, Card, Group, Stack, Title } from "@mantine/core";
import type { FBExerciseData } from "@/common/types";

interface ExerciseCardListProps {
	exercises: FBExerciseData[];
	onSelect: (exercise: FBExerciseData) => void;
	search?: string;
}

const ExerciseCardList = ({
	exercises,
	onSelect,
	search = "",
}: ExerciseCardListProps) => {
	const filteredExercises = exercises.filter((exercise) =>
		exercise.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<Stack
			gap="xs"
			mt="xs"
		>
			{filteredExercises.map((exercise, id) => (
				<Card
					className={styles.hover}
					key={id}
					withBorder
					radius="md"
					p="sm"
					style={{ cursor: "pointer" }}
					onClick={() => onSelect(exercise)}
				>
					<Stack
						gap="8"
						bg="transparent"
					>
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
	);
};

export default ExerciseCardList;
