import { motion } from "framer-motion";
import { C } from "../theme";

interface CodePanelProps {
  pseudocode: string[];
  activeLine: number;
  color: string;
}

export function CodePanel({ pseudocode, activeLine, color }: CodePanelProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
        style={{ borderBottom: `1px solid ${C.border}`, background: C.surf }}
      >
        <div className="flex gap-1.5">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, opacity: 0.5 }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.yellow, opacity: 0.5 }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, opacity: 0.5 }} />
        </div>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 11,
            color: C.muted,
            letterSpacing: 0.5,
            fontWeight: 600,
          }}
        >
          Pseudocode
        </span>
      </div>

      {/* Code lines */}
      <div className="flex-1 overflow-y-auto py-3">
        {pseudocode.map((line, i) => {
          const isActive = i === activeLine;
          return (
            <div key={i} className="relative">
              {isActive && (
                <motion.div
                  layoutId="codehighlight"
                  className="absolute inset-0"
                  style={{
                    background: `${color}15`,
                    borderLeft: `3px solid ${color}`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div
                className="relative flex px-4 py-0.5"
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 11,
                  lineHeight: 1.9,
                  color: isActive ? C.white : C.dimText,
                  fontWeight: isActive ? 600 : 400,
                  transition: "color 0.2s",
                }}
              >
                <span
                  className="mr-4 select-none"
                  style={{
                    width: 20,
                    textAlign: "right",
                    color: isActive ? color : C.dimText,
                    fontSize: 10,
                    flexShrink: 0,
                    fontWeight: 500,
                    lineHeight: 1.9,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" as const, minWidth: 0 }}>{line}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
