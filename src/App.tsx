import "@/App.css";
import { UserAuth } from "@/auth/AuthContext";
import Protected from "@/auth/Protected";
import ChronosLogoSmall from "@/components/Branding/ChronosLogoSmall";
import { useAccountsHook } from "@/hooks/useAccountsHook";
import Exercise from "@/pages/Exercise/Exercise";
import ExerciseCreate from "@/pages/Exercise/ExerciseCreate";
import Explore from "@/pages/Explore/Explore";
import Homepage from "@/pages/Homepage/Homepage";
import MeasurementsPage from "@/pages/Measurements/MeasurementsPage";
import Portal from "@/pages/Portal/Portal";
import Profile from "@/pages/Profile/Profile";
import RegisterForm from "@/pages/Register/RegisterForm";
import RoutineAbout from "@/pages/Routine/RoutineAbout";
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
	BicepsFlexed,
	Ruler,
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
	Paper,
	Avatar,
	Text,
	// Button,
} from "@mantine/core";

const theme = createTheme({
	fontFamily: "Inter, sans-serif",
});

function App() {
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
	const { isUserRegistered } = useAccountsHook();
	const { user, isGuest, logOut } = UserAuth();

	const handleSignOut = async () => {
		try {
			await logOut();
		} catch (error) {
			console.log(error);
		}
	};
	// using the Mnatine "disabled" prop woyuld be easier? Perhaps?

	return (
		<>
			<MantineProvider
				theme={theme}
				defaultColorScheme="dark"
			>
				<AppShell
					bg="dark.8"
					header={{ height: 60 }}
					padding="0"
					navbar={
						user
							? {
									width: 300,
									breakpoint: "sm",
									collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
								}
							: undefined
					}
				>
					<AppShell.Header bg="dark.8">
						<Group
							px="md"
							justify="space-between"
							align="center"
							h="100%"
						>
							<Group>
								{user || isGuest ? (
									<>
										<Burger
											opened={desktopOpened}
											onClick={toggleDesktop}
											visibleFrom="sm"
											size="md"
										/>

										<Burger
											opened={mobileOpened}
											onClick={toggleMobile}
											hiddenFrom="sm"
											size="md"
										/>
									</>
								) : null}
								{desktopOpened && <ChronosLogoSmall />}
							</Group>
						</Group>
					</AppShell.Header>

					{user || isGuest ? (
						<AppShell.Navbar
							//pt="lg"
							bg="dark.8"
						>
							<Stack
								align="stretch"
								gap={0}
								h="100%"
							>
								{user && isUserRegistered(user.uid) && (
									<>
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
												p="md"
												className=""
											/>
										))}
									</>
								)}
							</Stack>
							<Menu
								shadow="md"
								width={200}
							>
								<Paper
									bg="dark.8"
									radius={0}
									p="md"
									style={{
										width: "100%",
										borderTop:
											"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
									}}
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

												{user?.email && (
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
								</Paper>

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
					) : null}

					<AppShell.Main>
						<Routes>
							<Route
								path="/"
								element={<Portal />}
							/>

							<Route
								path="/register-form"
								element={<RegisterForm />}
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
								path="/routine-about/:id"
								element={
									<Protected>
										<RoutineAbout />
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
	{ name: "Profile", icon: <User /> },
	{ name: "Measurements", icon: <Ruler /> }, // Add Measurements link
	{ name: "Exercises", icon: <BicepsFlexed /> }, // Add Exercises link
];
