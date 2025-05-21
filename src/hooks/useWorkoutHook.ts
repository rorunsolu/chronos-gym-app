import { createContext, useContext } from "react";
import { type WorkoutContextType } from "@/contexts/WorkoutContext";

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkOutHook = () => {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error("useWorkOutHook must be used within a WorkoutProvider");
    }
    return context;
};