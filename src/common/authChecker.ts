import { auth } from "@/auth/Firebase";

export const getAuthenticatedUser = () => {
	const user = auth.currentUser;
	if (!user) {
		throw new Error("User is not authenticated");
	}
	return user;
};
