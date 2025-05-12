import { Group, Title } from "@mantine/core";
const ChronosLogoSmall = () => {
	return (
		<Group gap={10}>
			<img
				src="chronos-logo.svg"
				alt="Chronos Logo"
				className="h-7 w-7"
			/>
			<Title order={4}>Chronos</Title>
		</Group>
	);
};

export default ChronosLogoSmall;
