import { Menu } from "antd";
import type { MenuProps } from "rc-menu";
import styles from "./styles.module.css";


type props = {
  items?: MenuProps['items'];
  mode: MenuProps['mode'];
};

export function RightMenu({ mode, items}:props){
  return (
    <Menu mode={mode} className={styles.menuHorizontal} items={items} />
  );
};