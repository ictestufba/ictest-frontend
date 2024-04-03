import { api } from "@/lib/api";
import { User } from "@/types/models";
import useSwr from "swr";


export function useUsers(email: string, filterIds:string[] = []) {
  const { data, isLoading, mutate } = useSwr<User[]>(
    `/users`,
    async () => {
      const response = await api.get<{
        users: User[];
      }>(`/users`,{
        params:{
          email
        }
      });
      return response.data.users;
    }
  );

  let filteredData = data;
  
  if (!isLoading && filterIds.length > 0) {
    filteredData = data?.filter((user) => {
      return !filterIds.includes(user.id);
    });
  }
  
  return {
    data:filteredData,
    isLoading,
    mutate,
    isAdmin: true,
  };
}
