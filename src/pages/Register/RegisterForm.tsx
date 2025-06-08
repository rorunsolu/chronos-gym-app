import { UserAuth } from "@/auth/AuthContext";
import { useAccountsHook } from "@/hooks/useAccountsHook";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Group,
	NativeSelect,
	NumberInput,
	Stepper,
	TextInput,
	Container,
} from "@mantine/core";

const RegisterForm = () => {
	const [active, setActive] = useState(0);
	const { user } = UserAuth();
	const { createAccount, isUserRegistered } = useAccountsHook();
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			username: "",
			name: "",
			gender: "",
			age: "",
		},

		validate: (values) => {
			if (active === 0) {
				return {
					username:
						values.username.trim().length < 4
							? "Username must include at least 4 characters"
							: null,

					name:
						values.name.trim().length < 2
							? "Name must include at least 2 characters"
							: null,
				};
			}

			if (active === 1) {
				return {
					gender:
						values.gender !== "Male" && values.gender !== "Female"
							? "Gender must be either Male or Female"
							: null,

					age:
						Number(values.age) < 12
							? "You must be at least 12 to register"
							: null,
				};
			}

			return {};
		},
	});

	const nextStep = () =>
		setActive((current) => {
			if (form.validate().hasErrors) {
				return current;
			}
			return current < 3 ? current + 1 : current;
		});

	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	const handleFinish = async (values: typeof form.values) => {
		try {
			await createAccount(
				values.username,
				values.name,
				values.gender as "Male" | "Female",
				Number(values.age),
				true
			);
			// Navigate to home AFTER account creation completes
			navigate("/home-page");
			// eslint-disable-next-line
			console.log("Form submitted with values:", values);
		} catch (error) {
			// eslint-disable-next-line
			console.error("Failed to create account:", error);
		}
	};

	useEffect(() => {
		const checkRegistration = async () => {
			if (user?.uid) {
				const registered = await isUserRegistered(user.uid);
				if (registered) {
					navigate("/home-page");
				}
			}
		};
		checkRegistration();
	}, [user, isUserRegistered, navigate]);

	useEffect(() => {
		if (user == null) {
			navigate("/");
		}
		// don't want to redirect immediately after creation
	}, [user, navigate]);

	return (
		<>
			<Container
				size="md"
				p="md"
				py="md"
			>
				<Stepper active={active}>
					<Stepper.Step
						label="Step 1"
						description="Profile settings"
					>
						<TextInput
							mt="md"
							label="Username"
							placeholder="Username"
							key={form.key("username")}
							{...form.getInputProps("username")}
							required
						/>
						<TextInput
							mt="md"
							label="Name"
							placeholder="Name"
							key={form.key("name")}
							{...form.getInputProps("name")}
							required
						/>
					</Stepper.Step>

					<Stepper.Step
						label="Step 2"
						description="Extra information"
					>
						<NativeSelect
							mt="md"
							label="Gender"
							data={["Select gender", "Male", "Female"]}
							withAsterisk
							key={form.key("gender")}
							{...form.getInputProps("gender")}
						/>

						<NumberInput
							mt="md"
							label="Age"
							placeholder="Age"
							min={0}
							max={99}
							key={form.key("age")}
							{...form.getInputProps("age")}
						/>
					</Stepper.Step>

					<Stepper.Step
						label="Step 3"
						description="Confirm your details"
					>
						<TextInput
							mt="md"
							label="Username"
							value={form.values.username}
							readOnly
							disabled
						/>
						<TextInput
							mt="md"
							label="Name"
							value={form.values.name}
							readOnly
							disabled
						/>

						<TextInput
							mt="md"
							label="Gender"
							value={form.values.gender}
							readOnly
							disabled
						/>
						<TextInput
							mt="md"
							label="Age"
							value={form.values.age}
							readOnly
							disabled
						/>
					</Stepper.Step>

					<Stepper.Completed>
						<div className="text-center mt-10">
							<h2 className="text-2xl font-semibold mb-2">
								Your account has been created
							</h2>
							<p className="mb-2">Welcome to the Chronos Gym App!</p>
							<Button
								className="mt-4"
								size="md"
								variant="filled"
								color="teal"
								onClick={() => {
									handleFinish(form.values);
								}}
							>
								Start using Chronos
							</Button>
						</div>
					</Stepper.Completed>
				</Stepper>

				<Group
					justify="flex-end"
					mt="xl"
				>
					{active !== 0 && (
						<Button
							variant="default"
							color="grey"
							onClick={prevStep}
						>
							Back
						</Button>
					)}
					{active < 3 && (
						<Button
							onClick={nextStep}
							variant="filled"
							color="teal"
						>
							Next step
						</Button>
					)}
				</Group>
			</Container>
		</>
	);
};

export default RegisterForm;
