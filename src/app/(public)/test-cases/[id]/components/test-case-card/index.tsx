import { TestCase } from "@/types/models";
import React, { useMemo } from "react";
import styles from "./page.module.css";
import { Avatar, Card, Tag } from "antd";
import {
  ClockCircleOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import { useMembers } from "../../hooks";

type TestCaseCardProps = {
  testCase: TestCase;
  onClick?: (testCaseId: string) => void;
};

export function TestCaseCard(props: TestCaseCardProps) {
  const { testCase, onClick } = props;

  const { data: users } = useMembers(testCase.project_id);

  function renderStatusLabel() {
    if (testCase.status === "error") return "Falha";
    if (testCase.status === "in_progress") return "Em progresso";
    if (testCase.status === "success") return "Sucesso";

    return "Aberto";
  }

  function renderPriorityLabel() {
    if (testCase.priority === "high") return "Prioridade Alta";
    if (testCase.priority === "low") return "Prioridade Baixa";
    if (testCase.priority === "medium") return "Prioridade Média";

    return null;
  }

  const date = testCase.deadline ? new Date(testCase.deadline) : null;
  const formattedDate = date ? format(date, "dd/MM/yyyy HH:mm") : null;

  const user = useMemo(
    () => users?.find((user) => user.id === testCase.assigned_to),
    [users, testCase.assigned_to]
  );

  const statusStyle = useMemo(() => {
    if (testCase.status === "error") return styles.failTestCard;
    if (testCase.status === "in_progress") return styles.onProgressTestCard;
    if (testCase.status === "success") return styles.successTestCard;

    return styles.openTestCard;
  }, [testCase.status]);

  return (
    <div className={styles.container}>
      <Card
        onClick={() => onClick?.(testCase.id)}
        className={statusStyle}
        bordered={false}
      >
        <div className={styles.testContent}>
          <div className={styles.statusContainer}>
            <span className={styles.status}></span>
            <p>{renderStatusLabel()}</p>
          </div>
          <h3>{testCase.title}</h3>
          <p>{testCase.description}</p>
          <div className={styles.tagsContainer}>
            <Tag color="default">{renderPriorityLabel()}</Tag>
            {formattedDate && (
              <Tag icon={<ClockCircleOutlined />} color="default">
                {formattedDate}
              </Tag>
            )}

            {user && (
              <div className={styles.avatarContainer}>
                <Avatar
                  src={`https://api.dicebear.com/6.x/open-peeps/svg?seed=${user.email}`}
                />

                {user.name}
              </div>
            )}
          </div>
          {/* <div className={styles.footerCard}>
          <p className={styles.secondaryText}>Criado por Fred Durão</p>
          <div className={styles.assignContainer}>
            <p className={styles.secondaryText}>Atribuído a </p>
            <Avatar size="small" icon={<UserOutlined />} />
          </div>
        </div> */}
        </div>
      </Card>
    </div>
  );
}
