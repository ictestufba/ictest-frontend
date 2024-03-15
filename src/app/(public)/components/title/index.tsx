import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import styles from "./styles.module.css";

type props = {
  text: string;
  divider?: boolean;
  newBtn?: boolean
  onClick?: () => void;
};

export function CustomTitle({ text, divider, newBtn, onClick }:props) {
  return (
    <div className={styles.container}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{text}</h1>
          {
            newBtn ? (
              <Button onClick={onClick} className={styles.buttonContainer} type="primary" shape="round" icon={<PlusCircleOutlined />}>Criar</Button>
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