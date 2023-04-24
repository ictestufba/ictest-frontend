import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";

type Data = {
  email: string;
  password: string;
  rememeber?: boolean;
};

export function Login() {
  function handleLogin(data: Data) {
    const { email, password, rememeber } = data;
    // TODO: auth request
    const token = JSON.stringify({ email, rememeber });
    localStorage.setItem("auth", token);
  }

  return (
    <Form
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
        <Checkbox>Me Lembrar</Checkbox>
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
