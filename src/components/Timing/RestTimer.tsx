import { useTimer } from "react-timer-hook";

const RestTimer = ({ expiryTimestamp }) => {
	const {
		totalSeconds,
		milliseconds,
		seconds,
		minutes,
		hours,
		days,
		isRunning,
		start,
		pause,
		resume,
		restart,
	} = useTimer({
		expiryTimestamp,
		// eslint-disable-next-line
		onExpire: () => console.warn("onExpire called"),
		interval: 20,
	});

	return (
		<div style={{ textAlign: "center" }}>
			<h1>react-timer-hook </h1>
			<p>Timer Demo</p>
			<div style={{ fontSize: "100px" }}>
				<span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
				<span>{seconds}</span>:<span>{milliseconds}</span>
			</div>
			<p>{isRunning ? "Running" : "Not running"}</p>={" "}
			<button
				type="button"
				onClick={start}
			>
				Start
			</button>
			<button
				type="button"
				onClick={pause}
			>
				Pause
			</button>
			<button
				type="button"
				onClick={resume}
			>
				Resume
			</button>
			<button
				type="button"
				onClick={() => {
					const time = new Date();
					time.setSeconds(time.getSeconds() + 300);
					restart(time);
				}}
			>
				Restart
			</button>
		</div>
	);
};

export default RestTimer;
