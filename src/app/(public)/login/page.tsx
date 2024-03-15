"use client";

import { FileSearchOutlined } from "@ant-design/icons";
import styles from "./page.module.css";

import { isLoggedIn } from "@/lib/auth";
import { Row, Space, Tabs, TabsProps, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Login, Register } from "./components";

enum TabOptions {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TabOptions.LOGIN);

  useEffect(() => {
    const loggedIn = isLoggedIn();

    if (loggedIn) router.push("/home");
  }, [router]);

  const onLoginSuccess = () => router.push("/home");

  const tabs: TabsProps["items"] = [
    {
      key: TabOptions.LOGIN,
      label: `Login`,
      children: <Login onSuccess={onLoginSuccess} />,
    },
    {
      key: TabOptions.REGISTER,
      label: `Cadastro`,
      children: <Register />,
    },
  ];

  const renderTabBar: TabsProps["renderTabBar"] = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className={styles.tabBarList} />
  );

  return (
    <main className={styles.container}>
      <Row justify="center">
        <Space direction="vertical" align="center">
          <Typography.Title color="white">
            <FileSearchOutlined /> ictest
          </Typography.Title>
          <Typography.Paragraph>
            Sistema de Gerenciamento de Casos de Teste
          </Typography.Paragraph>
        </Space>
      </Row>
      <Row justify="center">
        <Tabs
          defaultActiveKey={TabOptions.LOGIN}
          items={tabs}
          onChange={(key) => setActiveTab(key as TabOptions)}
          renderTabBar={renderTabBar}
        />
      </Row>
    </main>
  );
}
