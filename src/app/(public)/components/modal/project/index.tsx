import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Project } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";
import {
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Spin,
  message
} from "antd";
import { useState } from "react";
import { useSWRConfig } from "swr";

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
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate } = useSWRConfig();

  async function handleProjectCase(payload: Payload) {
    const hasSomeEmptyValue = [payload.code, payload.name]
      .map((s) => s.trim())
      .some((s) => !s);

    if (hasSomeEmptyValue)
      return messageApi.warning("Preencha os campos necessários");

    const token = getToken();

    const currentUser = token ? parseJWT(token) : null;
    setIsPageLoading(true);
    const response = await api.post<{ project: Project }>(`/projects`, {
      ...payload,
      userId: currentUser?.sub,
    });

    mutate<Project[]>("/projects", (data = []) => [
      ...data,
      response.data.project,
    ]);
    onSubmit?.();
    setIsPageLoading(false);
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
      <Spin spinning={isPageLoading} tip="carregando...">
      <Form
        form={form}
        onFinish={handleProjectCase}
        layout="vertical"
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
            { max: 10, message: "O código deve ter no máximo 10 caracteres" },
          ]}
        >
          <Input placeholder="Digite o código do projeto" />
        </Form.Item>
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={() => form.submit()} type="primary">
            Criar Projeto
          </Button>
        </Space>
      </Form>
      </Spin>
    </Drawer>
  );
}
