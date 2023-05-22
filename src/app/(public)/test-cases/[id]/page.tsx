"use client";

import React, { useState } from "react";
import useSwr from "swr";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  ClockCircleOutlined,
  AntDesignOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  MenuProps,
  RadioChangeEvent,
  DatePickerProps,
  UploadProps,
  Spin,
} from "antd";
import {
  Breadcrumb,
  Layout,
  Menu,
  Card,
  Col,
  Row,
  Tag,
  Avatar,
  Pagination,
  Button,
  Tooltip,
  Input,
  Drawer,
  Form,
  Space,
  Select,
  Radio,
  DatePicker,
  Upload,
  Dropdown,
  Modal,
  message,
  theme,
} from "antd";
import styles from "./page.module.css";
import { Project, TestCase } from "@/types/models";
import { api } from "@/lib/api";
import { CreateModal, EditModal, TestCaseCard } from "./components";
import { format } from "date-fns";

const { Header, Content, Sider } = Layout;

const { Search } = Input;
const { Option } = Select;
const { Dragger } = Upload;

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

  const [openCreate, setOpenCreate] = useState(false);
  const [form] = Form.useForm();
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>();
  const [messageApi, contextHolder] = message.useMessage();

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

  const showCreateDrawer = () => {
    setOpenCreate(true);
  };

  const showEditModal = () => {
    setOpenEdit(true);
  };

  const onCloseCreate = () => {
    // if(success) {
    //   successCreate();
    // } else {
    //   errorCreate();
    // }

    setOpenCreate(false);
  };

  const warningDeleteTestCase = () => {
    Modal.warning({
      title: "Tem certeza que deseja deletar o caso de teste?",
      content: "Não será possível recuperar este caso de teste.",
    });
  };

  const items = [
    {
      key: "1",
      label: "Editar",
    },
    {
      key: "2",
      label: "Excluir",
    },
  ];

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

  if (projectIsLoading) return <Spin />;

  //   if(testCasesIsLoading)

  function handleTestCaseCardClick(testCaseId: string) {
    setSelectedTestCaseId(testCaseId);
    setOpenEdit(true);
  }

  function renderCreatedAt() {
    if (!project?.created_at) return null;

    return format(new Date(project.created_at), "dd/MM/yyyy");
  }

  function renderTestCases() {
    if (!testCases) return <Spin />;

    if (!testCases.length)
      return <Col span={12}>Nenhum caso de teste cadastrado ainda</Col>;

    return testCases.map((testCase) => (
      <Col span={8} key={testCase.id}>
        <TestCaseCard onClick={handleTestCaseCardClick} testCase={testCase} />
      </Col>
    ));
  }

  const selectedTestCase = testCases?.find(
    (testCase) => testCase.id === selectedTestCaseId
  );

  function handleCreateTestCase(payload: any) {
    console.log({ payload });
  }

  return (
    <>
      {contextHolder}
      {openCreate ? (
        <CreateModal
          projectId={projectId}
          onSubmit={() => {
            onCloseCreate();
            mutate();
          }}
          onClose={onCloseCreate}
          open={openCreate}
        />
      ) : (
        <></>
      )}
      {openEdit && selectedTestCase ? (
        <EditModal
          onCancel={() => setOpenEdit(false)}
          onOk={() => {
            setOpenEdit(false);
            mutate();
          }}
          open={openEdit}
          testCase={selectedTestCase}
        />
      ) : (
        <></>
      )}
      <h2>{project?.name}</h2>
      <p>{project?.description}</p>
      <div className={styles.contentContainerHeader}>
        <p className={styles.secondaryText}>Criado em {renderCreatedAt()}</p>
        {/* <Avatar.Group
          maxCount={3}
          maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
        >
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
          <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
          <Tooltip title="Ant User" placement="top">
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
            />
          </Tooltip>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<AntDesignOutlined />}
          />
        </Avatar.Group> */}
      </div>

      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <Search
          placeholder="Digite o título do caso de teste que deseja"
          enterButton
        />
        <div className={styles.contentContainerHeader}>
          <h3>{testCases?.length ?? "-"} casos de teste disponíveis</h3>
          <Button onClick={showCreateDrawer} type="primary">
            Criar caso de teste
          </Button>
        </div>
        <Row gutter={16}>
          {renderTestCases()}
          {/* {testCases?.map((testCase) => (
            <Col span={8} key={testCase.id}>
              <TestCaseCard testCase={testCase} />
            </Col>
          ))} */}
          {/* <Col span={8}> */}
          {/* <TestCaseCard testCase={} /> */}
          {/* <Card
              onClick={showEditModal}
              className={styles.successTestCard}
              bordered={false}
            >
              <div className={styles.testContent}>
                <div className={styles.statusContainer}>
                  <span className={styles.successStatus}></span>
                  <p>Sucesso</p>
                </div>
                <h3>Título do Caso</h3>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.{" "}
                </p>
                <div className={styles.tagsContainer}>
                  <Tag color="default">SPRINT 1</Tag>
                  <Tag icon={<ClockCircleOutlined />} color="success">
                    24 ABR
                  </Tag>
                </div>
                <div className={styles.footerCard}>
                  <p className={styles.secondaryText}>Criado por Fred Durão</p>
                  <div className={styles.assignContainer}>
                    <p className={styles.secondaryText}>Atribuído a </p>
                    <Avatar size="small" icon={<UserOutlined />} />
                  </div>
                </div>
              </div>
            </Card> */}
          {/* </Col> */}
          {/* <Col span={8}>
            <Card className={styles.failTestCard} bordered={false}>
              <div className={styles.testContent}>
                <div className={styles.statusContainer}>
                  <span className={styles.failStatus}></span>
                  <p>Falha</p>
                </div>
                <h3>Título do Caso</h3>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.{" "}
                </p>
                <div className={styles.tagsContainer}>
                  <Tag color="default">SPRINT 1</Tag>
                  <Tag icon={<ClockCircleOutlined />} color="default">
                    24 ABR
                  </Tag>
                </div>
                <div className={styles.footerCard}>
                  <p className={styles.secondaryText}>Criado por Fred Durão</p>
                  <div className={styles.assignContainer}>
                    <p className={styles.secondaryText}>Atribuído a </p>
                    <Avatar size="small" icon={<UserOutlined />} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className={styles.onProgressTestCard} bordered={false}>
              <div className={styles.testContent}>
                <div className={styles.statusContainer}>
                  <span className={styles.onProgressStatus}></span>
                  <p>Em progresso</p>
                </div>
                <h3>Título do Caso</h3>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.{" "}
                </p>
                <div className={styles.tagsContainer}>
                  <Tag color="default">SPRINT 1</Tag>
                  <Tag icon={<ClockCircleOutlined />} color="error">
                    24 ABR
                  </Tag>
                </div>
                <div className={styles.footerCard}>
                  <p className={styles.secondaryText}>Criado por Fred Durão</p>
                  <div className={styles.assignContainer}>
                    <p className={styles.secondaryText}>Atribuído a </p>
                    <Avatar size="small" icon={<UserOutlined />} />
                  </div>
                </div>
              </div>
            </Card>
          </Col> */}
        </Row>
        {/* <Row>
          <Col span={8}>
            <Card className={styles.openTestCard} bordered={false}>
              <div className={styles.testContent}>
                <div className={styles.statusContainer}>
                  <span className={styles.openStatus}></span>
                  <p>Aberto</p>
                </div>
                <h3>Título do Caso</h3>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.{" "}
                </p>
                <div className={styles.tagsContainer}>
                  <Tag color="default">SPRINT 1</Tag>
                  <Tag icon={<ClockCircleOutlined />} color="default">
                    24 ABR
                  </Tag>
                </div>
                <div className={styles.footerCard}>
                  <p className={styles.secondaryText}>Criado por Fred Durão</p>
                  <div className={styles.assignContainer}>
                    <p className={styles.secondaryText}>Atribuído a </p>
                    <Avatar size="small" icon={<UserOutlined />} />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row> */}
        {/* <Pagination
          style={{ alignSelf: "flex-end" }}
          defaultCurrent={1}
          total={50}
        /> */}
      </Content>
    </>
  );
}
