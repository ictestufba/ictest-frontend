import { api } from "@/lib/api";
import { TestCase } from "@/types/models";
import useSwr from "swr";

export function useTestCases(projectId: string) {
  const { data: testCases, isLoading, mutate } = useSwr<TestCase[]>(`/projects/${projectId}/test-cases`, async () => {
    const response = await api.get<{ testCases: TestCase[] }>(
      `/projects/${projectId}/test-cases`
    );

    return response.data.testCases;
  });

  return {
    testCases,
    isLoading,
    mutate
  };
}

