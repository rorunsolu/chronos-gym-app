import "@/App.css";
import { UserAuth } from "@/auth/AuthContext";
import Protected from "@/auth/Protected";
import ChronosLogoSmall from "@/components/Branding/ChronosLogoSmall";
import ExerciseAbout from "@/pages/Exercise/ExerciseAbout";
import ExerciseCreate from "@/pages/Exercise/ExerciseCreate";
import ExercisePage from "@/pages/Exercise/ExercisePage";
import Homepage from "@/pages/Homepage/Home";
import Portal from "@/pages/Portal/Portal";
import ProfilePage from "@/pages/Profile/ProfilePage";
import RoutineAbout from "@/pages/Routine/RoutineAbout";
import RoutineNew from "@/pages/Routine/RoutineNew";
import RoutineSession from "@/pages/Routine/RoutineSession";
import WorkoutAbout from "@/pages/Workout/WorkoutAbout";
import WorkoutNew from "@/pages/Workout/WorkoutNew";
import styles from "@/style.module.css";
import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { BicepsFlexed, ChevronsUpDown, Home, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
// import BulkExUpload from "@/BulkExUpload";
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
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
	const [activeNav, setActiveNav] = useState(0);
	const { user, isGuest, logOut } = UserAuth();

	const handleSignOut = async () => {
		try {
			logOut();
		} catch (error) {
			// eslint-disable-next-line
			console.log(error);
			throw new Error("Failed to log out. Please try again.");
		}
	};

	const navbardata = [
		{
			icon: Home,
			label: "Home",
			to: "/home",
		},
		{
			icon: BicepsFlexed,
			label: "Exercises",
			to: "/exercise-page",
		},
		{ icon: User, label: "Profile", to: "/profile-page" },
	];

	return (
		<>
			<MantineProvider
				theme={theme}
				defaultColorScheme="dark"
			>
				<Notifications />
				<AppShell
					bg="dark.9"
					header={{ height: 50 }}
					padding="0"
					navbar={
						user
							? {
									width: 250,
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
							<Group gap="xs">
								{user || isGuest ? (
									<>
										<Burger
											opened={desktopOpened}
											onClick={toggleDesktop}
											visibleFrom="sm"
											size="md"
											lineSize={2}
										/>

										<Burger
											opened={mobileOpened}
											onClick={toggleMobile}
											hiddenFrom="sm"
											size="md"
											lineSize={2}
										/>
									</>
								) : null}

								<ChronosLogoSmall />
							</Group>
						</Group>
					</AppShell.Header>

					{user || isGuest ? (
						<AppShell.Navbar bg="dark.9">
							<>
								<Stack
									align="stretch"
									gap={0}
									h="100%"
								>
									{navbardata.map((link, index) => (
										<NavLink
											p="sm"
											fw={500}
											to={link.to}
											color="white"
											bg={activeNav === index ? "dark.8" : "dark.9"}
											component={Link}
											key={link.label}
											label={link.label}
											className={styles.navlink}
											active={index === activeNav}
											onClick={() => {
												setActiveNav(index);
												toggleMobile();
												toggleDesktop();
											}}
											leftSection={
												<link.icon
													size={20}
													strokeWidth={2}
												/>
											}
										/>
									))}
								</Stack>

								<Menu
									shadow="md"
									width="fit-content"
									position="right-start"
								>
									<Paper
										bg="dark.9"
										radius={0}
										p="xs"
										style={{
											width: "100%",
											borderTop:
												"calc(0.0625rem * var(--mantine-scale)) solid var(--paper-border-color)",
										}}
									>
										<Group justify="space-between">
											<Group gap="xs">
												<Avatar
													size="35"
													radius="xl"
													src={user?.photoURL ? user.photoURL : "p.png"}
													alt="User Avatar"
												/>
												<Stack gap="0">
													{user?.displayName && (
														<Text
															size="xs"
															fw={500}
															c="white"
														>
															{user.displayName}
														</Text>
													)}

													{user?.email && (
														<Text
															size="xs"
															c="white"
															truncate="end"
															className="max-w-35"
															fw={400}
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
							</>
						</AppShell.Navbar>
					) : null}

					<AppShell.Main>
						<Routes>
							<Route
								path="/"
								element={<Portal />}
							/>

							<Route
								path="/home"
								element={
									<Protected allowGuest>
										<Homepage />
									</Protected>
								}
							/>
							<Route
								path="/profile-page"
								element={
									<Protected allowGuest>
										<ProfilePage />
									</Protected>
								}
							/>

							<Route
								path="/new-workout"
								element={
									<Protected allowGuest>
										<WorkoutNew />
									</Protected>
								}
							/>
							<Route
								path="/workout-about/:id"
								element={
									<Protected allowGuest>
										<WorkoutAbout />
									</Protected>
								}
							/>

							<Route
								path="/new-routine"
								element={
									<Protected allowGuest>
										<RoutineNew />
									</Protected>
								}
							/>
							<Route
								path="/routine-about/:id"
								element={
									<Protected allowGuest>
										<RoutineAbout />
									</Protected>
								}
							/>
							<Route
								path="/routines/:id"
								element={
									<Protected allowGuest>
										<RoutineSession />
									</Protected>
								}
							/>

							{/* <Route
								path="/bulk"
								element={
									<Protected>
										<BulkExUpload />
									</Protected>
								}
							/> */}

							<Route
								path="/exercise-page"
								element={
									<Protected allowGuest>
										<ExercisePage />
									</Protected>
								}
							/>

							<Route
								path="/exercise-about/:id"
								element={
									<Protected allowGuest>
										<ExerciseAbout />
									</Protected>
								}
							/>
							<Route
								path="/new-exercise"
								element={
									<Protected allowGuest>
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
