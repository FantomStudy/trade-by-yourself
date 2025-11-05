export type AuthMode = "login" | "recover" | "register";

export interface AuthScreenProps {
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}
