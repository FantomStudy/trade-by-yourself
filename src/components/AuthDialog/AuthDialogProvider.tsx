import { createContext, use, useState } from "react";
import { AuthDialog } from "./auth-dialog";

const AuthDialogContext = createContext<{ open: () => void } | null>(null);

export const AuthDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthDialogContext value={{ open: () => setIsOpen(true) }}>
      {children}
      <AuthDialog open={isOpen} onOpenChange={setIsOpen} />
    </AuthDialogContext>
  );
};

export const useAuthDialog = () => {
  const context = use(AuthDialogContext);

  if (!context) {
    throw new Error("useAuthDialog must be used within AuthDialogProvider");
  }

  return context;
};
