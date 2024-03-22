"use client";

import { api } from "@/lib/api";
import { Avatar, Button, Form, Input, List, Spin, message } from "antd";
import { useState } from "react";
import { useSWRConfig } from "swr";
import styles from "./styles.module.css";

import { useMembers } from "../../home/projects/[id]/hooks/useMembers";

type MembersProps = {
  projectId: string;
}

export function Members(props: MembersProps) {
  const {
    projectId,
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


  async function removeMember(id: string) {
    await api.delete(`/projects/${projectId}/remove-member`, {
      data: {
        id,
      },
    });
    mutate();
  }

  if (usersIsLoading) return <Spin />;

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.inputContainer}>
        {
          <Input
            placeholder="Digite o e-mail do usuário para adicionar"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        }
        <Button onClick={addUser} type="primary" className={styles.buttonContainer}>
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
    </div>
  );
}
