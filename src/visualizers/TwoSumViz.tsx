import { motion, AnimatePresence } from "framer-motion";
import { AlgoStep } from "../types";
import { C } from "../theme";
import { Cell } from "./Cell";

interface Props {
  step: AlgoStep;
}

export function TwoSumViz({ step }: Props) {
  const { data, highlights, phase } = step;
  const arr: number[] = data.arr || [];
  const map: Record<string, number> = data.map || {};
  const comp: number | undefined = data.complement;
  const curIdx: number = highlights.curIdx ?? -1;
  const found: number[] = highlights.found || [];

  return (
    <div className="flex flex-col gap-5 items-center w-full">
      {/* Array display */}
      <div className="flex flex-wrap gap-2 justify-center">
        {arr.map((v, i) => {
          let bg = C.card;
          let border = C.border;
          let color = C.text;
          let glow = false;

          if (phase === "found" && found.includes(i)) {
            bg = C.greenBg;
            border = C.green;
            color = C.green;
            glow = true;
          } else if (i === curIdx) {
            bg = C.cyanBg;
            border = C.cyan;
            color = C.cyan;
            glow = true;
          }

          return (
            <Cell key={i} val={v} idx={i} bg={bg} border={border} color={color} glow={glow} />
          );
        })}
      </div>

      {/* Complement indicator */}
      <AnimatePresence>
        {comp !== undefined && phase === "check" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-2 rounded-full"
            style={{
              background: C.purpleBg,
              border: `1px solid ${C.purple}50`,
              color: C.purple,
              fontFamily: "'Fira Code', monospace",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            looking for complement: <span style={{ color: C.white }}>{comp}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hashmap display */}
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
          Hashmap (value → index)
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
            minHeight: 48,
          }}
        >
          {!Object.keys(map).length ? (
            <span
              style={{
                color: C.dimText,
                fontFamily: "'Fira Code', monospace",
                fontSize: 12,
                fontStyle: "italic",
              }}
            >
              {"{ empty }"}
            </span>
          ) : (
            Object.entries(map).map(([k, v]) => (
              <motion.span
                key={k}
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
                <span style={{ color: C.cyan, fontWeight: 600 }}>{k}</span>
                <span style={{ color: C.dimText, margin: "0 4px" }}>→</span>
                <span style={{ color: C.yellow, fontWeight: 600 }}>{v}</span>
              </motion.span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
