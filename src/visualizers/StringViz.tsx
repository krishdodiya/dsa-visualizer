import { motion } from "framer-motion";
import { AlgoStep } from "../types";
import { C } from "../theme";
import { Cell } from "./Cell";

interface Props {
  step: AlgoStep;
}

export function StringViz({ step }: Props) {
  const { data, phase } = step;
  const s: string = data.s || "";
  const left: number = data.left ?? 0;
  const right: number = data.right ?? -1;
  const cmap: Record<string, number> = data.cmap || {};
  const maxLen: number = data.maxLen ?? 0;
  const maxStart: number = data.maxStart ?? 0;

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      {/* String characters */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {s.split("").map((ch, i) => {
          const inWin = i >= left && i <= right;
          const isDone = phase === "done";
          let bg = C.card;
          let border = C.border;
          let color = C.text;
          let glow = false;

          if (isDone && i >= maxStart && i < maxStart + maxLen) {
            bg = C.greenBg;
            border = C.green;
            color = C.green;
            glow = true;
          } else if (inWin && phase === "shrink" && i === right) {
            bg = C.redBg;
            border = C.red;
            color = C.red;
            glow = true;
          } else if (inWin) {
            bg = C.purpleBg;
            border = C.purple;
            color = C.purple;
          }

          return (
            <Cell
              key={i}
              val={ch}
              idx={i}
              bg={bg}
              border={border}
              color={color}
              size={42}
              glow={glow}
            />
          );
        })}
      </div>

      {/* Window info */}
      <div
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 12,
          padding: "8px 16px",
          background: C.card,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
          display: "flex",
          flexWrap: "wrap" as const,
          gap: "4px 24px",
          maxWidth: "100%",
          overflowWrap: "break-word" as const,
          wordBreak: "break-all" as const,
          minWidth: 0,
        }}
      >
        <span>
          <span style={{ color: C.muted }}>window: </span>
          <span style={{ color: C.purple, fontWeight: 600 }}>
            "{left <= right ? s.slice(left, right + 1) : ""}"
          </span>
        </span>
        <span>
          <span style={{ color: C.muted }}>maxLen: </span>
          <span style={{ color: C.green, fontWeight: 600 }}>{maxLen}</span>
        </span>
      </div>

      {/* Character map */}
      {Object.keys(cmap).length > 0 && (
        <div style={{ width: "100%", maxWidth: 480, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: C.muted,
              marginBottom: 8,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Char Map (char → last index)
          </div>
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {Object.entries(cmap).map(([ch, ix]) => (
              <motion.span
                key={ch}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  background: C.surf,
                  border: `1px solid ${C.border}`,
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 12,
                }}
              >
                <span style={{ color: C.purple, fontWeight: 600 }}>'{ch}'</span>
                <span style={{ color: C.dimText, margin: "0 4px" }}>→</span>
                <span style={{ color: C.yellow, fontWeight: 600 }}>{ix}</span>
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
