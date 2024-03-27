"use client";

import { api } from "@/lib/api";
import { TestCase } from "@/types/models";
import { Button, Col, Form, Input, Row, Spin } from "antd";
import { useMemo, useState } from "react";
import useSwr, { useSWRConfig } from "swr";
import styles from "./page.module.css";

const { Search } = Input;

import { CreateModal } from "../create-modal";
import { EditModal } from "../edit-modal";
import { TestCaseCard } from "../test-case-card";
import { TestCasesProps } from "./types";

import emptyImg from "./techny-searching-the-web-on-tablet.gif";

export function TestCases(props: TestCasesProps) {
  const {
    projectId,
    onEditError,
    onEditSuccess,
    onCreateError,
    onCreateSuccess,
  } = props;

  const { mutate: globalMutate } = useSWRConfig();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [form] = Form.useForm();

  const {
    data: testCases,
    isLoading: testCasesIsLoading,
    mutate,
  } = useSwr<TestCase[]>(`/project/${projectId}/test-cases`, async () => {
    const response = await api.get<{ testCases: TestCase[] }>(
      `/projects/${projectId}/test-cases`
    );

    return response.data.testCases;
  });

  const filterdTestCases = useMemo(() => {
    const sortedTestCases = testCases
      ?.sort((a, b) => b.title.localeCompare(a.title))
      ?.sort((a, b) => {
        const priorities = ["high", "medium", "low", "not_set"];
        const indexB = priorities.indexOf(b.priority);
        const indexA = priorities.indexOf(a.priority);

        return `${indexB}`.localeCompare(`${indexA}`);
      })
      ?.sort((a, b) => {
        if (!b.deadline) return -1;
        if (!a.deadline) return 1;

        return b.deadline.localeCompare(a.deadline);
      });
    if (!searchTerm) return sortedTestCases;

    return sortedTestCases?.filter((testCase) =>
      testCase.title.toUpperCase().includes(searchTerm.trim().toUpperCase())
    );
  }, [searchTerm, testCases]);

  function handleTestCaseCardClick(testCaseId: string) {
    setSelectedTestCaseId(testCaseId);
    setOpenEdit(true);
  }

  function renderTestCases() {
    if (!testCases) return <Spin />;

    if (!testCases.length)
      return (
        <Col md={24} xs={24} lg={24}>
          <div className={styles.emptyState}>
            Nenhum caso de teste cadastrado ainda, experimente criar o primeiro
            caso de teste!
            {/* <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid slice",
                },
              }}
              height={400}
              width={400}
            /> */}
            <img src={emptyImg.src} alt="" />
          </div>
        </Col>
      );

    if (!filterdTestCases?.length)
      return <Col span={12}>Nenhum caso de teste encontrado</Col>;

    return filterdTestCases?.map((testCase) => (
      <Col span={8} key={testCase.id}>
        <TestCaseCard onClick={handleTestCaseCardClick} testCase={testCase} />
      </Col>
    ));
  }

  const selectedTestCase = testCases?.find(
    (testCase) => testCase.id === selectedTestCaseId
  );

  const showCreateDrawer = () => {
    setOpenCreate(true);
  };

  const onCloseCreate = () => {
    setOpenCreate(false);
  };

  if (testCasesIsLoading) return <Spin />;

  return (
    <>
      {openCreate ? (
        <CreateModal
          projectId={projectId}
          onSubmit={() => {
            onCloseCreate();
            mutate();
            globalMutate("/projects");
            onCreateSuccess();
          }}
          onError={onCreateError}
          onClose={onCloseCreate}
          open={openCreate}
        />
      ) : (
        <></>
      )}
      {openEdit && selectedTestCase ? (
        <EditModal
          onCancel={() => setOpenEdit(false)}
          onError={onEditError}
          onOk={() => {
            setOpenEdit(false);
            mutate();
            onEditSuccess();
          }}
          open={openEdit}
          testCase={selectedTestCase}
        />
      ) : (
        <></>
      )}
      {testCases && testCases.length > 0 && (
        <Search
          placeholder="Digite o título do caso de teste que deseja"
          enterButton
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
      <div className={styles.contentContainerHeader}>
        <h3>{testCases?.length ?? "-"} casos de teste disponíveis</h3>
        <Button onClick={showCreateDrawer} type="primary">
          Criar caso de teste
        </Button>
      </div>
      <Row gutter={16}>{renderTestCases()}</Row>
    </>
  );
}
