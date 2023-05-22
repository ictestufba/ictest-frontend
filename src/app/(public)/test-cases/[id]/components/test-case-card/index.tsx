import { TestCase } from "@/types/models";
import React, { useMemo } from "react";
import styles from "./page.module.css";
import { Avatar, Card, Tag } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { format } from "date-fns";

type TestCaseCardProps = {
  testCase: TestCase;
  onClick?: (testCaseId: string) => void;
};

export function TestCaseCard(props: TestCaseCardProps) {
  const { testCase, onClick } = props;

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

  const date = new Date(testCase.created_at);
  const formattedDate = format(date, "dd/MM/yyyy");

  const statusStyle = useMemo(() => {
    //     .successTestCard p,
    // .failTestCard p,
    // .onProgressTestCard p,
    // .openTestCard

    if (testCase.status === "error") return styles.failTestCard;
    if (testCase.status === "in_progress") return styles.onProgressTestCard;
    if (testCase.status === "success") return styles.successTestCard;

    return styles.openTestCard;
  }, [testCase.status]);

  return (
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
          <Tag icon={<ClockCircleOutlined />} color="default">
            {formattedDate}
          </Tag>
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
  );
}
