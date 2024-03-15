import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project, User } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";
import { useMemo } from "react";
import useSwr from "swr";

export function useMembers(projectId: string) {
  const { data: project } = useSwr<Project>(`/project/${projectId}`);

  const members = project?.members;

  const currentUser = useMemo(() => {
    const token = getToken();
    if (!token) throw new Error();

    const currentUserData = parseJWT(token);
    const currentUserId = currentUserData.sub;
    const member = members?.find((member) => member.id === currentUserId);

    return member;
  }, [members]);

  const isAdmin = currentUser?.role === "admin";

  const { data, isLoading, mutate } = useSwr<User[]>(
    `/project/${projectId}/members`,
    async () => {
      const response = await api.get<{
        users: User[];
      }>(`/projects/${projectId}/members`);

      return response.data.users;
    }
  );

  return {
    data,
    isLoading,
    mutate,
    isAdmin: true,
  };
}
