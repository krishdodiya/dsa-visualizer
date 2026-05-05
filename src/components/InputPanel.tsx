import { AlgoConfig } from "../types";
import { C } from "../theme";

interface InputPanelProps {
  algo: AlgoConfig;
  inputs: Record<string, string>;
  setInputs: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  onRun: () => void;
}

export function InputPanel({ algo, inputs, setInputs, onRun }: InputPanelProps) {
  return (
    <div
      className="flex-shrink-0"
      style={{
        padding: "14px 20px",
        background: C.surf,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div className="flex gap-3 flex-wrap items-end">
        {algo.inputs.map((inp) => (
          <div key={inp.id} className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: C.muted,
                fontWeight: 500,
                letterSpacing: 0.3,
              }}
            >
              {inp.label}
            </label>
            <input
              value={inputs[inp.id] || ""}
              onChange={(e) => setInputs((p) => ({ ...p, [inp.id]: e.target.value }))}
              placeholder={inp.placeholder}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "9px 12px",
                color: C.text,
                fontFamily: "'Fira Code', monospace",
                fontSize: 12,
                width: inp.isArray ? 260 : 100,
                transition: "border-color 0.15s, box-shadow 0.15s",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = C.cyan;
                e.target.style.boxShadow = `0 0 0 2px ${C.cyan}20`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = "none";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRun();
              }}
            />
          </div>
        ))}
        <button
          onClick={onRun}
          className="transition-all duration-150"
          style={{
            padding: "9px 22px",
            background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
            borderRadius: 8,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.3,
            cursor: "pointer",
            border: "none",
            boxShadow: `0 2px 10px ${C.cyan}30`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 4px 14px ${C.cyan}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 2px 10px ${C.cyan}30`;
          }}
        >
          ▶ Run
        </button>
      </div>
    </div>
  );
}
