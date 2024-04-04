import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useMembers } from "../../home/projects/[id]/hooks/useMembers";
import styles from "./styles.module.css";

type props = {
  text: string;
  divider?: boolean;
  newBtn?: boolean
  onClick?: () => void;
  projectId?: string;
  buttonText?: string;
};

export function CustomTitle({ text, divider, newBtn, onClick, projectId, buttonText }:props) {
  const { data: users, currentUserId } = useMembers(projectId ?? null)

  return (
    <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{text}</h1>
          {
            newBtn ? (
              <Button onClick={onClick} disabled={users?.some(user=>user.user_id === currentUserId)} className={styles.buttonContainer} type="primary" shape="round" icon={<PlusCircleOutlined />}>{buttonText ?? 'Criar'}</Button>
            ): <></>
          }
        </div>
        {
          divider ? (
            <hr className={styles.divider} />
          ) : <></>
        }
    </div>
  );
};