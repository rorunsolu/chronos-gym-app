import { UserAuth } from "@/auth/AuthContext";
import GoogleLogo from "@/components/Branding/GoogleLogo";
import { Anchor, Button, Container, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
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
			navigate("/dashboard");
		}
	}, [user, navigate]);

	return (
		<Container
			size="xs"
			p="xs"
			py="md"
		>
			<Stack
				gap="lg"
				align="center"
			>
				<Title order={2}>Create an account</Title>
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

export default Register;
