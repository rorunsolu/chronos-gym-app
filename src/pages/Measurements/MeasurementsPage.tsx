import { useMeasurementsHook } from "@/hooks/useMeasurementsHook";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Container,
	Group,
	Stack,
	Table,
	Title,
	Modal,
	NumberInput,
} from "@mantine/core";

const MeasurementsPage = () => {
	const [weight, setWeight] = useState<string | number>("");
	const [height, setHeight] = useState<string | number>("");
	const [bodyFat, setBodyFat] = useState<string | number>("");

	const [opened, { open, close }] = useDisclosure(false);

	const {
		measurements,
		fetchMeasurements,
		createMeasurement,
		//deleteMeasurement,
	} = useMeasurementsHook();

	const handleMeasurementCreation = async () => {
		if (weight === "" || height === "") {
			console.log("Please enter a weight and height");
			return;
		}
		await createMeasurement(weight, height, bodyFat);
		setWeight("");
		setHeight("");
		setBodyFat("");
		close();
	};

	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			await fetchMeasurements();
		};

		fetchData();
	}, []);

	return (
		<Container
			size="md"
			p="md"
			py="md"
		>
			<Modal
				opened={opened}
				onClose={close}
				title="Add New Measurement"
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleMeasurementCreation();
					}}
				>
					<Stack gap="sm">
						<NumberInput
							label="Weight (kg)"
							onChange={(val: string | number) => setWeight(val)}
							placeholder="Weight in kg"
							suffix="kg"
							required
						/>

						<NumberInput
							label="Height (cm)"
							onChange={(val: string | number) => setHeight(val)}
							placeholder="Height in cm"
							suffix="cm"
							required
						/>

						<NumberInput
							label="Body Fat (%)"
							onChange={(val: string | number) => setBodyFat(val)}
							placeholder="Body Fat %"
							suffix="%"
						/>
					</Stack>

					<Group
						mt="lg"
						justify="flex-end"
					>
						<Button
							type="submit"
							color="teal"
						>
							Save Measurement
						</Button>
					</Group>
				</form>
			</Modal>

			<Stack gap={8}>
				<Title order={1}>Measurements</Title>
			</Stack>
			<Group
				mb="xl"
				mt="md"
			>
				<Button
					color="teal"
					radius="xs"
					size="md"
					leftSection={<Plus size={20} />}
					onClick={open}
				>
					Add Measurement
				</Button>
			</Group>
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Date</Table.Th>
						<Table.Th>Weight</Table.Th>
						<Table.Th>Height</Table.Th>
						<Table.Th>Body Fat</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{measurements.map((measurement) => {
						return (
							<Table.Tr
								key={measurement.id}
								onClick={() => navigate(`/measurements/${measurement.id}`)}
							>
								<Table.Td>
									{format(measurement.date.toDate(), "dd/MM/yy")}
								</Table.Td>
								<Table.Td>{measurement.weight} kg</Table.Td>
								<Table.Td>{measurement.height} cm</Table.Td>
								<Table.Td>
									{measurement.bodyFat ? `${measurement.bodyFat}%` : "N/A"}
								</Table.Td>
							</Table.Tr>
						);
					})}
				</Table.Tbody>
			</Table>
		</Container>
	);
};

export default MeasurementsPage;
