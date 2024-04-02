export type User = {
  email: string;
  name: string;
  id: string;
  role: "admin" | "member";
  user_id: string;
  user?: User;
};
