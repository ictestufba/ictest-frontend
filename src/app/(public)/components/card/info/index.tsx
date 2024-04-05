import { Card, Space, Statistic } from 'antd';
import styles from "./styles.module.css";

const { Meta } = Card;

type props = {
  title:string;
  icon: React.ReactNode;
  value: number | string;
  isLoading: boolean;
};


export function InfoCard({title, icon, value, isLoading}:props) {
  return (
    <div className={styles.container}>
      <Card className={styles.cardContainer}>
        <Space direction="horizontal" className={styles.test}>
          {icon}
          <Statistic title={title} value={value} loading={isLoading} />
        </Space>
      </Card>
    </div>
  );
};