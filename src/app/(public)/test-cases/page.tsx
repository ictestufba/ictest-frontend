"use client";

import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  ClockCircleOutlined,
  AntDesignOutlined,
  InboxOutlined,
  DeleteFilled,
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
import { CreateProjectModal, NavBar } from "./components";
import { api } from "@/lib/api";

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
    <div>
      {openCreate && (
        <CreateProjectModal
          open={openCreate}
          onClose={onCloseCreate}
          onSubmit={onCloseCreate}
        />
      )}
      <h2>IC Testes </h2>
      <p>Bem-vindo(a) a plataforma</p>
      <div className={styles.contentContainerHeader}>
        <p className={styles.secondaryText}>
          Selecione o projeto na barra lateral para iniciar ou{" "}
          <a href="#" onClick={showCreateDrawer}>
            Crie um projeto
          </a>
        </p>
      </div>
    </div>
  );
}
