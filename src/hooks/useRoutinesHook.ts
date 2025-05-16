import { createContext, useContext } from "react";
import { type RoutinesContextType } from "@/contexts/RoutineContext";

export const RoutinesContext = createContext<RoutinesContextType | undefined>(undefined);

export const useRoutinesHook = () => {
    const context = useContext(RoutinesContext);
    if (context === undefined) {
        throw new Error("useRoutinesHook must be used within an RoutinesProvider");
    }
    return context;
};