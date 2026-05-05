import { AlgoStep } from "../types";
import { ArrayViz } from "./ArrayViz";
import { TwoSumViz } from "./TwoSumViz";
import { StringViz } from "./StringViz";
import { LinkedListViz } from "./LinkedListViz";
import { GraphViz } from "./GraphViz";
import { StackViz } from "./StackViz";
import { C } from "../theme";

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{ height: 180, color: C.muted }}
    >
      <div
        style={{
          fontSize: 42,
          opacity: 0.25,
          fontFamily: "'Fira Code', monospace",
        }}
      >
        {"</>"}
      </div>
      <div className="text-center" style={{ maxWidth: 300 }}>
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Configure inputs above and click{" "}
          <span style={{ color: C.cyan, fontWeight: 600 }}>Run</span> to start
          the visualization
        </p>
      </div>
    </div>
  );
}

export function renderVisualization(
  step: AlgoStep | null,
  vizType?: string,
  expanded?: boolean
) {
  if (!step) return <EmptyState />;
  const type = vizType || "array";
  switch (type) {
    case "array":
    case "bsearch":
    case "window":
      return <ArrayViz step={step} />;
    case "twosum":
      return <TwoSumViz step={step} />;
    case "string":
      return <StringViz step={step} />;
    case "linkedlist":
      return <LinkedListViz step={step} />;
    case "graph":
      return <GraphViz step={step} expanded={expanded} />;
    case "stack":
      return <StackViz step={step} />;
    default:
      return <ArrayViz step={step} />;
  }
}

export function isGraphAlgorithm(vizType?: string): boolean {
  return vizType === "graph";
}
