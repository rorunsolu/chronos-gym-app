import { useForm } from "@mantine/form";
import {
	// useRef,
	useState,
} from "react";
import {
	Button,
	// FileButton,
	Group,
	// Image,
	NativeSelect,
	NumberInput,
	Stepper,
	TextInput,
} from "@mantine/core";

// Just set the profile picture using their google accounts image

const RegisterForm = () => {
	const [active, setActive] = useState(0);
	// const [image, setImage] = useState<string | null>(null);
	// const [file, setFile] = useState<File | null>(null);
	// const resetRef = useRef<() => void>(null);

	// const handleImageUpload = (file: File | null) => {
	// 	if (file) {
	// 		setFile(file);
	// 		setImage(URL.createObjectURL(file));
	// 	} else {
	// 		setImage(null); // Clear the image if no file is selected
	// 	}
	// };

	// const clearFile = () => {
	// 	setFile(null);
	// 	resetRef.current?.();
	// };

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			username: "",
			name: "",
			email: "",
			gender: "",
			age: "",
			// profilePicture: null,
		},

		validate: (values) => {
			if (active === 0) {
				return {
					username:
						values.username.trim().length < 6
							? "Username must include at least 6 characters"
							: null,

					name:
						values.name.trim().length < 2
							? "Name must include at least 2 characters"
							: null,
					email: /^\S+@\S+$/.test(values.email) ? null : "Invalid email",
				};
			}

			if (active === 1) {
				return {
					gender:
						values.gender !== "Male" && values.gender !== "Female"
							? "Gender must be either Male or Female"
							: null,

					age:
						Number(values.age) < 18
							? "You must be at least 18 to register"
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

	return (
		<>
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
					/>
					<TextInput
						mt="md"
						label="Name"
						placeholder="Name"
						key={form.key("name")}
						{...form.getInputProps("name")}
					/>
					<TextInput
						mt="md"
						label="Email"
						placeholder="Email"
						key={form.key("email")}
						{...form.getInputProps("email")}
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
					{/* 
					<FileInput
						mt="md"
						clearable
						accept="image/png,image/jpeg,image/jpg"
						clearButtonProps={{
							"aria-label": "Clear image",
						}}
						{...form.getInputProps("profilePicture")}
						label="Profile picture"
						placeholder="Add a profile picture"
						multiple={false}
						onChange={handleImageUpload}
					/> */}

					{/* <Group mt="md">
						<FileButton
							onChange={handleImageUpload}
							accept="image/png,image/jpeg"
						>
							{(props) => <Button {...props}>Upload image</Button>}
						</FileButton>

						<Button
							disabled={!file}
							color="red"
							onClick={clearFile}
						>
							Reset
						</Button>
					</Group>

					{file && (
						<Image
							mt="md"
							src={image}
							radius="md"
							h={200}
							w="auto"
							fit="contain"
							fallbackSrc="https://placehold.co/600x400?text=Placeholder"
						/>
					)} */}
					{/* 
					{image && (
						<Image
							mt="md"
							src={image}
							radius="md"
							h={200}
							w="auto"
							fit="contain"
							fallbackSrc="https://placehold.co/600x400?text=Placeholder"
						/>
					)} */}
				</Stepper.Step>

				<Stepper.Step
					label="Step 3"
					description="Confirm your details"
				>
					<TextInput
						mt="md"
						label="Username"
						placeholder="Username"
						value={form.values.username}
						readOnly
						disabled
					/>
					<TextInput
						mt="md"
						label="Name"
						placeholder="Name"
						value={form.values.name}
						readOnly
						disabled
					/>
					<TextInput
						mt="md"
						label="Email"
						placeholder="Email"
						value={form.values.email}
						readOnly
						disabled
					/>
					<TextInput
						mt="md"
						label="Gender"
						placeholder="Gender"
						value={form.values.gender}
						readOnly
						disabled
					/>
					<TextInput
						mt="md"
						label="Age"
						placeholder="Age"
						value={form.values.age}
						readOnly
						disabled
					/>

					{/* {file && (
						<Image
							mt="md"
							src={image}
							radius="md"
							h={200}
							w="auto"
							fit="contain"
							fallbackSrc="https://placehold.co/600x400?text=Placeholder"
						/>
					)} */}

					{/* {image && (
						<Image
							mt="md"
							src={image}
							radius="md"
							h={200}
							w="auto"
							fit="contain"
							fallbackSrc="https://placehold.co/600x400?text=Placeholder"
						/>
					)} */}
				</Stepper.Step>

				<Stepper.Completed>Completed! Form values:</Stepper.Completed>
			</Stepper>

			<Group
				justify="flex-end"
				mt="xl"
			>
				{active !== 0 && (
					<Button
						variant="default"
						onClick={prevStep}
					>
						Back
					</Button>
				)}
				{active !== 3 && (
					<Button
						onClick={() => {
							nextStep();
						}}
					>
						Next step
					</Button>
				)}
			</Group>
		</>
	);
};

export default RegisterForm;
