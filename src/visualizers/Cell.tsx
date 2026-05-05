import { motion } from "framer-motion";
import { C } from "../theme";

interface CellProps {
  val: string | number;
  idx?: number;
  label?: string;
  bg?: string;
  border?: string;
  color?: string;
  size?: number;
  glow?: boolean;
}

export function Cell({
  val,
  idx,
  label,
  bg = C.card,
  border = C.border,
  color = C.text,
  size = 48,
  glow = false,
}: CellProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Label (for pointers like L, M, R) */}
      <div className="h-4 flex items-center justify-center">
        {label && (
          <span
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: border,
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Cell box */}
      <motion.div
        layout
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: size,
          height: size,
          background: bg,
          border: `2px solid ${border}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Fira Code', monospace",
          fontSize: size < 42 ? 12 : 14,
          fontWeight: 700,
          color,
          boxShadow: glow
            ? `0 0 16px ${border}50, 0 0 6px ${border}30`
            : "none",
          transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
        }}
      >
        {val}
      </motion.div>

      {/* Index */}
      {idx !== undefined && (
        <span
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            color: C.muted,
            fontWeight: 500,
          }}
        >
          {idx}
        </span>
      )}
    </div>
  );
}
