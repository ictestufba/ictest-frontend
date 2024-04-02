import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project, User } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";
import { useMemo } from "react";
import useSwr from "swr";


export function useMembers(projectId: string | null) {
  const { data: project } = useSwr<Project>(projectId ? `/projects/${projectId}`: null);

  const members = project?.members;

  const currentUser = useMemo(() => {
    const token = getToken();
    if (!token){
      return;
    };

    const currentUserData = parseJWT(token);
    const currentUserId = currentUserData.sub;

    const member = members?.find((member) => member.user_id === currentUserId);

    return member;
  }, [members]);

  const isAdmin = currentUser?.role === "admin";

  const { data, isLoading, mutate } = useSwr<User[]>(
    projectId ? `/project/${projectId}/members` : null,
    async () => {
      const response = await api.get<{
        users: User[];
      }>(`/projects/${projectId}/members`);

      return response.data.users;
    }
  );

  return {
    data,
    currentUserId: currentUser?.user_id,
    isLoading,
    mutate,
    isAdmin,
    adminId: members?.find((member) => member.role === "admin")?.user_id,
  };
}
