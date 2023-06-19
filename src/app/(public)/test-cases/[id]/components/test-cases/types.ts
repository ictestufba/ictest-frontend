export interface TestCasesProps {
  projectId: string;
  onEditError: () => void;
  onEditSuccess: () => void;
  onCreateError: () => void;
  onCreateSuccess: () => void;
}
