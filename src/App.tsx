import "@/App.css";
import { UserAuth } from "@/auth/AuthContext";
import Protected from "@/auth/Protected";
import ChronosLogoSmall from "@/components/Branding/ChronosLogoSmall";
import Exercise from "@/pages/Exercise/Exercise";
import ExerciseCreate from "@/pages/Exercise/ExerciseCreate";
import Explore from "@/pages/Explore/Explore";
import Homepage from "@/pages/Homepage/Homepage";
import Login from "@/pages/Login/Login";
import MeasurementsPage from "@/pages/Measurements/MeasurementsPage";
import Portal from "@/pages/Portal/Portal";
import Profile from "@/pages/Profile/Profile";
import Register from "@/pages/Register/Register";
import RegisterForm from "@/pages/Register/RegisterForm";
import RoutineNew from "@/pages/Routine/RoutineNew";
import RoutinePage from "@/pages/Routine/RoutinePage";
import RoutineSession from "@/pages/Routine/RoutineSession";
import WorkoutNew from "@/pages/Workout/WorkoutNew";
import WorkoutPage from "@/pages/Workout/WorkoutPage";
import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import { useDisclosure } from "@mantine/hooks";
import { Link, Route, Routes } from "react-router-dom";
import {
	ChevronsUpDown,
	Dumbbell,
	Home,
	LogOut,
	NotebookText,
	Settings,
	User,
} from "lucide-react";
import {
	ActionIcon,
	AppShell,
	Burger,
	createTheme,
	Group,
	MantineProvider,
	NavLink,
	Stack,
	Menu,
	Card,
	Avatar,
	Text,
} from "@mantine/core";

const theme = createTheme({
	fontFamily: "Inter, sans-serif",
});

function App() {
	const [opened, { toggle }] = useDisclosure();
	const { user, logOut } = UserAuth();

	const handleSignOut = async () => {
		try {
			await logOut();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<MantineProvider
				theme={theme}
				defaultColorScheme="dark"
			>
				<AppShell
					bg="dark.9"
					header={{ height: 60 }}
					navbar={
						user
							? {
									width: 300,
									breakpoint: "md",
									collapsed: { mobile: !opened },
								}
							: undefined
					}
					padding="0"
				>
					<AppShell.Header bg="dark.9">
						<Group
							h="100%"
							px="md"
						>
							<Burger
								opened={opened}
								onClick={toggle}
								hiddenFrom="md"
								size="md"
							/>
							<ChronosLogoSmall />
						</Group>
					</AppShell.Header>

					{user && (
						<AppShell.Navbar
							p="xs"
							py="md"
							bg="dark.9"
						>
							<Stack
								align="stretch"
								justify="space-between"
								h="100%"
							>
								<Stack>
									{navbarLinks.map(({ name, icon }) => (
										<NavLink
											label={name}
											leftSection={icon}
											variant="subtle"
											key={name}
											component={Link}
											to={`/${name}`}
											active
											color="white"
										/>
									))}
								</Stack>
							</Stack>
							<Menu
								shadow="md"
								width={200}
							>
								<Card
									withBorder
									bg="dark.9"
									radius="md"
									p="xs"
									shadow="md"
								>
									<Group justify="space-between">
										<Group>
											<Avatar
												size="md"
												radius="xl"
												src={user?.photoURL}
												alt="User Avatar"
											/>
											<Stack gap="0">
												{user?.displayName && (
													<Text
														size="xs"
														fw={500}
													>
														{user.displayName}
													</Text>
												)}

												{user.email && (
													<Text
														size="xs"
														truncate="end"
														className="max-w-32"
														fw={500}
													>
														{user.email}
													</Text>
												)}
											</Stack>
										</Group>

										<Menu.Target>
											<ActionIcon
												m="0"
												color="white"
												variant="outline"
												aria-label="User Menu"
												style={{
													border:
														"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
												}}
											>
												<ChevronsUpDown size={18} />
											</ActionIcon>
										</Menu.Target>
									</Group>
								</Card>

								<Menu.Dropdown>
									<Menu.Item leftSection={<Settings size={18} />}>
										Settings
									</Menu.Item>

									<Menu.Item
										leftSection={<LogOut size={18} />}
										onClick={handleSignOut}
									>
										Log out
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</AppShell.Navbar>
					)}

					<AppShell.Main>
						<Routes>
							<Route
								path="/"
								element={<Portal />}
							/>
							<Route
								path="/login"
								element={
									<Protected allowGuest>
										<Login />
									</Protected>
								}
							/>
							<Route
								path="/register"
								element={<Register />}
							/>
							<Route
								path="/register-form"
								element={
									<Protected allowGuest>
										<RegisterForm />
									</Protected>
								}
							/>
							<Route
								path="/workouts"
								element={
									<Protected>
										<WorkoutPage />
									</Protected>
								}
							/>
							<Route
								path="/home"
								element={
									<Protected>
										<Homepage />
									</Protected>
								}
							/>
							<Route
								path="/profile"
								element={
									<Protected>
										<Profile />
									</Protected>
								}
							/>
							<Route
								path="/explore"
								element={
									<Protected>
										<Explore />
									</Protected>
								}
							/>

							<Route
								path="/new-workout"
								element={
									<Protected>
										<WorkoutNew />
									</Protected>
								}
							/>
							<Route
								path="/exercises"
								element={
									<Protected>
										<Exercise />
									</Protected>
								}
							/>
							<Route
								path="/new-exercise"
								element={
									<Protected>
										<ExerciseCreate />
									</Protected>
								}
							/>
							<Route
								path="/new-routine"
								element={
									<Protected>
										<RoutineNew />
									</Protected>
								}
							/>

							<Route
								path="/routines/:id"
								element={
									<Protected>
										<RoutineSession />
									</Protected>
								}
							/>
							<Route
								path="/routines"
								element={
									<Protected>
										<RoutinePage />
									</Protected>
								}
							/>
							<Route
								path="/measurements"
								element={
									<Protected>
										<MeasurementsPage />
									</Protected>
								}
							/>
						</Routes>
					</AppShell.Main>
				</AppShell>
			</MantineProvider>
		</>
	);
}

export default App;

const navbarLinks = [
	{ name: "Home", icon: <Home /> },
	{ name: "Workouts", icon: <Dumbbell /> },
	{ name: "Routines", icon: <NotebookText /> },
	// { name: "Exercises", icon: <Dumbbell /> },
	{ name: "Profile", icon: <User /> },
	// { name: "Settings", icon: <Settings /> },
];
