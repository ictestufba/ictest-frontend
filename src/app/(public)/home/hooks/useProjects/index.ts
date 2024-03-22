import { api } from "@/lib/api";
import { Project } from "@/types/models";
import useSwr from "swr";


type GetProjectsResponse = {
  projects: Project[];
}

export function useProjects(isValidFlow:boolean) {
  const { data: dataProjects, isLoading: isProjectsLoading, mutate } = useSwr(isValidFlow && `/projects`, async () => {
    const response = await api.get<GetProjectsResponse>("/projects");

    return response.data.projects;
  });

  const projects = dataProjects ?? [];



  return {
    projects,
    userProjects: projects,
    isLoading: false,
    mutate,
    error: null,
  };
}

