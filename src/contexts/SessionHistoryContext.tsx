import { auth, db } from "@/auth/Firebase";
import { getAuthenticatedUser } from "@/common/authChecker";
import { SessionHistoryContext } from "@/hooks/useSessionHistoryHook";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState, type ReactNode } from "react";
import type { SessionHistoryData } from "@/common/types";

export type SessionHistoryContextType = {
	allSessionHistory: SessionHistoryData[];
	fetchSessionHistory: () => Promise<void>;
	addSessionToHistory: (
		session: Omit<SessionHistoryData, "id">
	) => Promise<string>;
};

export const SessionHistoryProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [allSessionHistory, setAllSessionHistory] = useState<
		SessionHistoryData[]
	>([]);

	const fetchSessionHistory = async () => {
		const allHistoryQuery = query(
			collection(db, "sessionHistory"),
			where("userId", "==", auth.currentUser?.uid)
		);

		const snapshotOfHistory = await getDocs(allHistoryQuery);

		const historyList = snapshotOfHistory.docs.map((doc) => ({
			id: doc.id,
			userId: doc.data().userId,
			originalSessionId: doc.data().originalSessionId,

			sessionName: doc.data().sessionName,
			duration: doc.data().duration,
			notes: doc.data().notes,
			dateOfSession: doc.data().dateOfSession,

			sessionType: doc.data().sessionType,
			exercises: doc.data().exercises,
		}));

		setAllSessionHistory(
			historyList.sort(
				(a, b) => b.dateOfSession.toMillis() - a.dateOfSession.toMillis()
			)
		);
	};

	const addSessionToHistory = async (
		session: Omit<SessionHistoryData, "id">
	): Promise<string> => {
		const user = getAuthenticatedUser();

		const remainingProperties = {
			...session,
		};

		try {
			const sessionRef = await addDoc(
				collection(db, "sessionHistory"),
				remainingProperties
			);

			setAllSessionHistory((prevHistory) => [
				...prevHistory,
				{ ...remainingProperties, id: sessionRef.id, userId: user.uid },
			]);
			// eslint-disable-next-line
			console.log("Session added to history:", sessionRef.id);
			return sessionRef.id;
		} catch (error) {
			throw new Error("Error adding session to history");
		}
	};

	return (
		<SessionHistoryContext.Provider
			value={{ allSessionHistory, fetchSessionHistory, addSessionToHistory }}
		>
			{children}
		</SessionHistoryContext.Provider>
	);
};
