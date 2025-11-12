export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileType: "INDIVIDUAL" | "OOO";
}

export type CurrentUser = Omit<User, "email">;
