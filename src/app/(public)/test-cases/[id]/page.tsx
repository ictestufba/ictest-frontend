"use client";

import React, { useState } from "react";
import useSwr from "swr";
import { DeleteFilled } from "@ant-design/icons";
import {
  MenuProps,
  RadioChangeEvent,
  DatePickerProps,
  UploadProps,
  Spin,
  Tabs,
} from "antd";
import { Layout, Button, Modal, message } from "antd";

import { Project } from "@/types/models";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Members, TestCases } from "./components";

import styles from "./page.module.css";
import { useMembers } from "./hooks";

const { Content } = Layout;

const onChangeSeverity = (e: RadioChangeEvent) => {
  console.log(`radio checked:${e.target.value}`);
};

const onChangePriority = (e: RadioChangeEvent) => {
  console.log(`radio checked:${e.target.value}`);
};

const onChangeDeadline: DatePickerProps["onChange"] = (date, dateString) => {
  console.log(date, dateString);
};

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

export default function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const projectId = params.id;

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"test-cases" | "users">();

  const [messageApi, contextHolder] = message.useMessage();

  const { isAdmin } = useMembers(projectId);

  const successCreate = () => {
    messageApi.open({
      type: "success",
      content: "Caso de teste criado com sucesso",
    });
  };

  const errorCreate = () => {
    messageApi.open({
      type: "error",
      content: "Ocorreu algum erro na criação do caso de teste",
    });
  };

  const successEdit = () => {
    messageApi.open({
      type: "success",
      content: "Caso de teste editado com sucesso",
    });
  };

  const errorEdit = () => {
    messageApi.open({
      type: "error",
      content: "Ocorreu algum erro na edição do caso de teste",
    });
  };

  // const onCloseCreate = () => {
  //   setOpenCreate(false);
  // };

  const warningDeleteTestCase = () => {
    Modal.warning({
      title: "Tem certeza que deseja deletar o caso de teste?",
      content: "Não será possível recuperar este caso de teste.",
    });
  };

  const onMenuClick: MenuProps["onClick"] = (e) => {
    warningDeleteTestCase();
  };

  const { data: project, isLoading: projectIsLoading } = useSwr<Project>(
    `/project/${projectId}`,
    async () => {
      const response = await api.get<{ project: Project }>(
        `/projects/${projectId}`
      );

      return response.data.project;
    }
  );

  if (projectIsLoading) return <Spin />;

  function renderCreatedAt() {
    if (!project?.created_at) return null;

    return format(new Date(project.created_at), "dd/MM/yyyy HH:mm");
  }

  async function handleDeleteProject() {
    await api.delete(`/projects/${projectId}`);
    router.replace("/test-cases");
  }

  return (
    <>
      {contextHolder}

      <h2>
        {project?.name}{" "}
        <Button danger onClick={handleDeleteProject}>
          <DeleteFilled />
        </Button>
      </h2>
      <p>{project?.description}</p>
      <div className={styles.contentContainerHeader}>
        <p className={styles.secondaryText}>Criado em {renderCreatedAt()}</p>
      </div>

      <Content
        style={{
          padding: 0,
          margin: 0,
          minHeight: 280,
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Tabs
          defaultActiveKey={"test-cases"}
          activeKey={activeTab}
          items={[
            {
              key: "test-cases",
              children: (
                <TestCases
                  projectId={projectId}
                  onCreateError={errorCreate}
                  onCreateSuccess={successCreate}
                  onEditError={errorEdit}
                  onEditSuccess={successEdit}
                />
              ),
              label: "Casos de teste",
            },
            {
              key: "users",
              children: <Members projectId={projectId} />,
              label: "Membros",
              disabled: !isAdmin,
            },
          ]}
          onChange={(key) => setActiveTab(key as "test-cases" | "users")}
        />
      </Content>
    </>
  );
}
