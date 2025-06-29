import { UserAuth } from "@/auth/AuthContext";
import ChronosLogo from "@/components/Branding/ChronosLogo";
import GoogleLogo from "@/components/Branding/GoogleLogo";
import styles from "@/style.module.css";
import { isEmail, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Anchor,
	Button,
	Center,
	Checkbox,
	Container,
	Divider,
	Group,
	PasswordInput,
	Stack,
	Tabs,
	Text,
	TextInput,
	FloatingIndicator,
} from "@mantine/core";

const Portal = () => {
	const navigate = useNavigate();
	const { googleSignIn, emailSignUp, emailSignIn, signInAsGuest, user } =
		UserAuth();
	const [error, setError] = useState<string | null>(null);
	const icon = <GoogleLogo />;

	const handleGoogleSignUp = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Google sign-in failed:", error);
		}
	};

	const form = useForm({
		mode: "controlled",
		initialValues: {
			email: "",
			password: "",
		},
		validate: {
			email: isEmail("Invalid email"),
			password: (value) => {
				if (value.length < 6) {
					return "Password must be at least 6 characters";
				}

				if (!/^(?=.*[A-Z])(?=.*\d).{1,}$/.test(value)) {
					return "Password must have at least 1 capital letter and 1 number";
				}
				return null;
			},
		},
	});

	const handleEmailSignUp = async (email: string, password: string) => {
		try {
			await emailSignUp(email, password);
		} catch (error) {
			setError("Failed to sign up. Please check your credentials.");
			throw new Error("Failed to sign up. Please check your credentials.");
		}
	};

	const handleEmailSignIn = async (email: string, password: string) => {
		try {
			await emailSignIn(email, password);
		} catch (error) {
			setError("Failed to log in. Please check your credentials.");
			throw new Error("Failed to log in. Please check your credentials.");
		}
	};

	const handleGuestAccess = async () => {
		try {
			await signInAsGuest();
		} catch (error) {
			setError("Failed to sign in as guest. Please try again.");
			throw new Error("Failed to sign in as guest. Please try again.");
		}
	};

	useEffect(() => {
		if (user != null) {
			navigate("/home", { replace: true });
		}
	}, [user, navigate]);

	const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<
		Record<string, HTMLButtonElement | null>
	>({});
	const setControlRef = (value: string) => (node: HTMLButtonElement) => {
		controlsRefs[value] = node;
		setControlsRefs(controlsRefs);
	};

	return (
		<Container
			size="sm"
			p="md"
		>
			<Center>
				<Stack
					p="lg"
					style={{
						maxWidth: 400,
						width: "100%",
					}}
				>
					<Group
						justify="center"
						mb="md"
					>
						<ChronosLogo />
					</Group>

					{user != null ? (
						<Stack gap="xs">
							<Button
								fullWidth
								color="teal"
								onClick={() => navigate("/home")}
							>
								Go to Home
							</Button>
							{error && (
								<Text
									c="red"
									fz="sm"
									ta="center"
								>
									{error}
								</Text>
							)}
						</Stack>
					) : (
						<>
							<Tabs
								color="teal"
								variant="none"
								value={activeTab}
								onChange={(value) => setActiveTab(value as "signup" | "login")}
								mb="lg"
							>
								<Tabs.List
									grow
									ref={setRootRef}
									className={styles.list}
								>
									<Tabs.Tab
										value="signup"
										ref={setControlRef("signup")}
										className={styles.tab}
									>
										Sign up
									</Tabs.Tab>
									<Tabs.Tab
										value="login"
										ref={setControlRef("login")}
										className={styles.tab}
									>
										Log in
									</Tabs.Tab>

									<FloatingIndicator
										target={activeTab ? controlsRefs[activeTab] : null}
										parent={rootRef}
										className={styles.indicator}
									/>
								</Tabs.List>
							</Tabs>

							{activeTab === "signup" ? (
								<>
									<form
										onSubmit={form.onSubmit((values) =>
											handleEmailSignUp(values.email, values.password)
										)}
									>
										<TextInput
											c="white"
											{...form.getInputProps("email")}
											label="Email"
											placeholder="Enter your email"
											mb="md"
											withAsterisk
										/>
										<PasswordInput
											{...form.getInputProps("password")}
											label="Password"
											placeholder="Create a password"
											mb={4}
											withAsterisk
										/>

										<Stack
											gap="5"
											mb="lg"
											mt="md"
										>
											<Group
												gap={8}
												align="center"
											>
												<Checkbox
													checked={form.values.password.length >= 8}
													readOnly
													size="xs"
												/>
												<Text
													fz="xs"
													c="dimmed"
												>
													Must be at least 8 characters
												</Text>
											</Group>
											<Group
												gap={8}
												align="center"
											>
												<Checkbox
													checked={/[^A-Za-z0-9]/.test(form.values.password)}
													readOnly
													size="xs"
												/>
												<Text
													fz="xs"
													c="dimmed"
												>
													Must contain one special character
												</Text>
											</Group>
										</Stack>
										<Button
											type="submit"
											fullWidth
											color="teal"
											mb="md"
										>
											Sign up
										</Button>
										<Divider
											label="or"
											labelPosition="center"
											mb="md"
										/>
										<Stack gap="xs">
											<Button
												variant="default"
												leftSection={icon}
												fullWidth
												onClick={handleGoogleSignUp}
											>
												Sign up with Google
											</Button>
											<Button
												variant="default"
												fullWidth
												onClick={handleGuestAccess}
											>
												Start without an account
											</Button>
										</Stack>
									</form>
									<Stack gap="xs">
										{error && (
											<Text
												c="red"
												fz="sm"
												ta="center"
											>
												{error}
											</Text>
										)}
										<Text
											ta="center"
											fz="sm"
											mt="xs"
										>
											Already have an account?{" "}
											<Anchor
												component={Link}
												to=""
												onClick={() => setActiveTab("login")}
											>
												Log in
											</Anchor>
										</Text>
									</Stack>
								</>
							) : (
								<>
									<form
										onSubmit={form.onSubmit((values) =>
											handleEmailSignIn(values.email, values.password)
										)}
									>
										<TextInput
											c="white"
											{...form.getInputProps("email")}
											label="Email"
											placeholder="Enter your email"
											mb="md"
											withAsterisk
										/>
										<PasswordInput
											{...form.getInputProps("password")}
											label="Password"
											placeholder="Enter your password"
											mb="md"
											withAsterisk
										/>
										<Button
											type="submit"
											fullWidth
											color="teal"
											mb="md"
										>
											Log in
										</Button>
										<Divider
											label="or"
											labelPosition="center"
											mb="md"
										/>
										<Stack gap="xs">
											<Button
												variant="default"
												leftSection={icon}
												fullWidth
												onClick={handleGoogleSignUp}
											>
												Log in with Google
											</Button>
											<Button
												variant="default"
												fullWidth
												onClick={handleGuestAccess}
											>
												Sign in as a guest
											</Button>
										</Stack>
									</form>

									<Stack gap="xs">
										{error && (
											<Text
												c="red"
												fz="sm"
												ta="center"
											>
												{error}
											</Text>
										)}
										<Text
											ta="center"
											fz="sm"
											mt="md"
										>
											Don''t have an account?{" "}
											<Anchor
												component={Link}
												to=""
												onClick={() => setActiveTab("signup")}
											>
												Sign up
											</Anchor>
										</Text>
									</Stack>
								</>
							)}
						</>
					)}
				</Stack>
			</Center>
		</Container>
	);
};

export default Portal;
