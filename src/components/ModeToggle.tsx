import { motion } from "framer-motion";
import { ViewMode } from "../types";
import { C } from "../theme";

interface ModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      className="flex items-center"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 3,
        gap: 2,
      }}
    >
      {(["learning", "debug"] as ViewMode[]).map((m) => {
        const isActive = mode === m;
        const isLearning = m === "learning";
        const color = isLearning ? C.green : C.orange;
        
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className="relative flex items-center gap-1.5 transition-all duration-200"
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              color: isActive ? color : C.muted,
              letterSpacing: 0.3,
              zIndex: isActive ? 1 : 0,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="mode-bg"
                className="absolute inset-0"
                style={{
                  background: `${color}15`,
                  borderRadius: 6,
                  border: `1px solid ${color}40`,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <span style={{ fontSize: 12 }}>{isLearning ? "📖" : "🔧"}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {isLearning ? "Learning" : "Debug"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
