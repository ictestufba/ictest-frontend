import { User } from "./user";

export type Project = {
  id: string;
  name: string;
  code: string;
  description: null;
  visibility: "private" | "public";
  member_access: "add_all";
  created_at: string;
  updated_at: string;
  members: User[];
};
