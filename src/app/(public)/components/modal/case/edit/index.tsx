/* eslint-disable @next/next/no-img-element */
import { api } from "@/lib/api";
import { TestCase } from "@/types/models";
import { renderPriorityLabel } from "@/utils/renderPriorityLabel";
import {
  DeleteFilled
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Tag
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
};

export function EditCaseModal(props: EditCaseModalProps) {
  const { testCase, open, onOk, onCancel, onError } = props;

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
    } catch (error) {
      console.error(error);
      onError?.(error);
    }
  }

  async function handleTestCaseDelete() {
    await api.delete(`/test-cases/${testCase.id}`);
    onOk?.();
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
      <div className={styles.testContent}>
        <div className={styles.statusContainer}>
          <Button danger onClick={handleTestCaseDelete}>
            <DeleteFilled />
          </Button>
        </div>

        <h3>{testCase.title}</h3>
        <div className={styles.footerCard}>
          {/* <p className={styles.secondaryText}>Criado por Fred Durão</p> */}
          <div className={styles.assignContainer}>
            <p className={styles.secondaryText}>Criado {formattedDate}</p>
            {/* <div className={styles.assignContainer}>
              <p className={styles.secondaryText}>Atribuído a </p>
              <Avatar size="small" icon={<UserOutlined />} />
            </div> */}
          </div>
        </div>
        <div className={styles.tagsContainer}>
          {/* <Tag color="default">SPRINT 1</Tag> */}
          <Tag color="#FF5500">{renderTypeLabel()}</Tag>
          <Tag color="#FF5500">{renderPriorityLabel(testCase.priority)}</Tag>
          {/* <Tag icon={<ClockCircleOutlined />} color="success">
            24 ABR
          </Tag> */}
        </div>
        
        {testCase.attachment && (
          <div className={styles.footerCard}>
            <img src={testCase.attachment} alt="" width={200} />
          </div>
        )}
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
          name="status"
          label="Status"
          rules={[{ required: false, message: "Selecione o status do teste" }]}
          initialValue={testCase.status}
        >
          <Radio.Group size="small" defaultValue="minor">
            <Radio.Button value="error">Falha</Radio.Button>
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
    </Modal>
  );
}
