// ═══════════════════════════════════════════════════════════
//  STANDARDIZED STEP FORMAT
// ═══════════════════════════════════════════════════════════

export interface AlgoStep {
  step: number;
  description: string;
  why: string;           // WHY this step happened
  data: Record<string, any>;
  highlights: Record<string, any>;
  variables: Record<string, string | number | boolean>;
  phase: string;
  codeLine: number;      // which line of pseudocode to highlight
}

export interface AlgoInput {
  id: string;
  label: string;
  placeholder: string;
  def: string;
  isArray?: boolean;
  type?: "text" | "number";
}

export interface AlgoConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  color: string;
  inputs: AlgoInput[];
  pseudocode: string[];
  run: (inputs: Record<string, string>) => AlgoStep[];
  vizType: "array" | "bsearch" | "twosum" | "string" | "window" | "linkedlist" | "graph" | "stack";
}

export type ViewMode = "learning" | "debug";
