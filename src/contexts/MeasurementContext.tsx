import { db } from "@/auth/Firebase";
import { MeasurementsContext } from "@/hooks/useMeasurementsHook";
import { useState, type ReactNode } from "react";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	query,
	getDocs,
	Timestamp,
} from "firebase/firestore";

export interface MeasurementData {
	id: string;
	weight: string | number;
	height: string | number;
	bodyFat?: string | number;
	date: Timestamp;
}

export interface MeasurementsContextType {
	measurements: MeasurementData[];
	fetchMeasurements: () => Promise<void>;
	createMeasurement: (
		weight: string | number,
		height: string | number,
		bodyFat?: string | number
	) => Promise<string>;
	deleteMeasurement: (id: string) => Promise<void>;
}

export const MeasurementProvider = ({ children }: { children: ReactNode }) => {
	const [measurements, setMeasurements] = useState<MeasurementData[]>([]);

	const fetchMeasurements = async () => {
		const measurementsQuery = query(collection(db, "measurements"));

		const snapshotOfMeasurements = await getDocs(measurementsQuery);

		const measurementList = snapshotOfMeasurements.docs.map((doc) => ({
			id: doc.id,
			weight: doc.data().weight,
			height: doc.data().height,
			bodyFat: doc.data().bodyFat,
			date: doc.data().date,
		}));

		setMeasurements(
			measurementList.sort((a, b) => b.date.toMillis() - a.date.toMillis())
		);
	};

	const createMeasurement = async (
		weight: string | number,
		height: string | number,
		bodyFat?: string | number
	): Promise<string> => {
		if (weight === undefined && height === undefined && bodyFat === undefined) {
			throw new Error(
				"At least one measurement value (weight, height, or bodyFat) must be provided."
			);
		}

		const newMeasurement = {
			weight,
			height,
			bodyFat,
			date: Timestamp.fromDate(new Date()),
		};

		try {
			const docRef = await addDoc(
				collection(db, "measurements"),
				newMeasurement
			);
			setMeasurements((prev) => [
				{ id: docRef.id, ...newMeasurement },
				...prev,
			]);
			console.log("Measurement created with ID: ", docRef.id);
			return docRef.id;
		} catch (error) {
			throw new Error("Error adding measurement");
		}
	};

	const deleteMeasurement = async (id: string) => {
		try {
			await deleteDoc(doc(db, "measurements", id));
			setMeasurements((prev) =>
				prev.filter((measurement) => measurement.id !== id)
			);
		} catch (error) {
			throw new Error("Error deleting measurement");
		}
	};

	return (
		<MeasurementsContext.Provider
			value={{
				measurements,
				fetchMeasurements,
				createMeasurement,
				deleteMeasurement,
			}}
		>
			{children}
		</MeasurementsContext.Provider>
	);
};
