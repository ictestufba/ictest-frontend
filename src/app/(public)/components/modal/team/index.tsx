import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Team } from "@/types/models";
import { parseJWT } from "@/utils/parse-jwt";
import {
  Button,
  Drawer,
  Form,
  Input,
  Space,
  message
} from "antd";
import { useSWRConfig } from "swr";

type CreateTeamModalProps = {
  onClose: () => void;
  onSubmit?: () => void;
  open: boolean;
};

type Payload = {
  name: string;
  department: string;
  description?: string;
  members: string[];
};

export function CreateTeamModal(props: CreateTeamModalProps) {
  const { onClose, open, onSubmit } = props;

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate } = useSWRConfig();

  async function handleTeamCase(payload: Payload) {
    const hasSomeEmptyValue = [payload.department, payload.name]
      .map((s) => s.trim())
      .some((s) => !s);

    if (hasSomeEmptyValue)
      return messageApi.warning("Preencha os campos necessários");

    const token = getToken();

    const currentUser = token ? parseJWT(token) : null;

    const response = await api.post<{ team: Team }>(`/teams`, {
      ...payload,
      owner: currentUser?.sub,
    });

    mutate<Team[]>("/teams", (data = []) => [
      ...data,
      response.data.team,
    ]);
    onSubmit?.();
  }

  return (
    <Drawer
      title="Criar Time"
      onClose={onClose}
      open={open}
      width={480}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {contextHolder}
      <Form
        form={form}
        onFinish={handleTeamCase}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Nome"
          rules={[{ required: true, message: "Digite o nome do time" }]}
        >
          <Input placeholder="Digite o nome do time" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            {
              required: true,
              message: "Digite a descrição do time",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Digite a descrição do time"
          />
        </Form.Item>
        <Form.Item
          name="department"
          label="Departamento"
          rules={[{ required: true, message: "Digite o departamento do time" }]}
        >
          <Input placeholder="Digite o departamento do time" />
        </Form.Item>
        <Form.Item
          name="members"
          label="Membros"
          rules={[
            { required: true, message: "Digite os membros do time" },
            {},
          ]}
        >
          <Input placeholder="Digite os membros do time" />
        </Form.Item>
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={() => form.submit()} type="primary">
            Criar Time
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}
