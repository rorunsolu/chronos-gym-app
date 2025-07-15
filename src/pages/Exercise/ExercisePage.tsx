import ExerciseCardList from "@/components/Exercises/ExerciseCardList";
import { useExercisesHook } from "@/hooks/useExercisesHook";
import { useEffect, useState } from "react";
import {
	//Button,
	Container,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import {
	//Plus,
	Search,
} from "lucide-react";
//import { useNavigate } from "react-router-dom";

const Exercise = () => {
	const [, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const { FBExercises, fetchFBExercises } = useExercisesHook();
	//const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await fetchFBExercises();
		};

		fetchData();
		// eslint-disable-next-line
	}, []);

	return (
		<Container
			size="xs"
			px="sm"
			py="md"
		>
			<Stack
				gap="md"
				mb="sm"
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

						{/* <Button
							variant="filled"
							leftSection={<Plus size={20} />}
							onClick={() => navigate("/new-exercise")}
							color="teal"
							fullWidth
						>
							Create Exercise
						</Button> */}
					</div>
				</Stack>
			</Stack>

			<ExerciseCardList
				exercises={FBExercises}
				search={search}
			/>
		</Container>
	);
};

export default Exercise;
