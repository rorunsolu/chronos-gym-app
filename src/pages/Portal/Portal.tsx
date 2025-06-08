import { UserAuth } from "@/auth/AuthContext";
import ChronosLogo from "@/components/Branding/ChronosLogo";
import GoogleLogo from "@/components/Branding/GoogleLogo";
import { Anchor, Button, Container, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { useAccountsHook } from "@/hooks/useAccountsHook";

const Portal = () => {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const { googleSignIn, user } = UserAuth();
	const icon = <GoogleLogo />;
	//const { isUserRegistered } = useAccountsHook();

	const handleGoogleSignUp = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			setError("Failed to create an account");
			throw new Error("Failed to create an account");
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			setError("Failed to sign in");
			throw new Error("Failed to sign in");
		}
	};

	// useEffect(() => {
	// 	if (user != null && isUserRegistered(user.uid)) {
	// 		navigate("/home-page");
	// 	}
	// }, [user, isUserRegistered, navigate]);

	// useEffect(() => {
	// 	if (user != null && !isUserRegistered(user.uid)) {
	// 		navigate("/register-form");
	// 	}
	// }, [user, isUserRegistered, navigate]);

	// useEffect(() => {
	// 	const checkRegistration = async () => {
	// 		if (user != null) {
	// 			const registered = await isUserRegistered(user.uid);

	// 			if (registered) {
	// 				navigate("/home-page");
	// 			} else {
	// 				navigate("/register-form");
	// 			}
	// 		}
	// 	};

	// 	checkRegistration();
	// }, [user, isUserRegistered, navigate]);

	useEffect(() => {
		if (user != null) {
			navigate("/home-page");
		}
	}, [user, navigate]);

	return (
		<Container
			size="xs"
			p="md"
			py="md"
		>
			<Stack
				gap="xl"
				align="center"
			>
				<Stack align="center">
					<ChronosLogo />
					<h2>Welcome to the Chronos Gym app</h2>
				</Stack>

				<Stack align="center">
					<Button
						variant="default"
						onClick={handleGoogleSignUp}
						leftSection={icon}
						fullWidth
					>
						Register with Google
					</Button>

					<Text
						size="sm"
						c="dimmed"
					>
						Already have an account?{" "}
						<Anchor
							component={Link}
							to=""
							onClick={handleGoogleSignIn}
						>
							Sign in with Google
						</Anchor>
					</Text>
				</Stack>

				{error && (
					<Text
						c="red"
						size="sm"
					>
						{error}
					</Text>
				)}
			</Stack>
		</Container>
	);
};

export default Portal;
