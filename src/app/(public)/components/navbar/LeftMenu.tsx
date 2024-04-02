import { Menu } from "antd";
import type { MenuProps } from "rc-menu";
import styles from "./styles.module.css";

type props = {
  mode: MenuProps['mode'];
  items?: MenuProps['items'];
  selectedKeys?: MenuProps['selectedKeys'];
  onClick?: MenuProps['onClick'];
};

export function LeftMenu({ mode, items, selectedKeys, onClick }:props) {
  return (
    <Menu mode={mode} className={styles.menuHorizontal} items={items} selectedKeys={selectedKeys} onClick={onClick}/>
  );
};
