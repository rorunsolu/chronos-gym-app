import "@/App.css";
import { UserAuth } from "@/auth/AuthContext";
import Protected from "@/auth/Protected";
import BulkExUpload from "@/BulkExUpload";
import ChronosLogoSmall from "@/components/Branding/ChronosLogoSmall";
import styles from "@/hover.module.css";
import ExerciseAbout from "@/pages/Exercise/ExerciseAbout";
import ExerciseCreate from "@/pages/Exercise/ExerciseCreate";
import ExercisePage from "@/pages/Exercise/ExercisePage";
import WorkoutPage from "@/pages/Homepage/WorkoutPage";
import Portal from "@/pages/Portal/Portal";
import ProfilePage from "@/pages/Profile/ProfilePage";
import RoutineAbout from "@/pages/Routine/RoutineAbout";
import RoutineNew from "@/pages/Routine/RoutineNew";
import RoutineSession from "@/pages/Routine/RoutineSession";
import WorkoutAbout from "@/pages/Workout/WorkoutAbout";
import WorkoutNew from "@/pages/Workout/WorkoutNew";
import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import { useDisclosure } from "@mantine/hooks";
import { BicepsFlexed, ChevronsUpDown, Home, LogOut, User } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";
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
} from "@mantine/core";

const theme = createTheme({
	fontFamily: "Inter, sans-serif",
	cursorType: "pointer",
});

function App() {
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
	const { user, isGuest, logOut } = UserAuth();

	const handleSignOut = async () => {
		try {
			logOut();
		} catch (error) {
			// eslint-disable-next-line
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
					<AppShell.Header bg="dark.9">
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
						<AppShell.Navbar bg="dark.9">
							<Stack
								align="stretch"
								gap={0}
								h="100%"
							>
								<NavLink
									c="white"
									label="Home"
									leftSection={
										<Home
											size={20}
											stroke="#fff"
											strokeWidth={1.5}
										/>
									}
									component={Link}
									to="/home"
									variant="subtle"
									color="white"
									p="md"
									className={styles.hover}
								/>

								<NavLink
									c="white"
									label="Exercises"
									leftSection={
										<BicepsFlexed
											size={20}
											stroke="#fff"
											strokeWidth={1.5}
										/>
									}
									component={Link}
									to="/exercise-page"
									variant="subtle"
									color="white"
									p="md"
									className={styles.hover}
								/>

								<NavLink
									c="white"
									label="Profile"
									leftSection={
										<User
											size={20}
											stroke="#fff"
											strokeWidth={1.5}
										/>
									}
									component={Link}
									to="/profile-page"
									variant="subtle"
									color="white"
									p="md"
									className={styles.hover}
								/>
							</Stack>
							<Menu
								shadow="md"
								width="fit-content"
								position="right-start"
							>
								<Paper
									bg="dark.9"
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
												src={user?.photoURL ? user.photoURL : "p.png"}
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
												className={styles.hover}
											>
												<ChevronsUpDown size={18} />
											</ActionIcon>
										</Menu.Target>
									</Group>
								</Paper>

								<Menu.Dropdown bg="dark.9">
									<Menu.Item
										leftSection={<LogOut size={18} />}
										onClick={handleSignOut}
										className={styles.hover}
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
								path="/profile-page"
								element={
									<Protected>
										<ProfilePage />
									</Protected>
								}
							/>

							<Route
								path="/home"
								element={
									<Protected>
										<WorkoutPage />
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
								path="/workout-about/:id"
								element={
									<Protected>
										<WorkoutAbout />
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
								path="/routine-about/:id"
								element={
									<Protected>
										<RoutineAbout />
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
								path="/bulk"
								element={
									<Protected>
										<BulkExUpload />
									</Protected>
								}
							/>

							<Route
								path="/exercise-page"
								element={
									<Protected>
										<ExercisePage />
									</Protected>
								}
							/>

							<Route
								path="/exercise-about/:id"
								element={
									<Protected>
										<ExerciseAbout />
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
						</Routes>
					</AppShell.Main>
				</AppShell>
			</MantineProvider>
		</>
	);
}

export default App;
