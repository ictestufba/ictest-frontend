"use client";

import { isLoggedIn } from "@/lib/auth";
import type { MenuProps } from "antd";
import {
  Layout, Spin
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
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
  const router = useRouter();
  const params = useSearchParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedOption(e.key as NavbarOption);
  };
  const [selectedOption, setSelectedOption] = useState<NavbarOption>(params.get("default") === "false" ? "projects" : defaultNavbarOption);

  useEffect(() => {
    const loggedIn = isLoggedIn()

    if (!loggedIn){
      setIsPageLoading(true);
      router.push("/login");
    }
  }, [router]);

  return (
    <main>
      <Layout>
      <Spin spinning={isPageLoading} tip="carregando...">
        <Navbar selectedOption={selectedOption} onClick={onClick} setIsPageLoading={setIsPageLoading}/>
        <Layout.Content className={styles.layoutContent}>
          <NavbarCtx.Provider value={{selectedOption, setSelectedOption}}>
            {children}
          </NavbarCtx.Provider>
        </Layout.Content>
        </Spin>
      </Layout>

    </main>
  );
}
