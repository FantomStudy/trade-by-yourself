export type AuthScreen = "login" | "recover" | "register";

export interface AuthScreenProps {
  onChangeScreen: (screen: AuthScreen) => void;
  onClose: () => void;
}

export interface AuthFormProps {
  onSuccess: () => void;
}
