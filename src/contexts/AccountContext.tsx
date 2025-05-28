import { auth, db } from "@/auth/Firebase";
import { AccountContext } from "@/hooks/useAccountsHook";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	Timestamp,
	addDoc,
} from "firebase/firestore";
import { useState, type ReactNode, useEffect } from "react";

export interface AccountData {
	id: string;
	userId: string;
	username: string;
	name: string;
	gender: string;
	age: number;
	createdAt: Timestamp;
	isRegistered: boolean;
}

export interface AccountContextType {
	accounts: AccountData[];
	fetchAccounts: () => Promise<void>;
	createAccount: (
		username: string,
		name: string,
		gender: "Male" | "Female",
		age: number,
		isRegistered: boolean
	) => Promise<void>;
	deleteAccount: (id: string) => Promise<void>;
	isUserRegistered: (userId: string | undefined) => boolean;
	loading: boolean;
}

export const AccountProvider = ({ children }: { children: ReactNode }) => {
	const [accounts, setAccounts] = useState<AccountData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		fetchAccounts();
	}, []);

	const isUserRegistered = (userId: string | undefined): boolean => {
		const account = accounts.find((acc) => acc.userId === userId);
		return account ? account.isRegistered : false;
	};

	const fetchAccounts = async () => {
		setLoading(true);
		try {
			const accountsQuery = query(collection(db, "accounts"));
			const snapshotOfAccounts = await getDocs(accountsQuery);

			const accountList = snapshotOfAccounts.docs.map((doc) => ({
				id: doc.id,
				userId: doc.data().userId,
				username: doc.data().username,
				name: doc.data().name,
				gender: doc.data().gender,
				age: doc.data().age,
				createdAt: doc.data().createdAt,
				isRegistered: doc.data().isRegistered,
			}));

			setAccounts(
				accountList.sort(
					(a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
				)
			);
		} catch (error) {
			console.error("Error fetching accounts:", error);
			throw new Error("Error fetching accounts");
		} finally {
			setLoading(false);
		}
	};

	const createAccount = async (
		username: string,
		name: string,
		gender: "Male" | "Female",
		age: number,
		isRegistered: boolean
	) => {
		const newDate = Timestamp.fromDate(new Date());
		const authFromUser = auth.currentUser;

		if (!authFromUser) {
			throw new Error(
				"Unable to create account. User is not authenticated or auth doesn't exist."
			);
		}

		try {
			const accountObjectData = {
				userId: authFromUser.uid,
				username,
				name,
				gender,
				age,
				email: authFromUser.email || "",
				displayName: authFromUser.displayName || "",
				createdAt: newDate,
				isRegistered: isRegistered || false,
			};

			const accountsRef = await addDoc(
				collection(db, "accounts"),
				accountObjectData
			);

			setAccounts([{ id: accountsRef.id, ...accountObjectData }, ...accounts]);
			console.log("Account created successfully, firebaseID:", accountsRef.id);
		} catch (error) {
			throw new Error("Error creating account");
		}
	};

	const deleteAccount = async (id: string) => {
		try {
			await deleteDoc(doc(db, "accounts", id));
			setAccounts((prevAccounts) =>
				prevAccounts.filter((account) => account.id !== id)
			);
			console.log("Account deleted successfully, firebaseID:", id);
		} catch (error) {
			throw new Error("Error deleting account");
		}
	};

	return (
		<AccountContext.Provider
			value={{
				accounts,
				fetchAccounts,
				createAccount,
				deleteAccount,
				isUserRegistered,
				loading,
			}}
		>
			{children}
		</AccountContext.Provider>
	);
};
