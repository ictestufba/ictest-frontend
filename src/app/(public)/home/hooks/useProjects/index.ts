'use client'

import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";

import useSwr from "swr";

type GetProjectsResponse = {
  projects: Project[];
}

export function useProjects() {
  const { data: dataProjects, isLoading: isProjectsLoading, mutate } = useSwr(`/projects`, async () => {
    const response = await api.get<GetProjectsResponse>("/projects");

    const filledProjects = response.data.projects.map(project=>{
      project.members = project.members.map(member=>{
        member.name = member.user!.name;
        member.id = member.user!.id;
        member.email = member.user!.email;

        return member
      })
      return project
    })
    return filledProjects;
  });

  const projects = dataProjects ?? [];

  let userProjects: Project[] = [];
  const token = getToken();
  if (token){

    const currentUserData = parseJWT(token!);
    const currentUserId = currentUserData.sub;

    userProjects = projects.filter(project => project?.members?.some(member => member.user_id === currentUserId));
  };

  return {
    projects,
    userProjects,
    isLoading: isProjectsLoading,
    mutate,
    error: null,
  };
}

