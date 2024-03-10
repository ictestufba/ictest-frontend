import { LogoutOutlined, MenuOutlined, ProjectOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Drawer, Layout } from "antd";
import { useEffect, useState } from "react";
import { LeftMenu } from "./LeftMenu";
import { RightMenu } from "./RightMenu";
import styles from "./styles.module.css";

export type NavbarOption = "teams" | "projects";

const menuItems: { left: MenuProps['items'], right: MenuProps['items'] } = {
  left: [
    {
      label: 'Times',
      key: 'teams',
      icon: <TeamOutlined />,
      className: styles.menuItem
    },
    {
      label: 'Projetos',
      key: 'projects',
      icon: <ProjectOutlined />,
      className: styles.menuItem
    },
  ],
  right: [
    {
      label:(
        <>
          <Avatar icon={<UserOutlined />} />
          <span className={styles.username}>John Doe</span>
        </>
      ),
      key: "submenu",
      className: styles.submenu,
      children: [
        {
          label: 'Logout',
          key: 'logout',
          icon: <LogoutOutlined />,
          className: styles.menuItem,
        }
      ],
    },
  ],
}

type props = {
  selectedOption: NavbarOption;
  onClick: MenuProps['onClick'];
};

export function Navbar({ selectedOption, onClick }:props) {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(!visible);
  };

  const handleResize = () => {
    setVisible(false);
  }

  useEffect(() => {
    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <nav className={styles.navbar}>
      <Layout>
        <Layout.Header className={styles.navHeader}>
          <div className={styles.logo}>
            <h3 className={styles.brandFont}>ICTEST</h3>
          </div>
          <div className={styles.navbarMenu}>
            <div className={styles.leftMenu}>
              <LeftMenu mode={"horizontal"} items={menuItems.left} selectedKeys={[selectedOption]} onClick={onClick}/>
            </div>
            <Button className={styles.menuButton} type="text" onClick={showDrawer}>
              <MenuOutlined />
            </Button>
            <div className={styles.rightMenu}>
              <RightMenu mode={"horizontal"} items={menuItems.right}/>
            </div>

            <Drawer
              title={"Brand Here"}
              placement="right"
              closable={true}
              onClose={showDrawer}
              open={visible}
              style={{ zIndex: 99999 }}
              className={styles.drawerBody}
            >
              <LeftMenu mode={"inline"} items={menuItems.left} selectedKeys={[selectedOption]} onClick={onClick}/>
              <RightMenu mode={"inline"} items={menuItems.right}/>
            </Drawer>
          </div>
        </Layout.Header>
      </Layout>
    </nav>
  );
};