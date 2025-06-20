import { UserAuth } from "@/auth/AuthContext";
import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";

const Protected: React.FC<ProtectedProps> = ({
	children,
	allowGuest = false,
}) => {
	const { user } = UserAuth();

	if (!user) {
		return allowGuest ? children : <Navigate to="/" />;
	}

	if (user.isAnonymous) {
		return allowGuest ? children : <Navigate to="/" />;
	}

	return children;
};

export default Protected;

interface ProtectedProps {
	children: ReactNode;
	allowGuest?: boolean;
}
