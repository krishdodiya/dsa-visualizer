import { motion } from "framer-motion";
import { C } from "../theme";

interface VarsPanelProps {
  vars: Record<string, string | number | boolean>;
}

export function VarsPanel({ vars }: VarsPanelProps) {
  if (!vars || !Object.keys(vars).length) return null;

  return (
    <div
      style={{
        padding: "12px 14px",
        background: C.card,
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          color: C.muted,
          letterSpacing: 1,
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        Variables
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {Object.entries(vars).map(([k, v]) => (
          <motion.span
            key={k}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              background: C.surf,
              border: `1px solid ${C.border}`,
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
              lineHeight: 1.5,
              maxWidth: "100%",
              overflowWrap: "break-word" as const,
              wordBreak: "break-all" as const,
            }}
          >
            <span style={{ color: C.cyan, fontWeight: 500 }}>{k}</span>
            <span style={{ color: C.dimText, margin: "0 4px" }}>=</span>
            <span style={{ color: C.yellow, fontWeight: 600 }}>{String(v)}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}
