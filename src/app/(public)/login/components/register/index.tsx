import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";

type Data = {
  email: string;
  password: string;
  name: string;
};

export function Register() {
  const [form] = Form.useForm();

  async function handleRegister(data: Data) {
    const { email, password, name } = data;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    form.resetFields();
  }

  return (
    <Form
      form={form}
      style={{ minWidth: 300 }}
      initialValues={{ remember: true }}
      onFinish={handleRegister}
      onFinishFailed={console.error}
      autoComplete="off"
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Informe seu nome" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Nome: IC Test"
          style={{
            borderRadius: 0,
          }}
        />
      </Form.Item>
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
          Cadastrar-se
        </Button>
      </Form.Item>
    </Form>
  );
}
