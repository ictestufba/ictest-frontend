import { api } from "@/lib/api";
import { Project } from "@/types/models";
import useSwr from "swr";

export function useProject(projectId: string) {
  const { data: project, isLoading, mutate } = useSwr<Project>(
    `/projects/${projectId}`,
    async () => {
      const response = await api.get<{ project: Project }>(
        `/projects/${projectId}`
      );

      return response.data.project;
    }
  );

  return {
    project,
    isLoading,
    mutate
  };
}

