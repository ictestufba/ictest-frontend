import { Team } from "@/types/models/team";


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
    teams: [] as Team[],
    userTeams: [] as Team[],
    isLoading: false,
    mutate: null,
    error: null,
  };
}


