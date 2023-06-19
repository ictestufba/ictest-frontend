import { api } from "@/lib/api";
import { User } from "@/types/models";
import useSwr from "swr";

export function useMembers(projectId: string) {
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
  };
}
