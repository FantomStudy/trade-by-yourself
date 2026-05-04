export type AuthScreen = "login" | "recover" | "register" | "verify-code";

export interface AuthScreenProps {
  onChangeScreen: (screen: AuthScreen) => void;
  onClose: () => void;
  phoneNumber?: string;
  onPhoneNumberChange?: (phoneNumber: string) => void;
  /** После регистрации/подтверждения: сессия уже в cookie — закрываем диалог и обновляем юзера */
  onAuthComplete?: () => void;
}

export interface AuthFormProps {
  onSuccess: () => void;
}
