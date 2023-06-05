"use client";

import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  ClockCircleOutlined,
  AntDesignOutlined,
  InboxOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  MenuProps,
  RadioChangeEvent,
  DatePickerProps,
  UploadProps,
  Anchor,
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
import { NavBar } from "./components";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Header, Content, Sider } = Layout;

const { Search } = Input;
const { Option } = Select;
const { Dragger } = Upload;

export default function DashboardTemplate({
  children,
}: React.PropsWithChildren) {
  const router = useRouter();
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

  return (
    <main>
      {contextHolder}

      <Layout>
        <Header className="header">
          <div className={styles.headerContentContainer}>
            <div className={styles.logo}>
              <Link href="/test-cases">IC Testes</Link>
            </div>

            <div className={styles.logoutContainer}>
              <Button
                onClick={() => {
                  removeToken();
                  router.push("/login");
                }}
              >
                Logout
                <LogoutOutlined />
              </Button>
            </div>
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: "#FFFFFF" }}>
            <NavBar />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <div className={styles.header}>
              {/* <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb> */}
              {children}
            </div>
          </Layout>
        </Layout>
      </Layout>
    </main>
  );
}
