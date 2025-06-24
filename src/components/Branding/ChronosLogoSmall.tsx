import { Group, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
const ChronosLogoSmall = () => {
	const navigate = useNavigate();

	return (
		<Group
			gap={6}
			align="center"
			onClick={() => {
				navigate("/home");
			}}
			style={{ cursor: "pointer" }}
		>
			<img
				src="./chronos-logo.svg"
				alt="Chronos Logo"
				className="h-6 w-6"
			/>
			<Title order={5}>Chronos</Title>
		</Group>
	);
};

export default ChronosLogoSmall;
