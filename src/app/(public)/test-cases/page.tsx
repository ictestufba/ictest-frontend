"use client";

import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  ClockCircleOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout,
  Menu,
  Card,
  Col,
  Row,
  Tag,
  Avatar,
  Pagination,
  Button,
  Tooltip,
  Input,
  theme,
} from "antd";
import styles from "./page.module.css";

const { Header, Content, Sider } = Layout;

const { Search } = Input;

const items1: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `Projeto ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `Caso de Teste ${subKey}`,
      };
    }),
  };
});

export default function Home() {
  return (
    <main>
      <Layout>
        <Header className="header">
          <div className="logo" />
        </Header>
        <Layout>
          <Sider width={200} style={{ background: "#FFFFFF" }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%", borderRight: 0 }}
              items={items1}
            />
          </Sider>
          <Layout style={{ padding: "0 24px 24px" }}>
            <div className={styles.header}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <h2>Projeto</h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
              <div className={styles.contentContainerHeader}>
                <p className={styles.secondaryText}>
                  Criado em 02/02/2002 | Editado em 02/02/2023
                </p>
                <Avatar.Group
                  maxCount={3}
                  maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
                  <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
                  <Tooltip title="Ant User" placement="top">
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                  </Tooltip>
                  <Avatar
                    style={{ backgroundColor: "#1890ff" }}
                    icon={<AntDesignOutlined />}
                  />
                </Avatar.Group>
              </div>
            </div>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <Search
                placeholder="Digite o título do caso de teste que deseja"
                enterButton
              />
              <div className={styles.contentContainerHeader}>
                <h3>50 casos de teste disponíveis</h3>
                <Button type="primary">Criar caso de teste</Button>
              </div>
              <Row gutter={16}>
                <Col span={8}>
                  <Card className={styles.successTestCard} bordered={false}>
                    <div className={styles.testContent}>
                      <div className={styles.statusContainer}>
                        <span className={styles.successStatus}></span>
                        <p>Sucesso</p>
                      </div>
                      <h3>Título do Caso</h3>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.{" "}
                      </p>
                      <div className={styles.tagsContainer}>
                        <Tag color="default">SPRINT 1</Tag>
                        <Tag icon={<ClockCircleOutlined />} color="success">
                          24 ABR
                        </Tag>
                      </div>
                      <div className={styles.footerCard}>
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
                        <div className={styles.assignContainer}>
                          <p className={styles.secondaryText}>Atribuído a </p>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className={styles.failTestCard} bordered={false}>
                    <div className={styles.testContent}>
                      <div className={styles.statusContainer}>
                        <span className={styles.failStatus}></span>
                        <p>Falha</p>
                      </div>
                      <h3>Título do Caso</h3>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.{" "}
                      </p>
                      <div className={styles.tagsContainer}>
                        <Tag color="default">SPRINT 1</Tag>
                        <Tag icon={<ClockCircleOutlined />} color="default">
                          24 ABR
                        </Tag>
                      </div>
                      <div className={styles.footerCard}>
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
                        <div className={styles.assignContainer}>
                          <p className={styles.secondaryText}>Atribuído a </p>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className={styles.onProgressTestCard} bordered={false}>
                    <div className={styles.testContent}>
                      <div className={styles.statusContainer}>
                        <span className={styles.onProgressStatus}></span>
                        <p>Em progresso</p>
                      </div>
                      <h3>Título do Caso</h3>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.{" "}
                      </p>
                      <div className={styles.tagsContainer}>
                        <Tag color="default">SPRINT 1</Tag>
                        <Tag icon={<ClockCircleOutlined />} color="error">
                          24 ABR
                        </Tag>
                      </div>
                      <div className={styles.footerCard}>
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
                        <div className={styles.assignContainer}>
                          <p className={styles.secondaryText}>Atribuído a </p>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Card className={styles.openTestCard} bordered={false}>
                    <div className={styles.testContent}>
                      <div className={styles.statusContainer}>
                        <span className={styles.openStatus}></span>
                        <p>Aberto</p>
                      </div>
                      <h3>Título do Caso</h3>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.{" "}
                      </p>
                      <div className={styles.tagsContainer}>
                        <Tag color="default">SPRINT 1</Tag>
                        <Tag icon={<ClockCircleOutlined />} color="default">
                          24 ABR
                        </Tag>
                      </div>
                      <div className={styles.footerCard}>
                        <p className={styles.secondaryText}>
                          Criado por Fred Durão
                        </p>
                        <div className={styles.assignContainer}>
                          <p className={styles.secondaryText}>Atribuído a </p>
                          <Avatar size="small" icon={<UserOutlined />} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Pagination
                style={{ alignSelf: "flex-end" }}
                defaultCurrent={1}
                total={50}
              />
              ;
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </main>
  );
}
