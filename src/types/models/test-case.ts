export type TestCase = {
  project_id: string;
  id: string;
  title: string;
  // status: "actual" | "draft" | "deprecated";
  assigned_to: string | null;
  deadline?: string | null;
  status?: "error" | "success" | "in_progress" | "open";
  description?: string;
  severity:
    | "not_set"
    | "blocker"
    | "critical"
    | "major"
    | "normal"
    | "minor"
    | "trivial";

  priority: "not_set" | "high" | "medium" | "low";
  type:
    | "other"
    | "functional"
    | "smoke"
    | "regression"
    | "security"
    | "usability"
    | "performance"
    | "acceptance"
    | "compatibility"
    | "integration"
    | "exploratory";

  layer: "not_set" | "e2e" | "api" | "unit";
  is_flaky: boolean;
  behavior: "not_set" | "positive" | "negative" | "destructive";
  automation_status: "not_automated" | "to_be_automated" | "automated";
  pre_conditions?: string;
  post_conditions?: string;
  created_at: string;
};
