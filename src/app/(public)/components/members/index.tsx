"use client";

import { api } from "@/lib/api";
import { Avatar, Button, Form, List, Select, Spin, message } from "antd";
import { useState } from "react";
import { useSWRConfig } from "swr";
import styles from "./styles.module.css";

import { User } from "@/types/models";
import { CrownOutlined, DeleteFilled } from "@ant-design/icons";
import { useMembers } from "../../home/projects/[id]/hooks/useMembers";

type MembersProps = {
  projectId: string;
  usersOptions: User[];
  email: string | null;
  handleEmailChange: (value:string)=>void;
}

export function Members(props: MembersProps) {
  const {
    projectId,
    usersOptions,
    email,
    handleEmailChange,
  } = props;
  const { mutate: globalMutate } = useSWRConfig();
  const [openCreate, setOpenCreate] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const {
    data: users,
    isLoading: usersIsLoading,
    mutate,
    currentUserId,
    isAdmin,
    adminId
  } = useMembers(projectId);

  const addUser = async () => {
    try {
      await api.patch(`/projects/${projectId}/add-member`, {
        userEmail: email,
      });
      handleEmailChange("");
      mutate();
      messageApi.success("Usuário adicionado com sucesso");
    } catch (error) {
      console.error(error);
      messageApi.error("Ocorreu um erro ao adicionar usuário");
    }
  };


  async function removeMember(id: string) {
    await api.delete(`/projects/${projectId}/remove-member`, {
      data: {
        userId:id,
      },
    });
    mutate();
    globalMutate("/users")
  }
  globalMutate("/users")

  if (usersIsLoading) return <Spin />;

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.inputContainer}>
        {
          <Select
            placeholder="Digite o e-mail do usuário para adicionar"
            onChange={handleEmailChange}
            value={email}
            showSearch
            className={styles.select}
            disabled={!isAdmin}
          >
            {usersOptions?.map((user) => {
              return (
                <Select.Option key={user.id} value={user.email}>
                  {user.email}
                </Select.Option>
              )
            })}
          </Select>
        }
        <Button disabled={!isAdmin} onClick={addUser} type="primary" className={styles.buttonContainer}>
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
            {
              !usersIsLoading && adminId === item.id && <CrownOutlined />
            }
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/6.x/open-peeps/svg?seed=${item.email}`}
                />
              }
              title={item.email}
              description={item.name}
            />
            {
              !usersIsLoading && isAdmin && currentUserId !== item.id && (
                <Button danger onClick={() => removeMember(item.id)}>
                  <DeleteFilled />
                </Button>
              )
            }
            
          </List.Item>
        )}
      />
    </div>
  );
}
