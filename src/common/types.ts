import { Timestamp } from "firebase/firestore";

export type ExerciseData = {
	id: string;
	name: string;
	notes?: string;
	sets: {
		id: string;
		weight: string | number;
		reps: string | number;
		isCompleted: boolean;
	}[];
};

export type SessionData = {
	id: string;
	name: string;
	notes?: string;
	userId: string;
	createdAt: Timestamp;
	exercises: ExerciseData[];
	totalElapsedTimeSec: number;
};

export type SessionHistoryData = {
	// The data for each session would be different accross each indiividual instance of the session
	id: string; // created by Firestore automatically
	userId: SessionData["userId"]; // userId of the user who created the session
	originalSessionId: SessionData["id"]; // the original session ID that this history entry is based on

	sessionName: SessionData["name"]; // name of the session when it was created
	duration: SessionData["totalElapsedTimeSec"]; // total duration of the session in seconds
	notes: SessionData["notes"]; // notes of the session when it was created
	dateOfSession: Timestamp; // date when the session was completed, stored as a Firestore Timestamp

	exercises: ExerciseData[]; // exercises performed during the session and the sets/reps/weight of each
	sessionType: "routine" | "workout"; // not sure if this is even needed tbh
};
