import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { User } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";
import { useRouter } from "next/navigation";
import useSwr from "swr";


export function useMembers(projectId: string | null) {
  const router = useRouter();

  const token = getToken();
  if (!token){
    router.push('/login')
  } 

  const currentUserData = parseJWT(token!);
  const currentUserId = currentUserData.sub;

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
    currentUserId,
    isLoading,
    mutate,
    isAdmin: true,
  };
}
