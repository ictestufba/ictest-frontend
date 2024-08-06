import { api } from "@/lib/api";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";

type Data = {
  email: string;
  password: string;
  name: string;
};

type Props = {
  onSuccess: () => void;
  setIsLoading: (value: boolean) => void;
};

export function Register({onSuccess,setIsLoading}:Props) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  async function handleRegister(data: Data) {
    try {
      const { email, password, name } = data;

      const payload = { email, password, name };

      setIsLoading(true);
      await api.post("/users", JSON.stringify(payload));
      
      form.resetFields();
      onSuccess();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      messageApi.error(
        "Ocorreu um erro não esperado ao cadastrar sua conta, tente novamente mais tarde"
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
          rules={[
            { required: true, type: "email" ,message: "Informe seu e-mail" }
          ]}
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
          rules={[
            { required: true, message: "Informe sua senha" },
            { min: 6, message: 'A senha tem que ter pelo menos 6 caracteres.' }
          ]}
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
    </>
  );
}
