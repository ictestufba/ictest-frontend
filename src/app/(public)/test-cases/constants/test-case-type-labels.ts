import { TestCase } from "@/types/models";

export const testCaselabelByType: Record<TestCase["type"], string> = {
  acceptance: "Aceitação",
  compatibility: "Compatibilidade",
  exploratory: "Exploratório",
  functional: "Funcional",
  integration: "Integração",
  other: "Outro",
  performance: "Performance",
  regression: "Regressão",
  security: "Segurança",
  smoke: "Fumaça",
  usability: "Usabilidade",
};
