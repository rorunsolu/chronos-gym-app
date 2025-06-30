import styles from "@/style.module.css";
import { Badge, Card, Group, Select, Stack, Title } from "@mantine/core";
import { useState } from "react";
import type { FBExerciseData } from "@/common/types";

interface ExerciseCardListProps {
	exercises: FBExerciseData[];
	onSelect?: (exercise: FBExerciseData) => void;
	search?: string;
}

const ExerciseCardList = ({
	exercises,
	onSelect,
	search = "",
}: ExerciseCardListProps) => {
	const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		null
	);

	const mainMuscleValues = exercises
		.flat()
		.map((exercise) => exercise.muscleGroup);
	const mainMuscles = Array.from(new Set(mainMuscleValues)).sort((a, b) =>
		(a ?? "").localeCompare(b ?? "")
	);

	const equipmentValues = exercises
		.flat()
		.map((exercise) => exercise.equipment);
	const equipment = Array.from(new Set(equipmentValues)).sort((a, b) =>
		(a ?? "").localeCompare(b ?? "")
	);

	const filtered = exercises.filter((exercise) => {
		const matchesSearch = exercise.name
			.toLowerCase()
			.includes(search.toLowerCase());

		const matchesMuscle = selectedMuscle
			? mainMuscles.includes(selectedMuscle) &&
				exercise.muscleGroup === selectedMuscle
			: true;

		const matchesEquipment = selectedEquipment
			? equipment.includes(selectedEquipment) &&
				exercise.equipment === selectedEquipment
			: true;

		const showAllMuscles = selectedMuscle === "All Muscles";
		const showAllEquipment = selectedEquipment === "All Equipment";

		return (
			(matchesSearch && matchesMuscle && matchesEquipment) ||
			showAllMuscles ||
			showAllEquipment
		);
	});

	return (
		<>
			<Stack gap="8">
				<Select
					placeholder="All Muscles"
					data={mainMuscles}
					value={selectedMuscle}
					searchable
					clearable
					checkIconPosition="right"
					onChange={setSelectedMuscle}
				/>

				<Select
					placeholder="All Equipment"
					data={equipment}
					value={selectedEquipment}
					searchable
					clearable
					checkIconPosition="right"
					onChange={setSelectedEquipment}
				/>
			</Stack>

			<Stack
				gap="xs"
				mt="md"
			>
				{filtered.map((exercise, id) => (
					<Card
						className={styles.hover}
						key={id}
						withBorder
						radius="md"
						p="sm"
						style={{ cursor: "pointer" }}
						onClick={() => onSelect?.(exercise)}
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
		</>
	);
};

export default ExerciseCardList;
