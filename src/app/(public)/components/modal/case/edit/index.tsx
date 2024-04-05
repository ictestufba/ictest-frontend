/* eslint-disable @next/next/no-img-element */
import { api } from "@/lib/api";
import { TestCase } from "@/types/models";
import { renderPriorityLabel } from "@/utils/renderPriorityLabel";
import {
  DeleteFilled, DownloadOutlined
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Tag,
  message,
} from "antd";
import { format } from "date-fns";
import dayjs from "dayjs";
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
  setIsLoading: (value: boolean) => void;
};

export function EditCaseModal(props: EditCaseModalProps) {
  const [messageApi, contextHolder] = message.useMessage();

  const { testCase, open, onOk, onCancel, onError, setIsLoading } = props;
  console.log(testCase);
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

    setIsLoading(true);
    try {
      await api.patch(`/test-cases/${testCase.id}/update`, {
        data: {
          ...testCase,
          ...payload,
          deadline,
        },
      });

      if (payload.assigned_to) {
        await api.patch(`/test-cases/${testCase.id}/assign`, {
          userEmail: payload.assigned_to,
        });
      }

      onOk?.();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      onError?.(error);
    }
  }

  async function handleTestCaseDelete() {
    await api.delete(`/test-cases/${testCase.id}`);
    onOk?.();
  }

  function downloadAttachment(url:string, name:string){
    if (!url) {
      messageApi.error("Não conseguimos realizar o download. Tente Novamente!")
      throw new Error("Resource URL not provided! You need to provide one");
    }
    setIsLoading(true);
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        setIsLoading(false);
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
        messageApi.success("Download realizado com sucesso!")
      })
      .catch(() =>{
        setIsLoading(false);
        messageApi.error("Não conseguimos realizar o download. Tente Novamente!")
      });
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
          <Radio.Group size="small" defaultValue="minor">
            <Radio.Button value="error">Erro</Radio.Button>
            <Radio.Button value="success">Sucesso</Radio.Button>
            <Radio.Button value="in_progress">Em Progresso</Radio.Button>
            <Radio.Button value="open">Aberto</Radio.Button>
          </Radio.Group>
        </Form.Item>
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
      {testCase.attachment && (
        <>
          <p className={styles.attachmentText}>
          Clique aqui para fazer o download da imagem anexada no momento da criação do caso de teste:
          </p>
          <Button onClick={()=>downloadAttachment(testCase.attachment ?? "", "caso-teste-anexo")} className={styles.downloadAttachment} type="primary" shape="round" icon={<DownloadOutlined />}>Download</Button>
        </>
      )}
     
    </Modal>
  );
}
