import { createContext, useContext } from "react";
import { type SessionHistoryContextType } from "@/contexts/SessionHistoryContext";

export const SessionHistoryContext = createContext<SessionHistoryContextType | undefined>(undefined);

export const useSessionHistoryHook = () => {
    const context = useContext(SessionHistoryContext);
    if (context === undefined) {
        throw new Error("useSessionHistoryHook must be used within an SessionHistoryProvider");
    }
    return context;
};