export interface Log {
  action: string;
  id: number;
  userId: number;
  user?: {
    email?: string;
    fullName: string;
    id: number;
  };
}
