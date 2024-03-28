"use client";

import { Spin, Tabs } from "antd";
import { useState } from "react";
import { Board } from "../../../components/board";
import { CustomTitle } from "../../../components/title";
import { useProject } from "./hooks/useProject";
import { useTestCases } from "./hooks/useTestCases";
import styles from "./styles.module.css";

import { Members } from "@/app/(public)/components/members";
import { CreateCaseModal } from "@/app/(public)/components/modal/case/create";
import { EditCaseModal } from "@/app/(public)/components/modal/case/edit";
import { TestCase } from "@/types/models";
import { useUsers } from "./hooks/useUsers";

export default function Case({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<"test-cases" | "users">();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [testCaseToEdit, setTestCaseToEdit] = useState<TestCase>();
  const {project, isLoading: isProjectLoading} = useProject(params.id);
  const {testCases, isLoading: isCasesLoading, mutate } = useTestCases(params.id);
  const getCasesByStatus = (status: TestCase["status"]) => {
    const filtered = testCases?.filter(testCase => testCase?.status === status) ?? [];
    return filtered
      ?.sort((a, b) => b.title.localeCompare(a.title))
      ?.sort((a, b) => {
        if (!b.deadline) return -1;
        if (!a.deadline) return 1;
        const aDate = new Date(a.deadline)
        const bDate = new Date(b.deadline)

        return aDate.getTime() - bDate.getTime();
      })
      ?.sort((a, b) => {
        const priorities = ["high", "medium", "low", "not_set"];
        const indexB = priorities.indexOf(b.priority) + 1;
        const indexA = priorities.indexOf(a.priority) + 1;

        return indexA - indexB;
      });
  }

  const {data:users, mutate:mutateUsers} = useUsers(email, project?.members?.map(member=>member.user_id) ?? [])

  const handleEmailChange = (newValue: string) => {
    setEmail(newValue);
    mutateUsers();
  };

  const showCreateDrawer = () => {
    setOpenCreate(true);
  };

  const onCloseCreate = () => {
    setOpenCreate(false);
  };

  const showEditDrawer = (testCase:TestCase) => {
    setOpenEdit(true);
    setTestCaseToEdit(testCase);
  }

  return (
    <div className={styles.container}>
      { openEdit && testCaseToEdit  && (
        <EditCaseModal
          onCancel={() => setOpenEdit(false)}
          onOk={() => {
            setOpenEdit(false);
            setTestCaseToEdit(undefined);
            mutate();
          }}
          open={openEdit}
          testCase={testCaseToEdit}
        />
      )}
      { openCreate && 
        (
          <CreateCaseModal
            projectId={params.id}
            onSubmit={() => {
              onCloseCreate();
            }}
            onClose={onCloseCreate}
            open={openCreate}
          />
        )
      }
      {
        (isProjectLoading || isCasesLoading) ? (
          <div className={styles.spinContainer}>
            <Spin size="large"/>
          </div>
        ): (
          <>
            <CustomTitle text={project?.name!} divider newBtn onClick={showCreateDrawer} projectId={params.id}/>
            <Tabs
              className={styles.tabsContainer}
              defaultActiveKey={"test-cases"}
              activeKey={activeTab}
              tabBarStyle={
                {
                  marginLeft:50
                }
              }
              items={[
                {
                  key: "test-cases",
                  children: (
                    <Board projectId={params.id} onCardClick={showEditDrawer} initialCases={{
                      "open": getCasesByStatus("open"),
                      "in_progress": getCasesByStatus("in_progress"),
                      "error": getCasesByStatus("error"),
                      "success": getCasesByStatus("success")
                    }}/>
                  ),
                  label: "Board",
                  
                },
                {
                  key: "users",
                  children: <Members projectId={params.id} usersOptions={users ?? []} handleEmailChange={handleEmailChange} email={email}/>,
                  label: "Membros",
                },
              ]}
              onChange={(key) => setActiveTab(key as "test-cases" | "users")}
            />
          </>
        )
      }
       
    </div>
  );
}
