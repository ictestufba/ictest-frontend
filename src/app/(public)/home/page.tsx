"use client";

import { Project } from "@/types/models";
import { Team } from "@/types/models/team";
import { Spin } from "antd";
import Image from "next/image";
import { useContext, useState } from "react";
import { ModelCard } from "../components/card/model";
import { SearchBar } from "../components/search";
import { ProjectDataType, TableList, TeamDataType } from "../components/table";
import { CustomTitle } from "../components/title";
import { useProjects, useTeams } from "./hooks";
import styles from "./styles.module.css";
import emptyImg from "./techny-kanban-board-on-tablet.gif";
import { NavbarCtx } from "./template";


export default function Home() {
  const [searchString, setSearchString] = useState("");
  let { selectedOption } = useContext(NavbarCtx);

  let { teams, userTeams, isLoading: teamIsLoading } = useTeams(selectedOption === "teams");
  const { projects, userProjects, isLoading: projectIsLoading } = useProjects(selectedOption === "projects");
  const isLoading = (selectedOption === "teams" && teamIsLoading) || (selectedOption === "projects" && projectIsLoading)
  const isTeamOption = selectedOption === "teams";


  const title = isTeamOption ? "Times" : "Projetos";
  return (
    <div className={styles.container}>
      <CustomTitle text={`Meus ${title}`} divider newBtn/>
      <div className={styles.cardContainer}>
        {
          !isLoading ? (
            isTeamOption ?
            <>
            {
              useTeams.length > 0 ? (
                userTeams.map(teams =>(
                  <ModelCard 
                    key={teams.id}
                    id={teams.id} 
                    title={teams.name} 
                    description={`Responsável: ${teams.owner.name}`} 
                    bottomText={`Número de membros: ${teams.members.length}`} 
                    onClick={()=>console.log("clicked")}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Image src={emptyImg.src} alt="" width={300} height={300} className={styles.image}/>
                </div>
              )
            }
            </> : 
            <>
              {
                userProjects.length > 0 ? (
                  userProjects.map(project =>(
                    <ModelCard 
                      key={project.id}
                      id={project.id} 
                      title={project.name} 
                      description={`Responsável: ${project.members[0].name}`} 
                      bottomText={`Número de casos: ${project.members.length}`} 
                      onClick={()=>console.log("clicked")}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <Image src={emptyImg.src} alt="" width={300} height={300} className={styles.image}/>
                  </div>
                )
              }
            </>
          ) : (
            <div className={styles.spinContainer}>
              <Spin size="large"/>
            </div>
          )
        }
      </div>
      <CustomTitle text={title} />
      <div className={styles.bottomContainer}>
        {
          !isLoading ? (
            <>
            <div className={styles.searchContainer}>
              <SearchBar placeholder="Filtre pelo nome..." onChange={(e)=>{
                  setSearchString(e.target.value);
              }}/>
            </div>
            <TableList columnType={selectedOption} data={isTeamOption ? mapTeamsToTeamsDataType(teams, searchString): mapProjectsToProjectsDataType(projects, searchString) } pagination={{position: ["bottomCenter"], responsive: true}} onChange={()=>console.log("FOI")} />
            </>
          ): (
            <div className={styles.spinContainer}>
              <Spin size="large"/>
            </div>
          )
        }
      </div>
    </div>
  );
}

function mapTeamsToTeamsDataType(teams: Team[], searchString: string): TeamDataType[] {
  return teams.filter(item=>item.name.toLowerCase().includes(searchString.toLowerCase())).map(team=>({
    key: team.id,
    name: team.name,
    department: team.department,
    members: team.members.length,
    responsible: team.owner.name,
  }));
}

function mapProjectsToProjectsDataType(projects: Project[], searchString: string): ProjectDataType[] {
  return projects.filter(item=>item.name.toLowerCase().includes(searchString.toLowerCase())).map(project=>({
    key: project.id,
    name: project.name,
    code: project.code,
    status: "created",
    responsible: "responsible 1"
  }));
}