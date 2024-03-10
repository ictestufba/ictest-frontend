import { Avatar, Card, Divider } from 'antd';
import styles from "./styles.module.css";

const { Meta } = Card;

type props = {
  id: string
  title:string;
  description:string;
  bottomText:string;
  onClick: () => void;
};

export function ModelCard({id, title, description, bottomText, onClick}:props) {
  return (
    <div className={styles.container}>
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