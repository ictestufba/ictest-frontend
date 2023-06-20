import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import React from "react";
import { useSWRConfig } from "swr";

const { Option } = Select;
const { Dragger } = Upload;

type CreateProjectModalProps = {
  onClose: () => void;
  onSubmit?: () => void;
  open: boolean;
};

type Payload = {
  name: string;
  code: string;
  description?: string;
  visibility?: "public" | "private";
  member_access?: "add_all" | "add_specific" | "dont_add";
};

export function CreateProjectModal(props: CreateProjectModalProps) {
  const { onClose, open, onSubmit } = props;

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate } = useSWRConfig();

  async function handleProjectCase(payload: Payload) {
    // payload.member_access = payload.member_access ?? "add_all";
    // payload.visibility = payload.visibility ?? "public";

    const hasSomeEmptyValue = [payload.code, payload.name]
      .map((s) => s.trim())
      .some((s) => !s);

    if (hasSomeEmptyValue)
      return messageApi.warning("Preencha os campos necessários");

    const token = getToken();
    const currentUser = token ? parseJWT(token) : null;

    const response = await api.post<{ project: Project }>(`/projects`, {
      ...payload,
      userId: currentUser?.sub,
    });

    mutate<Project[]>("projects", (data = []) => [
      ...data,
      response.data.project,
    ]);
    onSubmit?.();
  }

  return (
    <Drawer
      title="Criar Projeto"
      onClose={onClose}
      open={open}
      width={480}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {contextHolder}
      <Form
        form={form}
        onFinish={handleProjectCase}
        layout="vertical"
        hideRequiredMark
      >
        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: "Digite o nome do projeto" }]}
        >
          <Input placeholder="Digite o nome do projeto" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            {
              required: true,
              message: "Digite a descrição do projeto",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Digite a descrição do projeto"
          />
        </Form.Item>
        <Form.Item
          name="code"
          label="Código"
          rules={[
            { required: true, message: "Digite o código do projeto" },
            {},
          ]}
        >
          <Input placeholder="Digite o código do projeto" />
        </Form.Item>
        {/* <Form.Item
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
    </Form.Item> */}
        {/* <Form.Item
          name="assignees"
          label="Tester"
          rules={[
            { required: true, message: "Selecione o tester responsável" },
          ]}
        >
          <Select placeholder="Selecione o tester responsável">
            <Option value="fred">Fred</Option>
          </Select>
        </Form.Item> */}

        {/* <Form.Item
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
              Suporte para um upload único ou em massa. Apenas arquivos .png,
              .jpg e .jpeg
            </p>
          </Dragger>
        </Form.Item> */}
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={() => form.submit()} type="primary">
            Criar Projeto
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
