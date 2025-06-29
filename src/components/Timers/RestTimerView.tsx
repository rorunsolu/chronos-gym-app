import { Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTimer } from "react-timer-hook";
import { useEffect } from "react";

interface RestTimerViewProps {
	timeToRest: number; // Total seconds to rest
}

const RestTimerView: React.FC<RestTimerViewProps> = ({ timeToRest }) => {
	const { seconds, minutes, isRunning, restart } = useTimer({
		expiryTimestamp: new Date(),
		autoStart: false,
		onExpire: () => {
			handleRestEndMsg();
		},
	});

	const handleRestEndMsg = () => {
		notifications.show({
			title: "Rest Time Over",
			message: "Your rest time is over. Get ready for the next set!",
			color: "teal",
		});
	};

	useEffect(() => {
		if (timeToRest > 0) {
			const expiryTime = new Date();
			expiryTime.setSeconds(expiryTime.getSeconds() + timeToRest);
			restart(expiryTime, true);
		}
	}, [timeToRest, restart]);

	return (
		<>
			{isRunning && (
				<Group>
					<Text
						size="xs"
						c="dimmed"
					>
						{minutes.toString().padStart(2, "0")}:
					</Text>
					<Text
						size="xs"
						c="dimmed"
					>
						{seconds.toString().padStart(2, "0")}
					</Text>
				</Group>
			)}
		</>
	);
};

export default RestTimerView;
