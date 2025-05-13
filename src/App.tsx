import "@/App.css";
import { UserAuth } from "@/auth/AuthContext";
import Protected from "@/auth/Protected";
import ChronosLogoSmall from "@/components/Branding/ChronosLogoSmall";
import Login from "@/pages/Login/Login";
import Portal from "@/pages/Portal/Portal";
import Register from "@/pages/Register/Register";
import RegisterForm from "@/pages/Register/RegisterForm";
import Workout from "@/pages/Workout/Workout";
import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import "@mantine/dropzone/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { Dumbbell, Home, LogOut, Settings, User } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";
import {
	AppShell,
	Burger,
	Button,
	createTheme,
	Group,
	MantineProvider,
	NavLink,
	Stack,
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
					padding="md"
				>
					<AppShell.Header>
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
						<AppShell.Navbar p="md">
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

								{user && (
									<Stack>
										<Button
											variant="filled"
											color="teal"
											onClick={handleSignOut}
										>
											<LogOut size={18} /> Sign Out
										</Button>
									</Stack>
								)}
							</Stack>
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
								path="/workout"
								element={
									<Protected>
										<Workout />
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
	{ name: "Workout", icon: <Dumbbell /> },
	{ name: "Profile", icon: <User /> },
	{ name: "Settings", icon: <Settings /> },
];
