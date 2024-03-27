import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project, User } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useSwr from "swr";


export function useMembers(projectId: string | null) {
  const router = useRouter();

  const { data: project } = useSwr<Project>(`/projects/${projectId}`);

  const members = project?.members;

  const currentUser = useMemo(() => {
    const token = getToken();
    if (!token){
      router.push('/login')

      return;
    };

    const currentUserData = parseJWT(token);
    const currentUserId = currentUserData.sub;

    const member = members?.find((member) => member.user_id === currentUserId);

    return member;
  }, [members, router]);

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
    currentUserId: currentUser?.user_id,
    isLoading,
    mutate,
    isAdmin,
  };
}
