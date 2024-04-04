"use client";

import { Project } from "@/types/models";
import { mapProjectStatus } from "@/utils/mapProjectStatus";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ModelCard } from "../components/card/model";
import { CreateProjectModal } from "../components/modal/project";
import { SearchBar } from "../components/search";
import { ProjectDataType, TableList } from "../components/table";
import { useProjects } from "./hooks";
import styles from "./styles.module.css";
import emptyImg from "./techny-kanban-board-on-tablet.gif";
import { NavbarCtx } from "./template";


export default function Home() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [allProjectsSearchString, setAllProjectsSearchString] = useState("");
  const [myProjectsSearchString, setMyProjectsSearchString] = useState("");
  let { selectedOption } = useContext(NavbarCtx);
  const router = useRouter();

  const { projects, userProjects, isLoading: projectIsLoading } = useProjects();
  const isLoading = projectIsLoading;
  const isMyProjectsOption = selectedOption === "my-projects" 
  const redirect = (id:string) => {
    setIsPageLoading(true);
    return router.push(`/home/projects/${id}`)
  }

  useEffect(() => {
    setAllProjectsSearchString("");
    setMyProjectsSearchString("");
  }, [selectedOption])


  const showCreateDrawer = () => {
    setOpenCreate(true);
  };

  const onCloseCreate = () => {
    setOpenCreate(false);
  };

  const openCreateModal = () => {
    return <>
      {openCreate && (
        <CreateProjectModal
          open={openCreate}
          onClose={onCloseCreate}
          onSubmit={onCloseCreate}
          setIsLoading={setIsPageLoading}
        />
      )}
    </>
  }
  return (
    <Spin spinning={isPageLoading} tip="carregando...">
    <div className={styles.container}>
      {openCreate && openCreateModal()}
      {
        isMyProjectsOption ? (
          <>
            <div className={styles.myProjectsSearchContainer}>
              <SearchBar placeholder="Filtre pelo nome..." onChange={(e)=>{
                  setMyProjectsSearchString(e.target.value);
              }}/>
              <Button onClick={showCreateDrawer} className={styles.buttonContainer}type="primary" shape="round" icon={<PlusCircleOutlined />}>Criar Projeto</Button>
            </div>
            <div className={styles.cardContainer}>
              {
                !isLoading ? (
                  userProjects.length > 0 ? (
                    userProjects.filter(item=>item.name.toLowerCase().includes(myProjectsSearchString.toLowerCase())).map(project =>(
                      <ModelCard 
                        key={project.id}
                        id={project.id} 
                        title={project.name} 
                        description={`Responsável: ${project.members.find(member=>member.role === "admin")?.name ?? "Desconhecido"}`}
                        bottomText={`Número de casos: ${project?.test_cases?.length ?? 0}`} 
                        onClick={()=>redirect(project.id)}
                        status={mapProjectStatus(project?.test_cases ?? [])}
                      />
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <Image src={emptyImg.src} alt="" width={300} height={300} className={styles.image}/>
                    </div>
                  )
                ) : (
                  <div className={styles.spinContainer}>
                    <Spin size="large"/>
                  </div>
                )
              }
            </div>
          </>
        ): (
          <>
            <div className={styles.bottomContainer}>
              {
                !isLoading ? (
                  <>
                    <div className={styles.searchContainer}>
                      <SearchBar placeholder="Filtre pelo nome..." onChange={(e)=>{
                          setAllProjectsSearchString(e.target.value);
                      }}/>
                      <Button onClick={showCreateDrawer} className={styles.buttonContainer}type="primary" shape="round" icon={<PlusCircleOutlined />}>Criar Projeto</Button>
                    </div>
                    <TableList 
                      data={mapProjectsToProjectsDataType(projects, allProjectsSearchString) } 
                      pagination={{position: ["bottomCenter"], responsive: true, pageSize:12}} 
                      onChange={()=>console.log("changed")}
                      onRowClick={redirect}
                    />
                  </>
                ): (
                  <div className={styles.spinContainer}>
                    <Spin size="large"/>
                  </div>
                )
              }
            </div>
          </>
        )
      } 
    </div>
    </Spin>
  );
}

function mapProjectsToProjectsDataType(projects: Project[], searchString: string): ProjectDataType[] {
  return projects.filter(item=>item.name.toLowerCase().includes(searchString.toLowerCase())).map(project=>{
    const responsible = project?.members?.find(member=>member.role === "admin");

    return {
      key: project.id,
      name: project.name,
      code: project.code,
      status: mapProjectStatus(project?.test_cases ?? []),
      responsible: responsible?.name ?? "Desconhecido"
    }
  });
}