import { TestCase } from "@/types/models";

export function mapProjectStatus(cases: TestCase[]) {
  const statusList = cases?.map(testCase=>testCase.status);

  let openCount = 0;
  let successCount = 0;

  for (const status of statusList) {
    if (status === "open") openCount++;
    if (status === "success") successCount++;
  }
  console.log(openCount, successCount, cases.length, cases)
  if (openCount === cases.length) {
    return "Criado";
  }
 
  if (successCount === cases.length) {
    return "Finalizado";
  } 

  return "Em Progresso";
}

