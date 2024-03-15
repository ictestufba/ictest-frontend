import { api } from "@/lib/api";
import { Project } from "@/types/models";
import useSwr from "swr";


const mockResponse: GetProjectsResponse = {
  projects: [
    // // Generate 5 Projects type
    // {
    //   id: "1",
    //   name: "Project 1",
    //   code: "P1",
    //   created_at: "2021-09-14T20:00:00Z",
    //   updated_at: "2021-09-14T20:00:00Z",
    //   visibility: "public",
    //   member_access: "add_all",
    //   description:null,
    //   members: [
    //     {
    //       id: "1",
    //       name: "User 1",
    //       email: "user@example.com",
    //       role: "admin",
    //     },
    //     {
    //       id: "2",
    //       name: "User 2",
    //       email: "user@example.com",
    //       role: "member",
    //     },
    //   ],
    // },
    // {
    //   id: "2",
    //   name: "Project 2",
    //   code: "P2",
    //   created_at: "2021-09-14T20:00:00Z",
    //   updated_at: "2021-09-14T20:00:00Z",
    //   visibility: "public",
    //   member_access: "add_all",
    //   description:null,
    //   members: [
    //     {
    //       id: "1",
    //       name: "User 1",
    //       email: "user@example.com",
    //       role: "admin",
    //     },
    //     {
    //       id: "2",
    //       name: "User 2",
    //       email: "user@example.com",
    //       role: "member",
    //     },
    //   ],
    // },
    // {
    //   id: "3",
    //   name: "Project 3",
    //   code: "P3",
    //   created_at: "2021-09-14T20:00:00Z",
    //   updated_at: "2021-09-14T20:00:00Z",
    //   visibility: "public",
    //   member_access: "add_all",
    //   description:null,
    //   members: [
    //     {
    //       id: "1",
    //       name: "User 1",
    //       email: "user@example.com",
    //       role: "admin",
    //     },
    //     {
    //       id: "2",
    //       name: "User 2",
    //       email: "user@example.com",
    //       role: "member",
    //     },
    //   ],
    // },
    // {
    //   id: "4",
    //   name: "Project 4",
    //   code: "P4",
    //   created_at: "2021-09-14T20:00:00Z",
    //   updated_at: "2021-09-14T20:00:00Z",
    //   visibility: "public",
    //   member_access: "add_all",
    //   description:null,
    //   members: [
    //     {
    //       id: "1",
    //       name: "User 1",
    //       email: "user@example.com",
    //       role: "admin",
    //     },
    //     {
    //       id: "2",
    //       name: "User 2",
    //       email: "user@example.com",
    //       role: "member",
    //     },
    //   ],
    // },
    // {
    //   id: "5",
    //   name: "Project 5",
    //   code: "P5",
    //   created_at: "2021-09-14T20:00:00Z",
    //   updated_at: "2021-09-14T20:00:00Z",
    //   visibility: "public",
    //   member_access: "add_all",
    //   description:null,
    //   members: [
    //     {
    //       id: "1",
    //       name: "User 1",
    //       email: "user@example.com",
    //       role: "admin",
    //     },
    //     {
    //       id: "2",
    //       name: "User 2",
    //       email: "user@example.com",
    //       role: "member",
    //     },
    //   ],
    // },
    // {
    //   id: "6",
    //   name: "Project 6",
    //   code: "P6",
    //   created_at: "2021-09-14T20:00:00Z",
    //   updated_at: "2021-09-14T20:00:00Z",
    //   visibility: "public",
    //   member_access: "add_all",
    //   description:null,
    //   members: [
    //     {
    //       id: "1",
    //       name: "User 1",
    //       email: "user@example.com",
    //       role: "admin",
    //     },
    //     {
    //       id: "2",
    //       name: "User 2",
    //       email: "user@example.com",
    //       role: "member",
    //     },
    //   ],
    // }
  ]
}

type GetProjectsResponse = {
  projects: Project[];
}

export function useProjects(isValidFlow:boolean) {
  const { data: dataProjects, mutate } = useSwr(isValidFlow && `/projects`, async () => {
    const response = await api.get<GetProjectsResponse>("/projects");

    return response.data.projects;
  });

  const projects = dataProjects ?? [];

  return {
    projects,
    userProjects: mockResponse.projects,
    isLoading: false,
    mutate,
    error: null,
  };
}

