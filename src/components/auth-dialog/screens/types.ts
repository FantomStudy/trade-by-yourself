export type AuthScreen = "login" | "recover" | "register" | "verify-code";

export interface AuthScreenProps {
  onChangeScreen: (screen: AuthScreen) => void;
  onClose: () => void;
}

export interface AuthFormProps {
  onSuccess: () => void;
}
