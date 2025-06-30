import { Group, Title } from "@mantine/core";
const ChronosLogo = () => {
	return (
		<Group>
			<Title order={2}>Chronos Gym</Title>
			<img
				src="chronos-logo.svg"
				alt="Chronos Logo"
				className="h-10 w-10"
			/>
		</Group>
	);
};

export default ChronosLogo;
