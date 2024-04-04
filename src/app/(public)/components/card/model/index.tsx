import { ProjectStatus } from '@/utils/mapProjectStatus';
import { Avatar, Card, Divider } from 'antd';
import styles from "./styles.module.css";

const { Meta } = Card;

type props = {
  id: string
  title:string;
  status?: ProjectStatus;
  description?:string;
  bottomText:string;
  onClick: () => void;
};

export function ModelCard({id, title, description, bottomText, onClick, status}:props) {
  const getStyleByStatus = () => {
    switch (status) {
      case "Criado":
        return styles.createdContainer;
      case "Em Progresso":
        return styles.inProgressContainer;
      case "Finalizado":
        return styles.finishedContainer;
      case "Erro":
        return styles.errorContainer;
      default:
        return styles.createdContainer;
    }
  }
  return (
    <div className={getStyleByStatus()}>
      <div className={styles.labelContainer}>{status?.toUpperCase()}</div>
      <Card 
        id={id}
        className={styles.card}
        onClick={onClick}
        hoverable
      >
        <Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
          title={title}
          description={description}
        />
        <Divider />
        <Meta
          description= {bottomText}
        />
      </Card>
    </div>
  );
};