import { auth, db } from "@/auth/Firebase";
import { AccountContext } from "@/hooks/useAccountsHook";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { useState, type ReactNode } from "react";

export interface AccountData {
	userId: string;
	username: string;
	name: string;
	email: string;
	gender: string;
	age: number;
	createdAt: Timestamp;
}

export interface AccountContextType {
	accounts: AccountData[];
	createAccount: (
		username: string,
		name: string,
		email: string,
		gender: "Male" | "Female",
		age: number
	) => Promise<void>;
	deleteAccount: (userId: string) => Promise<void>;
}

export const AccountProvider = ({ children }: { children: ReactNode }) => {
	const [accounts, setAccounts] = useState<AccountData[]>([]);

	const createAccount = async (
		username: string,
		name: string,
		email: string,
		gender: "Male" | "Female",
		age: number
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
				email,
				gender,
				age,
			};

			//const accountsRef = await addDoc(collection(db, "accounts"), accountObjectData);

			setAccounts([
				{
					...accountObjectData,
					createdAt: newDate,
				},
				...accounts,
			]);
			console.log("Account created successfully, userId:", authFromUser.uid);
		} catch (error) {
			throw new Error("Error creating account");
		}
	};

	const deleteAccount = async (userId: string) => {
		try {
			await deleteDoc(doc(db, "accounts", userId));
			setAccounts((prevAccounts) =>
				prevAccounts.filter((account) => account.userId !== userId)
			);
			console.log("Account deleted successfully, userId:", userId);
		} catch (error) {
			throw new Error("Error deleting account");
		}
	};

	return (
		<AccountContext.Provider value={{ accounts, createAccount, deleteAccount }}>
			{children}
		</AccountContext.Provider>
	);
};
