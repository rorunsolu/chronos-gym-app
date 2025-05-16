import { createContext, useContext } from "react";
import { type ExerciseContextType } from "@/contexts/ExerciseContext";

export const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const useExercisesHook = () => {
    const context = useContext(ExerciseContext);
    if (context === undefined) {
        throw new Error("useExercisesHook must be used within an ExerciseProvider");
    }
    return context;
};