export function renderStatusLabel(status?: string) {
  if (status === "error") return "Erro";
  if (status === "in_progress") return "Em progresso";
  if (status === "success") return "Sucesso";

  return "Aberto";
}

