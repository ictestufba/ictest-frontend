import { Team } from "@/types/models/team";

const mockResponse: GetTeamsResponse = {
  teams: [
    {
      id: "1",
      name: "Team 1",
      department: "Department 1",
      member_access: "add_all",
      created_at: "2021-09-14T20:00:00Z",
      updated_at: "2021-09-14T20:00:00Z",
      members: [
        {
          id: "1",
          name: "User 1",
          email: "user@example.com",
          role: "admin"
        },
        {
          id: "2",
          name: "User 2",
          email: "user2@example.com",
          role: "member"
        },
      ],
      owner: {
        id: "1",
        name: "User 1",
        email: "user@example.com",
        role: "admin"
      },
    },
    {
      id: "2",
      name: "Team 2",
      department: "Department 2",
      member_access: "add_all",
      created_at: "2021-09-14T20:00:00Z",
      updated_at: "2021-09-14T20:00:00Z",
      members: [
        {
          id: "1",
          name: "User 1",
          email: "user@example.com",
          role: "admin"
        },
        {
          id: "2",
          name: "User 2",
          email: "user2@example.com",
          role: "member"
        },
        {
          id: "3",
          name: "User 3",
          email: "user3@example.com",
          role: "member"
        },
      ],
      owner: {
        id: "1",
        name: "User 1",
        email: "user@example.com",
        role: "admin"
      },
    },
    {
      id: "3",
      name: "Team 3",
      department: "Department 3",
      member_access: "add_all",
      created_at: "2021-09-14T20:00:00Z",
      updated_at: "2021-09-14T20:00:00Z",
      members: [
        {
          id: "1",
          name: "User 1",
          email: "user@example.com",
          role: "admin"
        },
        {
          id: "2",
          name: "User 2",
          email: "user2@example.com",
          role: "member"
        },
      ],
      owner: {
        id: "1",
        name: "User 1",
        email: "user@example.com",
        role: "admin"
      },
    },
  ]
}

type GetTeamsResponse = {
  teams: Team[];
}

export function useTeams(isValidFlow:boolean) {
  // const { data: response, isLoading, mutate, error } = useSwr<GetTeamsResponse>(isValidFlow & `/teams`);

  // const teams = response?.teams;

  // const userTeams = useMemo(() => {
  //   const token = getToken();
  //   if (!token) throw new Error();

  //   const currentUserData = parseJWT(token);
  //   const currentUserId = currentUserData.sub;
  //   const userTeams = teams?.filter((team) => team.owner.id === currentUserId);

  //   return userTeams;
  // }, [teams]);


  return {
    teams: mockResponse.teams,
    userTeams: mockResponse.teams,
    isLoading: false,
    mutate: null,
    error: null,
  };
}


