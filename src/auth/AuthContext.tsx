import {
	auth,
	//db
} from "@/auth/Firebase";
// import { doc, getDoc } from "firebase/firestore";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInAnonymously,
	signInWithPopup,
	signOut,
	type User,
	type UserCredential,
} from "firebase/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	//const [isRegistered, setIsRegistered] = useState(false);
	const [isGuest, setIsGuest] = useState(false);
	const [loading, setLoading] = useState(true);

	const googleSignIn = () => {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	};

	const signInAsGuest = async () => {
		const credential = await signInAnonymously(auth);
		setUser(credential.user);
		setIsGuest(true);
		return credential;
	};

	const logOut = () => {
		setUser(null);
		setIsGuest(false);

		return signOut(auth);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);
			setIsGuest(currentUser?.isAnonymous || false);
			setLoading(false);
			console.log("The current user is:", currentUser);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				googleSignIn,
				signInAsGuest,
				logOut,
				user,
				isGuest,
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const UserAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthContextType {
	googleSignIn: () => Promise<UserCredential>;
	signInAsGuest: () => Promise<UserCredential>;
	logOut: () => void;
	//isRegistered: boolean;
	user: User | null;
	isGuest: boolean;
}

interface AuthContextProviderProps {
	children: ReactNode;
}
