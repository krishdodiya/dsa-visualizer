import { motion, AnimatePresence } from "framer-motion";
import { AlgoStep } from "../types";
import { C } from "../theme";
import { Cell } from "./Cell";

interface Props {
  step: AlgoStep;
}

const bracketColor: Record<string, string> = {
  "(": C.cyan,
  ")": C.cyan,
  "[": C.purple,
  "]": C.purple,
  "{": C.yellow,
  "}": C.yellow,
};

export function StackViz({ step }: Props) {
  const { data, highlights, phase } = step;
  const s: string = data.s || "";
  const stack: string[] = data.stack || [];
  const curIdx: number = highlights.curIdx ?? -1;
  const action: string = highlights.action || "";

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {/* String display */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {s.split("").map((ch, i) => {
          let bg = C.card;
          let border = C.border;
          let color = bracketColor[ch] || C.text;
          let glow = false;

          if (i === curIdx) {
            if (action === "mismatch" || phase === "invalid") {
              bg = C.redBg;
              border = C.red;
              color = C.red;
              glow = true;
            } else if (action === "push") {
              bg = C.cyanBg;
              border = C.cyan;
              color = C.cyan;
              glow = true;
            } else if (action === "pop") {
              bg = C.greenBg;
              border = C.green;
              color = C.green;
              glow = true;
            } else {
              bg = C.yellowBg;
              border = C.yellow;
              glow = true;
            }
          } else if (i < curIdx && phase !== "start") {
            color = C.muted;
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

      {/* Stack visualization */}
      <div className="flex flex-col items-center gap-2">
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: C.muted,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Stack (top →)
        </div>
        <div
          className="flex items-center gap-1.5"
          style={{
            minHeight: 50,
            padding: "8px 14px",
            background: C.card,
            borderRadius: 10,
            border: `1px solid ${C.border}`,
          }}
        >
          <AnimatePresence mode="popLayout">
            {stack.length === 0 ? (
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  color: C.dimText,
                  fontSize: 12,
                  fontFamily: "'Fira Code', monospace",
                  fontStyle: "italic",
                }}
              >
                [ empty ]
              </motion.span>
            ) : (
              stack.map((ch, i) => (
                <motion.div
                  key={`${i}-${ch}`}
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  style={{
                    width: 40,
                    height: 40,
                    background: i === stack.length - 1 ? C.cyanBg : C.surf,
                    border: `2px solid ${i === stack.length - 1 ? C.cyan : C.border}`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: bracketColor[ch] || C.text,
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  {ch}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result indicator */}
      {phase === "done" && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-5 py-2.5 rounded-lg"
          style={{
            background: C.greenBg,
            border: `1px solid ${C.green}`,
            color: C.green,
            fontFamily: "'Fira Code', monospace",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          ✓ VALID
        </motion.div>
      )}
      {phase === "invalid" && curIdx === -1 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-5 py-2.5 rounded-lg"
          style={{
            background: C.redBg,
            border: `1px solid ${C.red}`,
            color: C.red,
            fontFamily: "'Fira Code', monospace",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          ✗ INVALID — unmatched brackets
        </motion.div>
      )}
    </div>
  );
}
