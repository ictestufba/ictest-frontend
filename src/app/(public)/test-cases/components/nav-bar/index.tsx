import { api } from "@/lib/api";
import { Project, TestCase } from "@/types/models";
import { AuditOutlined, LaptopOutlined } from "@ant-design/icons";
import { Menu, MenuProps, Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSwr from "swr";

type ProjectsResponse = {
  projects: Project[];
};

type ProjectTestCasesResponse = {
  testCases: TestCase[];
};

export function NavBar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>();

  const {
    data: projects,
    error,
    isLoading,
  } = useSwr("projects", async () => {
    const response = await api.get<ProjectsResponse>("/projects");

    return response.data.projects;
  });

  const { data: testCases } = useSwr<Record<string, TestCase[]>>(
    ["/projects/all/test-cases", projects],
    async () => {
      if (!projects) return undefined;

      const promises = projects.map(async (project) => {
        const response = await api.get<ProjectTestCasesResponse>(
          `/projects/${project.id}/test-cases`
        );

        return response.data.testCases;
      });
      const testCases = await Promise.all(promises);
      const testCasesEntries = projects.map((project, index) => [
        project.id,
        testCases[index],
      ]);
      const testCaseByProject = Object.fromEntries(testCasesEntries);
      return testCaseByProject;
    }
  );

  const itens = React.useMemo<MenuProps["items"]>(() => {
    if (!projects) return undefined;

    return projects.map((project, index) => {
      const projectTestCases = testCases?.[project.id] ?? [];

      const children = projectTestCases?.map((testCase) => ({
        key: testCase.id,
        icon: React.createElement(AuditOutlined),
        label: testCase.title,
      }));

      return {
        key: project.id,
        icon: React.createElement(LaptopOutlined),
        label: project.name,
        children: children,
      };
    });
  }, [projects, testCases]);

  useEffect(() => {
    if (!activeTab) return;

    const refirect = (projectId: string) => {
      router.push(`/test-cases/${projectId}`);
    };

    refirect(activeTab);
  }, [router, activeTab]);

  if (isLoading) return <Spin />;
  if (error) return null;

  return (
    <Menu
      mode="inline"
      // defaultSelectedKeys={["1"]}
      // defaultOpenKeys={["sub1"]}
      openKeys={activeTab ? [activeTab] : []}
      style={{ height: "100%", borderRight: 0 }}
      items={itens}
      onOpenChange={(keys) => {
        const key = keys.find((key) => key !== activeTab);
        setActiveTab(key);
      }}
    />
  );
}
