import { User } from "./user";

export type Team = {
  id: string;
  name: string;
  department: string;
  member_access: "add_all";
  created_at: string;
  updated_at: string;
  members: User[];
  owner: User;
};
