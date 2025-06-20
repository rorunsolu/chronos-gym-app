import { UserAuth } from "@/auth/AuthContext";
import ChronosLogo from "@/components/Branding/ChronosLogo";
import GoogleLogo from "@/components/Branding/GoogleLogo";
import styles from "@/tabs.module.css";
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
	const { googleSignIn, emailSignUp, emailSignIn, user } = UserAuth();
	const icon = <GoogleLogo />;

	const handleGoogleSignUp = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			throw new Error("Failed to create an account");
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
			throw new Error("Failed to sign up. Please check your credentials.");
		}
	};

	const handleEmailSignIn = async (email: string, password: string) => {
		try {
			await emailSignIn(email, password);
		} catch (error) {
			throw new Error("Failed to log in. Please check your credentials.");
		}
	};

	useEffect(() => {
		if (user != null) {
			navigate("/home");
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
			<Center
				style={
					{
						//minHeight: "100vh",
					}
				}
			>
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
								// style={{ borderRadius: "calc(0.25rem * 1)" }}
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
								<Button
									variant="default"
									leftSection={icon}
									fullWidth
									mb="md"
									onClick={handleGoogleSignUp}
								>
									Sign up with Google
								</Button>
							</form>
							<Text
								ta="center"
								fz="sm"
								mt="md"
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
								<Button
									variant="default"
									leftSection={icon}
									fullWidth
									mb="md"
									onClick={handleGoogleSignUp}
								>
									Log in with Google
								</Button>
							</form>

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
						</>
					)}
				</Stack>
			</Center>
		</Container>
	);
};

export default Portal;
