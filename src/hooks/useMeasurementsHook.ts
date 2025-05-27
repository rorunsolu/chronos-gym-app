import { createContext, useContext } from "react";

import { type MeasurementsContextType } from "@/contexts/MeasurementContext";

export const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);


export const useMeasurementsHook = () => {
    const context = useContext(MeasurementsContext);
    if (context === undefined) {
        throw new Error("useMeasurementsHook must be used within a MeasurementsProvider");
    }
    return context;
};