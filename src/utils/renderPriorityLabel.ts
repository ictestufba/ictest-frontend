export function renderPriorityLabel(priority:string) {
  if (priority === "high") return "Prioridade Alta";
  if (priority === "low") return "Prioridade Baixa";
  if (priority === "medium") return "Prioridade Média";

  return null;
}