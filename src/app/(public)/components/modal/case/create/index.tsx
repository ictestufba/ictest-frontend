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
  Spin,
  Upload,
  message,
} from "antd";
import axios from "axios";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useMembers } from "../../../../home/projects/[id]/hooks/useMembers";
import styles from "./styles.module.css";

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
  const [isPageLoading, setIsPageLoading] = useState(false);

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

      setIsPageLoading(true);
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

      setIsPageLoading(false);

      message.success("Caso de teste criado com sucesso!")

    } catch (error) {
      console.error(error);
      onError?.(error);
      message.error("Não conseguimos criar o caso de teste no momento. Tente novamente mais tarde!")
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
      <Spin spinning={isPageLoading} tip="carregando...">
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
            <Option value="functional">Funcional
              <div className={styles.optionDescription}>Avalia se o software cumpre as especificações funcionais. Testa as funções do sistema, módulo por módulo, para garantir que atende aos requisitos do usuário.</div>
            </Option>
            <Option value="smoke">Smoke
              <div className={styles.optionDescription}>Também conhecido como teste de sanity, verifica se o build do software é estável o suficiente para ser submetido a testes mais detalhados. Executa testes básicos para identificar problemas críticos.</div>
            </Option>
            <Option value="regression">Regressão
              <div className={styles.optionDescription}>Testa se as alterações no código não afetaram negativamente as funcionalidades existentes. Garante que novas implementações não quebraram recursos já existentes.</div>
            </Option>
            <Option value="security">Segurança
              <div className={styles.optionDescription}>Avalia a segurança do sistema contra ameaças internas e externas. Identifica e corrige possíveis vulnerabilidades que possam ser exploradas por invasores.</div>
            </Option>
            <Option value="usability">Usabilidade
              <div className={styles.optionDescription}>Avalia a segurança do sistema contra ameaças internas e externas. Identifica e corrige possíveis vulnerabilidades que possam ser exploradas por invasores.</div>
            </Option>
            <Option value="performance">Performace
              <div className={styles.optionDescription}>Analisa o desempenho do sistema em diferentes condições de carga e utilização. Verifica se o software atende aos requisitos de tempo de resposta e capacidade de processamento.</div>
            </Option>
            <Option value="acceptance">Aceitação
              <div className={styles.optionDescription}>Realizado pelo cliente ou usuário final para validar se o software atende aos requisitos e expectativas. Confirma se o produto está pronto para ser implantado.</div>
            </Option>
            <Option value="compatibility">Compatibilidade
              <div className={styles.optionDescription}>Verifica se o software funciona corretamente em diferentes ambientes, sistemas operacionais, navegadores e dispositivos. Garante uma experiência consistente para todos os usuários.</div>
            </Option>
            <Option value="integration">Integração
              <div className={styles.optionDescription}>Testa a integração entre diferentes componentes ou módulos do sistema. Garante que as partes individuais funcionem corretamente juntas como um todo.</div>
            </Option>
            <Option value="exploratory">Exploratório
              <div className={styles.optionDescription}>Teste não estruturado, baseado na experiência e intuição do testador. Explora o software de forma livre para identificar falhas e comportamentos inesperados.</div>
            </Option>
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
            onChange={(info) => {
              const { status } = info.file;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                message.success(`${info.file.name} carregado com sucesso.`);
              } else if (status === 'error') {
                message.error(`${info.file.name} falhou durante o carregamento.`);
              }
            }}
            customRequest={async ({ file, onSuccess, onError }) => {
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
                if (onSuccess) {
                  onSuccess({});
                }
                return await fetch(url).then((res) => res.blob());
              } catch (err) {
                if (onError) {
                  onError({
                    cause: err,
                    status: 500,
                    name: "uploading error",
                    message:""
                  });
                }
                console.error(err);
              }
            }}
            
            maxCount={1}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Se houver algum anexo clique ou arraste o arquivo para
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
      </Spin>
    </Drawer>
  );
}
