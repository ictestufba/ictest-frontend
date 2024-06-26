/* eslint-disable @next/next/no-img-element */
import { api } from "@/lib/api";
import { TestCase } from "@/types/models";
import { renderPriorityLabel } from "@/utils/renderPriorityLabel";
import {
  DeleteFilled,
  PaperClipOutlined, UploadOutlined
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Spin,
  Tag,
  Upload,
  message
} from "antd";
import axios from "axios";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useState } from "react";
import { testCaselabelByType } from "../../../../constants/caseLabels";
import { useMembers } from "../../../../home/projects/[id]/hooks/useMembers";
import styles from "./styles.module.css";

const { Option } = Select;

type EditCaseModalProps = {
  testCase: TestCase;
  onError?: (error: unknown) => void;
  onOk: () => void;
  onCancel: () => void;
  open: boolean;
};

export function EditCaseModal(props: EditCaseModalProps) {
  const { testCase, open, onOk, onCancel, onError } = props;
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [hasErrorFields, setHasErrorFields] = useState(testCase.status === "error");
  const [errorImage, setErrorImage] = useState<string>();

  const { data: users } = useMembers(testCase.project_id);

  const date = new Date(testCase.created_at);
  const formattedDate = format(date, "dd/MM/yyyy HH:mm");

  const [form] = Form.useForm();

  function renderTypeLabel() {
    const label = testCaselabelByType[testCase.type];
    return label;
  }
  async function handleTestCaseEdit(payload: Partial<TestCase>) {
    // @ts-ignore
    const deadline = payload.deadline?.$d?.toISOString?.();
    setIsPageLoading(true);
    try {
      let error_attachment = errorImage ? errorImage : testCase.error_attachment ?? null
      if (payload.status !== "error") {
        error_attachment = null;
      }
      await api.patch(`/test-cases/${testCase.id}/update`, {
        data: {
          ...testCase,
          ...payload,
          deadline,
          error_description: payload.error_description ?? "",
          error_attachment,
        },
      });

      if (payload.assigned_to) {
        await api.patch(`/test-cases/${testCase.id}/assign`, {
          userEmail: payload.assigned_to,
        });
      }

      onOk?.();
      setIsPageLoading(false);
      
      message.success("Caso de teste editado com sucesso!")
    } catch (error) {
      setIsPageLoading(false);

      console.error(error);
      message.error("Não conseguimos editar o caso de teste no momento. Tente novamente mais tarde!")

      onError?.(error);
    }
  }

  async function handleTestCaseDelete() {
    setIsPageLoading(true);
    await api.delete(`/test-cases/${testCase.id}`);
    setIsPageLoading(false);

    onOk?.();

  }

  function downloadAttachment(url:string, name:string){
    if (!url) {
      messageApi.error("Não conseguimos realizar o download. Tente Novamente!")
      throw new Error("Resource URL not provided! You need to provide one");
    }
    setIsPageLoading(true);
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        setIsPageLoading(false);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
        messageApi.success("Download realizado com sucesso!")
      })
      .catch(() =>{
        setIsPageLoading(false);
        messageApi.error("Não conseguimos realizar o download. Tente Novamente!")
      });
  }

  function handleErrorAttachment(value: TestCase["status"]){
    if (value === "error"){
      setHasErrorFields(true);

      return;
    }

    setHasErrorFields(false);
  }

  const assignedTo = users?.find((user) => user.id === testCase.assigned_to);
  const assignedEmail = assignedTo?.email;

  return (
    <Modal
      centered
      //   open={openEdit}
      open={open}
      //   onOk={() => setOpenEdit(false)}
      onOk={() => form.submit()}
      onCancel={onCancel}
      okText="Salvar alterações"
      //   onCancel={() => setOpenEdit(false)}
      width={1000}
      className={styles.modal}
    > 
      {contextHolder}
      <Spin spinning={isPageLoading} tip="carregando...">
      <div className={styles.testContent}>
        <div className={styles.statusContainer}>
          <Button danger onClick={handleTestCaseDelete}>
            <DeleteFilled />
          </Button>
        </div>

        <div className={styles.footerCard}>
          <h3>{testCase.title}</h3>
          
          <div className={styles.assignContainer}>
            <p className={styles.secondaryText}>Criado {formattedDate}</p>

          </div>
          {testCase.attachment && (
            <Button className={styles.attachmentBtn} type="primary" ghost onClick={()=>downloadAttachment(testCase.attachment ?? "", "caso-teste")} icon={<PaperClipOutlined size={60} className={styles.downloadAttachment} />}>Download: Imagem do caso de teste</Button>
          )}
        </div>
        <div className={styles.tagsContainer}>
          <Tag color="#FF5500">{renderTypeLabel()}</Tag>
          <Tag color="#FF5500">{renderPriorityLabel(testCase.priority)}</Tag>
        </div>
        
      </div>
      <Form onFinish={handleTestCaseEdit} form={form} layout="vertical">
        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            {
              required: true,
              message: "Digite a descrição do caso de teste",
            },
          ]}
          initialValue={testCase.description}
        >
          <Input.TextArea
            rows={4}
            placeholder="Digite a descrição do caso de teste"
          />
        </Form.Item>
        <Form.Item
          name="type"
          label="Tipo"
          rules={[
            {
              required: true,
              message: "Selecione o tipo do caso de teste",
            },
          ]}
          initialValue={testCase.type}
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
          name="status"
          label="Status"
          rules={[{ required: false, message: "Selecione o status do teste" }]}
          initialValue={testCase.status}
        >
          <Radio.Group size="small" defaultValue="minor" onChange={(e)=>{
            handleErrorAttachment(e.target.value)
          }}>
            <Radio.Button value="error">Erro</Radio.Button>
            <Radio.Button value="success">Sucesso</Radio.Button>
            <Radio.Button value="in_progress">Em Progresso</Radio.Button>
            <Radio.Button value="open">Aberto</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {
          hasErrorFields && (
            <>
              <Form.Item
                name="files"
                rules={[{ required: false, message: "Anexos" }]}
                className={styles.uploadContainer}
              >
                <Upload
                  onRemove={() => setErrorImage("")}
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
                      setErrorImage(url);
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
                  <Button icon={<UploadOutlined />}>{testCase.error_attachment ? "Substituir Imagem" : "Upload Imagem"} </Button>
                </Upload>
               
              </Form.Item>
              {
                testCase.error_attachment && (
                  <Button className={styles.attachmentBtn} type="primary" ghost onClick={()=>downloadAttachment(testCase.error_attachment ?? "", "caso-teste-erro")} icon={<PaperClipOutlined size={60} className={styles.downloadAttachment} />}>Download: Imagem do erro</Button>
                )
              }
              <Form.Item
                name="error_description"
                label="Descrição do erro"
                rules={[
                  {
                    required: false,
                    message: "Digite a descrição do erro que ocorreu no caso de teste",
                  },
                ]}
                initialValue={testCase.error_description}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Digite a descrição do erro que ocorreu no caso de teste"
                />
              </Form.Item>
            </>
          )
        }
        <Form.Item
          name="assigned_to"
          label="Responsável"
          rules={[
            {
              required: false,
            },
          ]}
          initialValue={assignedEmail}
        >
          <Select placeholder="Selecione o responsável">
            {users?.map((user) => (
              <Option key={user.email} value={user.email}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Prazo"
          initialValue={
            testCase.deadline ? dayjs(testCase.deadline) : testCase.deadline
          }
        >
          <DatePicker placeholder="Selecione a data" />
        </Form.Item>
        <Form.Item
          name="priority"
          label="Prioridade"
          rules={[
            { required: false, message: "Selecione a prioridade do teste" },
          ]}
          initialValue={testCase.priority ?? "low"}
        >
          <Radio.Group size="small" defaultValue="low">
            <Radio.Button value="low">Baixa</Radio.Button>
            <Radio.Button value="medium">Média</Radio.Button>
            <Radio.Button value="high">Alta</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
      </Spin>
    </Modal>
  );
}
