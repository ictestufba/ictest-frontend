"use client";

import React, { useMemo, useState } from "react";
import useSwr, { mutate, useSWRConfig } from "swr";
import { Avatar, List, Spin, message } from "antd";
import { Col, Row, Button, Form, Input } from "antd";
import styles from "./page.module.css";
import { TestCase } from "@/types/models";
import { api } from "@/lib/api";

const { Search } = Input;

import { MembersProps } from "./types";
import { TestCaseCard } from "../test-case-card";
import { EditModal } from "../edit-modal";
import { CreateModal } from "../create-modal";
import { useMembers } from "../../hooks";

export function Members(props: MembersProps) {
  const {
    projectId,
    // onEditError,
    // onEditSuccess,
    // onCreateError,
    // onCreateSuccess,
  } = props;

  const { mutate: globalMutate } = useSWRConfig();

  const [openCreate, setOpenCreate] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [email, setEmail] = useState<string>();
  const [form] = Form.useForm();

  const {
    data: users,
    isLoading: usersIsLoading,
    mutate,
  } = useMembers(projectId);

  const addUser = async () => {
    try {
      await api.patch(`/projects/${projectId}/add-member`, {
        userEmail: email,
      });
      setEmail("");
      mutate();
      message.success("Usuário adicionado com sucesso");
    } catch (error) {
      console.error(error);
      message.error("Ocorreu um erro ao adicionar usuário");
    }
  };

  const onCloseCreate = () => {
    setOpenCreate(false);
  };

  if (usersIsLoading) return <Spin />;

  return (
    <>
      {contextHolder}
      <div className={styles.inputContainer}>
        {
          <Input
            placeholder="Digite o e-mail do usuário para adicionar"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        }
        <Button onClick={addUser} type="primary">
          Adicionar usuário
        </Button>
      </div>
      <div className={styles.contentContainerHeader}>
        <h3>{users?.length ?? "-"} membros</h3>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/6.x/open-peeps/svg?seed=${item.email}`}
                />
              }
              title={item.email}
              description={item.name}
            />
          </List.Item>
        )}
      />
    </>
  );
}
