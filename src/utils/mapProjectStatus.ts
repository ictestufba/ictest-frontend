import { TestCase } from "@/types/models";

export type ProjectStatus = "Criado" | "Em Progresso" | "Erro" | "Finalizado";

export function mapProjectStatus(cases: TestCase[]):ProjectStatus {
  const statusList = cases?.map(testCase=>testCase.status) ?? [];

  let openCount = 0;
  let successCount = 0;

  for (const status of statusList) {
    if (status === "open") openCount++;
    if (status === "success") successCount++;
    if (status === "error") {
      return "Erro";
    };
  }

  if (openCount === cases.length) {
    return "Criado";
  }
 
  if (successCount === cases.length) {
    return "Finalizado";
  } 

  return "Em Progresso";
}

