import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";

type Data = {
  email: string;
  password: string;
  rememeber?: boolean;
};

type Props = {
  onSuccess: () => void;
};

export function Login({ onSuccess }: Props) {
  const [form] = Form.useForm();

  async function handleLogin(data: Data) {
    const { email, password, rememeber } = data;

    const payload = {
      email,
      password,
    };

    const response = await api.post<{ token: string }>(
      "/sessions",
      JSON.stringify(payload)
    );
    const { token } = response.data;
    setToken(token);
    console.log(token);
    form.resetFields();
    onSuccess();
  }

  return (
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

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ span: 16 }}
      >
        <Checkbox>Lembrar-me</Checkbox>
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
  );
}
