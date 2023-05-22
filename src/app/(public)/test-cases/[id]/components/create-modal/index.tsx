import { api } from "@/lib/api";
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
} from "antd";
import React from "react";
import { useSWRConfig } from "swr";

// import { CreateModalProps } from './types';
// import { Container } from './styles';

const { Option } = Select;
const { Dragger } = Upload;

type CreateModalProps = {
  onClose: () => void;
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
};

export function CreateModal(props: CreateModalProps) {
  const { onClose, open, projectId, onSubmit } = props;
  const [form] = Form.useForm();
  const {} = useSWRConfig();

  async function handleCreateTestCase(payload: Payload) {
    payload.priority = payload.priority ?? "low";
    payload.severity = payload.severity ?? "minor";
    await api.post(`/test-cases`, {
      project_id: projectId,
      is_flaky: false,
      ...payload,
    });
    onSubmit?.();
  }

  return (
    <Drawer
      title="Criar caso de teste"
      onClose={onClose}
      open={open}
      width={480}
      bodyStyle={{ paddingBottom: 80 }}
    >
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
        <Form.Item
          name="severity"
          label="Severidade"
          rules={[
            { required: false, message: "Selecione a severidade do teste" },
          ]}
        >
          <Radio.Group size="small" defaultValue="minor">
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
          <Radio.Group defaultValue="low">
            <Radio.Button value="low">Baixa</Radio.Button>
            <Radio.Button value="medium">Média</Radio.Button>
            <Radio.Button value="high">Alta</Radio.Button>
          </Radio.Group>
        </Form.Item>
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
            Criar caso de teste
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
