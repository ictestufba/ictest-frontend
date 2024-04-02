import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";

type Data = {
  email: string;
  password: string;
  rememeber?: boolean;
};

type Props = {
  onSuccess: () => void;
  setIsLoading: (value: boolean) => void;
};

export function Login({ onSuccess, setIsLoading }: Props) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  async function handleLogin(data: Data) {
    try {
      const { email, password, rememeber } = data;

      const payload = {
        email,
        password,
      };
      setIsLoading(true);
      const response = await api.post<{ token: string }>(
        "/sessions",
        JSON.stringify(payload)
      );
      const { token } = response.data;
      setToken(token);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      messageApi.error(
        "Não foi possível realizar login, tente novamente mais tarde!"
      );
    }
  }

  return (
    <>
      {contextHolder}

      <Form
        form={form}
        style={{ minWidth: 300 }}
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        onFinishFailed={console.error}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Informe seu e-mail" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="E-mail: ictest@ufba.br"
            style={{
              borderRadius: 0,
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Informe sua senha" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Senha: ic.teste"
            style={{
              borderRadius: 0,
            }}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              borderRadius: 0,
              padding: `4px 28px`,
            }}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
