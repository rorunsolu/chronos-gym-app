import { createContext, useContext } from "react";
import { type AccountContextType } from "@/contexts/AccountContext";

export const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccountsHook = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error("useAccountsHook must be used within an AccountProvider");
    }
    return context;
};