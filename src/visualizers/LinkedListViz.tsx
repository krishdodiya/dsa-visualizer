import { AlgoStep } from "../types";
import { C } from "../theme";
import { Cell } from "./Cell";

interface Props {
  step: AlgoStep;
}

export function LinkedListViz({ step }: Props) {
  const { data, highlights, phase } = step;
  const nodes: number[] = data.nodes || [];
  const prev: number = highlights.prev ?? -1;
  const curr: number = highlights.curr ?? -1;
  const next: number = highlights.next ?? -1;

  const getNodeStyle = (i: number) => {
    if (phase === "done") {
      return { bg: C.greenBg, border: C.green, color: C.green, glow: true };
    }
    if (i === curr && curr < nodes.length) {
      return { bg: C.cyanBg, border: C.cyan, color: C.cyan, glow: true };
    }
    if (i === prev && prev >= 0) {
      return { bg: C.orangeBg, border: C.orange, color: C.orange, glow: false };
    }
    if (i === next && next >= 0 && next < nodes.length) {
      return { bg: C.yellowBg, border: C.yellow, color: C.yellow, glow: false };
    }
    return { bg: C.card, border: C.border, color: C.text, glow: false };
  };

  const getLabel = (i: number) => {
    const labels: string[] = [];
    if (i === curr && curr < nodes.length) labels.push("curr");
    if (i === prev && prev >= 0) labels.push("prev");
    if (i === next && next >= 0 && next < nodes.length) labels.push("next");
    return labels.join("/") || undefined;
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      {/* Linked list visualization */}
      <div className="flex items-center flex-wrap gap-2 justify-center">
        {nodes.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <Cell val={v} label={getLabel(i)} size={54} {...getNodeStyle(i)} />
            {i < nodes.length - 1 && (
              <span
                style={{
                  color: C.muted,
                  fontSize: 20,
                  marginTop: 20,
                  fontWeight: 300,
                }}
              >
                →
              </span>
            )}
          </div>
        ))}
        <span
          style={{
            color: C.dimText,
            fontFamily: "'Fira Code', monospace",
            fontSize: 12,
            marginTop: 20,
            marginLeft: 8,
            fontWeight: 500,
          }}
        >
          → null
        </span>
      </div>

      {/* Legend */}
      <div
        className="flex gap-5"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          padding: "8px 16px",
          background: C.card,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
        }}
      >
        {[
          { c: C.cyan, l: "curr" },
          { c: C.orange, l: "prev" },
          { c: C.yellow, l: "next" },
          { c: C.green, l: "done" },
        ].map(({ c, l }) => (
          <div key={l} className="flex items-center gap-2">
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: `${c}30`,
                border: `2px solid ${c}`,
              }}
            />
            <span style={{ color: C.muted, fontWeight: 500 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
