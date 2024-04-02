"use client";

import { api } from "@/lib/api";
import { TestCase } from "@/types/models";
import { InboxOutlined } from "@ant-design/icons";
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
import axios from "axios";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useMembers } from "../../../../home/projects/[id]/hooks/useMembers";

const { Option } = Select;
const { Dragger } = Upload;

type CreateCaseModalProps = {
  onClose: () => void;
  onError?: (error: unknown) => void;
  onSubmit?: () => void;
  open: boolean;
  projectId: string;
};

type Payload = {
  description: string;
  priority?: string;
  severity?: string;
  title: string;
  type: string;
  assigned_to?: string;
  files: any;
};

export function CreateCaseModal(props: CreateCaseModalProps) {
  const { onClose, open, projectId, onSubmit, onError } = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [image, setImage] = useState<string>();
  const { mutate } = useSWRConfig();

  const { data: users } = useMembers(projectId);

  async function handleCreateTestCase({ files, ...payload }: Payload) {
    try {
      const hasSomeEmptyValue = [
        payload.title,
        payload.description,
        payload.type,
      ]
        .map((s) => s.trim())
        .some((s) => !s);

      if (hasSomeEmptyValue)
        return messageApi.warning("Preencha os campos necessários");

      payload.priority = payload.priority ?? "low";
      payload.severity = payload.severity ?? "minor";
      const { data:response } = await api.post<{ test_case: TestCase }>(`/test-cases`, {
        project_id: projectId,
        is_flaky: false,
        ...payload,
        attachment: image ?? null,
      });

      if (payload.assigned_to) {
        await api.patch(`/test-cases/${response.test_case.id}/assign`, {
          userEmail: payload.assigned_to,
        });
      }
      
      
      mutate<TestCase[]>(`/projects/${projectId}/test-cases`, (data = []) => [
        ...data,
        response.test_case,
      ]);
      onSubmit?.();
    } catch (error) {
      console.error(error);
      onError?.(error);
    }
  }

  return (
    <Drawer
      title="Criar caso de teste"
      onClose={onClose}
      open={open}
      width={480}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {contextHolder}
      <Form
        form={form}
        onFinish={handleCreateTestCase}
        layout="vertical"
        hideRequiredMark
      >
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
          name="assigned_to"
          label="Responsável"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select placeholder="Selecione o responsável">
            {users?.map((user) => (
              <Option key={user.email} value={user.email}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="deadline" label="Prazo">
          <DatePicker placeholder="Selecione a data limite para o teste" />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Prioridade"
          rules={[
            { required: false, message: "Selecione a prioridade do teste" },
          ]}
        >
          <Radio.Group size="small" defaultValue="low">
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
          <Dragger
            customRequest={async ({ file }) => {
              try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "smskd6ty");
                formData.append("api_key", "249422772221523");

                const res = await axios.post(
                  `https://api.cloudinary.com/v1_1/dwvbu2eak/image/upload`,
                  formData
                );

                const url = res.data.secure_url;
                setImage(url);
                return await fetch(url).then((res) => res.blob());
              } catch (err) {
                console.error(err);
              }
            }}
            maxCount={1}
          >
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
        </Form.Item> 
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={() => form.submit()} type="primary">
            Criar caso de teste
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
