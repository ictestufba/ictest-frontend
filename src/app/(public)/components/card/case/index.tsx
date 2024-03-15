import { TestCase } from "@/types/models";
import { renderPriorityLabel } from "@/utils/renderPriorityLabel";
import { renderStatusLabel } from "@/utils/renderStatusLabel";
import {
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Divider, Tag } from "antd";
import { format } from "date-fns";
import { useMemo } from "react";
import { useMembers } from "../../../home/projects/[id]/hooks/useMembers";
import styles from "./styles.module.css";

const { Meta } = Card;

type CaseCardProps = {
  testCase: TestCase;
  onClick?: (testCaseId: string) => void;
};

export function CaseCard({testCase, onClick}: CaseCardProps) {
  const { data: users } = useMembers(testCase.project_id);
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
        hoverable
      >
        <div className={styles.testContent}>
          <div className={styles.statusContainer}>
            <span className={styles.status}></span>
            <p>{renderStatusLabel(testCase.status)}</p>
          </div>
          <Meta
            title={testCase.title}
            description={testCase.description} 
          />
          <Divider />
          <div className={styles.tagsContainer}>
            <Tag color="default">{renderPriorityLabel(testCase.priority)}</Tag>
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
        </div>
      </Card>
    </div>
  );
}
