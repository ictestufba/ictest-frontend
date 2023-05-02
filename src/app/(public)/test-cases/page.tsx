"use client";

import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  ClockCircleOutlined,
  AntDesignOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type {
  MenuProps,
  RadioChangeEvent,
  DatePickerProps,
  UploadProps,
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

const { Header, Content, Sider } = Layout;

const { Search } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const items1: MenuProps["items"] = [
  LaptopOutlined,
  LaptopOutlined,
  LaptopOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `Projeto ${key}`,
    children: new Array(3).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;

      return {
        key: subKey,
        label: `Suite ${subKey}`,
        children: new Array(2).fill(null).map((_, j) => {
          const subSubKey = index * 4 + j + 1;

          return {
            key: subSubKey,
            label: `Caso de Teste ${subSubKey}`,
          };
        }),
      };
    }),
  };
});

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

export default function Home() {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
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

  return (
    <main>
      {contextHolder}
      {openCreate ? (
        <Drawer
          title="Criar caso de teste"
          onClose={onCloseCreate}
          open={openCreate}
          width={480}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark>
            <Form.Item
              name="title"
              label="Título"
              rules={[
                { required: true, message: "Digite o título de caso de teste" },
              ]}
            >
              <Input placeholder="Digite o título de caso de teste" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[
                {
                  required: true,
                  message: "Digite a descrição do caso de teste",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Digite a descrição do caso de teste"
              />
            </Form.Item>
            <Form.Item
              name="type"
              label="Tipo de teste"
              rules={[{ required: true, message: "Selecione o tipo de teste" }]}
            >
              <Select placeholder="Selecione o tipo de teste">
                <Option value="functional">Funcional</Option>
                <Option value="smoke">Smoke</Option>
                <Option value="regression">Regressão</Option>
                <Option value="security">Segurança</Option>
                <Option value="usability">Usabilidade</Option>
                <Option value="performance">Performace</Option>
                <Option value="acceptance">Aceitação</Option>
                <Option value="compatibility">Compabilidade</Option>
                <Option value="integration">Integração</Option>
                <Option value="exploratory">Exploratório</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="deadline"
              label="Deadline"
              rules={[
                {
                  required: true,
                  message: "Selecione a data limite para o teste",
                },
              ]}
            >
              <DatePicker onChange={onChangeDeadline} />
            </Form.Item>
            <Form.Item
              name="assignees"
              label="Tester"
              rules={[
                { required: true, message: "Selecione o tester responsável" },
              ]}
            >
              <Select placeholder="Selecione o tester responsável">
                <Option value="fred">Fred</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="severity"
              label="Severidade"
              rules={[
                { required: false, message: "Selecione a severidade do teste" },
              ]}
            >
              <Radio.Group
                size="small"
                onChange={onChangeSeverity}
                defaultValue="minor"
              >
                <Radio.Button value="minor">Mínima</Radio.Button>
                <Radio.Button value="trivial">Trivial</Radio.Button>
                <Radio.Button value="normal">Normal</Radio.Button>
                <Radio.Button value="major">Grave</Radio.Button>
                <Radio.Button value="blocker">Bloqueador</Radio.Button>
                <Radio.Button value="critical">Crítico</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="priority"
              label="Prioridade"
              rules={[
                { required: false, message: "Selecione a prioridade do teste" },
              ]}
            >
              <Radio.Group onChange={onChangePriority} defaultValue="low">
                <Radio.Button value="low">Baixa</Radio.Button>
                <Radio.Button value="medium">Média</Radio.Button>
                <Radio.Button value="high">Alta</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="files"
              label="Anexos"
              rules={[{ required: false, message: "Anexos" }]}
            >
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Se houver algum anexo ao caso clique ou arraste o arquivo para
                  esta área
                </p>
                <p className="ant-upload-hint">
                  Suporte para um upload único ou em massa. Apenas arquivos
                  .png, .jpg e .jpeg
                </p>
              </Dragger>
            </Form.Item>
            <Space>
              <Button onClick={onCloseCreate}>Cancelar</Button>
              <Button onClick={onCloseCreate} type="primary">
                Criar caso de teste
              </Button>
            </Space>
          </Form>
        </Drawer>
      ) : (
        <></>
      )}
      {openEdit ? (
        <Modal
          centered
          open={openEdit}
          onOk={() => setOpenEdit(false)}
          okText="Salvar alterações"
          onCancel={() => setOpenEdit(false)}
          width={1000}
          className={styles.modal}
        >
          <div className={styles.testContent}>
            <div className={styles.statusContainer}>
              <span className={styles.successStatus}></span>
              <p>Sucesso</p>
            </div>

            <h3>Título do Caso</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.{" "}
            </p>
            <div className={styles.tagsContainer}>
              <Tag color="default">SPRINT 1</Tag>
              <Tag color="#FF5500">TESTE DE SEGURANÇA</Tag>
              <Tag color="#FF5500">CRÍTICO</Tag>
              <Tag icon={<ClockCircleOutlined />} color="success">
                24 ABR
              </Tag>
            </div>
            <div className={styles.footerCard}>
              <p className={styles.secondaryText}>Criado por Fred Durão</p>
              <div className={styles.assignContainer}>
                <p className={styles.secondaryText}>
                  Criado 02/04/2023 por Fred Durão | Editado 02/04/2023 às 22:41
                </p>
                <div className={styles.assignContainer}>
                  <p className={styles.secondaryText}>Atribuído a </p>
                  <Avatar size="small" icon={<UserOutlined />} />
                </div>
              </div>
            </div>
          </div>
          <Form layout="vertical">
            <Form.Item
              name="description"
              label="Descrição"
              rules={[
                {
                  required: true,
                  message: "Digite a descrição do caso de teste",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Digite a descrição do caso de teste"
              />
            </Form.Item>
            <Form.Item
              name="files"
              label="Anexos"
              rules={[{ required: false, message: "Anexos" }]}
            >
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Se houver algum anexo ao caso clique ou arraste o arquivo para
                  esta área
                </p>
                <p className="ant-upload-hint">
                  Suporte para um upload único ou em massa. Apenas arquivos
                  .png, .jpg e .jpeg
                </p>
              </Dragger>
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <></>
      )}
      <Layout>
        <Header className="header">
          <div className="logo" />
        </Header>
        <Layout>
          <Sider width={200} style={{ background: "#FFFFFF" }}>
            <Menu
              mode="inline"
              // defaultSelectedKeys={["1"]}
              // defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
              items={items1}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <div className={styles.header}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <h2>Projeto</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className={styles.contentContainerHeader}>
                <p className={styles.secondaryText}>
                  Criado em 02/02/2002 | Editado em 02/02/2023
                </p>
                <Avatar.Group
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
                </Avatar.Group>
              </div>
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
                <h3>50 casos de teste disponíveis</h3>
                <Button onClick={showCreateDrawer} type="primary">
                  Criar caso de teste
                </Button>
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Card
                    onClick={showEditModal}
                    className={styles.successTestCard}
                    bordered={false}
                  >
                    <div className={styles.testContent}>
                      <div className={styles.statusContainer}>
                        <span className={styles.successStatus}></span>
                        <p>Sucesso</p>
                      </div>
                      {/* <Dropdown.Button
                        menu={{ items, onClick: onMenuClick }}
                      ></Dropdown.Button> */}
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
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
                        <div className={styles.assignContainer}>
                          <p className={styles.secondaryText}>Atribuído a </p>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
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
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
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
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
                        <div className={styles.assignContainer}>
                          <p className={styles.secondaryText}>Atribuído a </p>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row>
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
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
                        <div className={styles.assignContainer}>
                          <p className={styles.secondaryText}>Atribuído a </p>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Pagination
                style={{ alignSelf: "flex-end" }}
                defaultCurrent={1}
                total={50}
              />
              ;
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </main>
  );
}
