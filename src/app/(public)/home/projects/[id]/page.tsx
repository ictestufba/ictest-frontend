"use client";

import { Spin } from "antd";
import { useState } from "react";
import { Board } from "../../../components/board";
import { CustomTitle } from "../../../components/title";
import { useProject } from "./hooks/useProject";
import { useTestCases } from "./hooks/useTestCases";
import styles from "./styles.module.css";

import { CreateCaseModal } from "@/app/(public)/components/modal/case/create";
import { TestCase } from "@/types/models";

export default function Case({
  params,
}: {
  params: { id: string };
}) {

  const [openCreate, setOpenCreate] = useState(false);
  const {project, isLoading: isProjectLoading} = useProject(params.id);
  const {testCases, isLoading: isCasesLoading, mutate} = useTestCases(params.id);
  const getCasesByStatus = (status: TestCase["status"]) => {
    return testCases?.filter(testCase => testCase?.status === status) ?? [];
  }

  const showCreateDrawer = () => {
    setOpenCreate(true);
  };

  const onCloseCreate = () => {
    setOpenCreate(false);
  };

  return (
    <div className={styles.container}>
      { openCreate && 
        (
          <CreateCaseModal
            projectId={params.id}
            onSubmit={() => {
              onCloseCreate();
              // onCreateSuccess();
            }}
            // onError={onCreateError}
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
            <CustomTitle text={project?.name!} divider newBtn onClick={showCreateDrawer}/>
            <Board initialCases={{
              "open": getCasesByStatus("open"),
              "in_progress": getCasesByStatus("in_progress"),
              "error": getCasesByStatus("error"),
              "success": getCasesByStatus("success")
            }}></Board>
          </>
        )
      }
    </div>
  );
}
