import { UserAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";
//import { useAccountsHook } from "@/hooks/useAccountsHook";
import { type ReactNode } from "react";

const Protected: React.FC<ProtectedProps> = ({
	children,
	allowGuest = false,
}) => {
	const { user } = UserAuth();
	//const { isUserRegistered } = useAccountsHook();

	if (!user) {
		return allowGuest ? children : <Navigate to="/" />;
	}

	if (user.isAnonymous) {
		return allowGuest ? children : <Navigate to="/" />;
	}

	// // Only check registration for non-guest users
	// if (!allowGuest && !isUserRegistered(user.uid) && user) {
	// 	return <Navigate to="/register-form" />;
	// }

	// if (!user.isAnonymous && !isUserRegistered(user.uid)) {
	// 	return <Navigate to="/register-form" />;
	// }

	return children;
};

export default Protected;

interface ProtectedProps {
	children: ReactNode;
	allowGuest?: boolean;
}
