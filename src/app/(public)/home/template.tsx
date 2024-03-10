"use client";

import type { MenuProps } from "antd";
import {
  Layout
} from "antd";
import React, { createContext, useState } from "react";
import { Navbar, NavbarOption } from "../components/navbar";
import { defaultNavbarOption } from "./constants";
import styles from "./styles.module.css";

export const NavbarCtx = createContext<{ 
  selectedOption: NavbarOption,
  setSelectedOption: (value: React.SetStateAction<NavbarOption>) => void
}>({ 
  selectedOption:defaultNavbarOption,
  setSelectedOption: () => {} 
});

export default function HomeTemplate({
  children,
}: React.PropsWithChildren) {
  const [selectedOption, setSelectedOption] = useState<NavbarOption>(defaultNavbarOption);
  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedOption(e.key as NavbarOption);
  };

  return (
    <main>
      <Layout>
        <Navbar selectedOption={selectedOption} onClick={onClick} />
        <Layout.Content className={styles.layoutContent}>
          <NavbarCtx.Provider value={{selectedOption, setSelectedOption}}>
            {children}
          </NavbarCtx.Provider>
        </Layout.Content>
      </Layout>
    </main>
  );
}
