import { UserAuth } from "@/auth/AuthContext";
import ChronosLogo from "@/components/Branding/ChronosLogo";
import GoogleLogo from "@/components/Branding/GoogleLogo";
import "@/pages/Portal/Portal.scss";
import { Anchor, Button, Container, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Portal = () => {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const { googleSignIn, user } = UserAuth();
	const icon = <GoogleLogo />;

	const handleGoogleSignUp = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			console.error(error);
			setError("Failed to create an account");
		}
	};

	useEffect(() => {
		if (user != null) {
			navigate("/register-form");
		}
	}, [user, navigate]);

	return (
		<Container
			size="xs"
			py="xl"
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
							to="/signin"
						>
							Sign in
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
