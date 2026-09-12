export type LearningTrack = "dataform" | "dbt";

export interface CheckpointQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PhaseTask {
  id: string;
  title: string;
  instruction: string;
  dataformSnippet?: string;
  dbtSnippet?: string;
  keyTrapAlert?: string;
  verificationTip?: string;
}

export interface Phase {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  estimatedHours: string;
  objectives: string[];
  deliverable: string;
  trapsHighlighted: string[];
  tasks: PhaseTask[];
  checkpoint: CheckpointQuestion[];
}

export interface ModelComparison {
  name: string;
  category: "staging" | "intermediate" | "mart" | "assertion";
  description: string;
  keyTrapAvoided: string;
  dataformCode: string;
  dbtCode: string;
  differences: string[];
}
