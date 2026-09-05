export interface Log {
  action: string;
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  user?: {
    email?: string;
    fullName: string;
    id: number;
  };
}
