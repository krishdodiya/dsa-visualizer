import { C } from "../theme";

interface ControlsProps {
  steps: number;
  idx: number;
  setIdx: (fn: (prev: number) => number) => void;
  playing: boolean;
  setPlaying: (fn: (prev: boolean) => boolean) => void;
  speed: number;
  setSpeed: (s: number) => void;
}

function NavBtn({
  children,
  onClick,
  title,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="transition-all duration-150"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        color: disabled ? C.dimText : C.text,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        padding: "8px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = C.cyan;
          e.currentTarget.style.color = C.cyan;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.color = disabled ? C.dimText : C.text;
      }}
    >
      {children}
    </button>
  );
}

export function Controls({
  steps,
  idx,
  setIdx,
  playing,
  setPlaying,
  speed,
  setSpeed,
}: ControlsProps) {
  if (steps <= 0) return null;
  const pct = steps > 1 ? (idx / (steps - 1)) * 100 : 0;
  const isFirst = idx === 0;
  const isLast = idx === steps - 1;

  return (
    <div
      style={{
        background: C.surf,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "14px 18px",
      }}
      className="flex flex-col gap-3"
    >
      {/* Progress bar */}
      <div
        style={{
          height: 4,
          background: C.card,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(to right, ${C.cyan}, ${C.purple})`,
            borderRadius: 2,
            transition: "width 0.2s ease",
          }}
        />
      </div>

      {/* Buttons row */}
      <div className="flex gap-2 items-center flex-wrap">
        <NavBtn
          onClick={() => {
            setIdx(() => 0);
            setPlaying(() => false);
          }}
          title="First step"
          disabled={isFirst}
        >
          ⏮
        </NavBtn>
        <NavBtn onClick={() => setIdx((s) => Math.max(0, s - 1))} title="Previous" disabled={isFirst}>
          ◀
        </NavBtn>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="transition-all duration-150"
          style={{
            padding: "8px 20px",
            background: playing ? C.orangeBg : C.cyanBg,
            border: `1px solid ${playing ? C.orange : C.cyan}`,
            borderRadius: 8,
            color: playing ? C.orange : C.cyan,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            minWidth: 85,
          }}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>

        <NavBtn
          onClick={() => setIdx((s) => Math.min(steps - 1, s + 1))}
          title="Next"
          disabled={isLast}
        >
          ▶
        </NavBtn>
        <NavBtn
          onClick={() => {
            setIdx(() => steps - 1);
            setPlaying(() => false);
          }}
          title="Last step"
          disabled={isLast}
        >
          ⏭
        </NavBtn>

        {/* Speed control */}
        <div
          className="flex items-center gap-2 ml-4"
          style={{
            padding: "6px 12px",
            background: C.card,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              color: C.muted,
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            Speed
          </span>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={2100 - speed}
            onChange={(e) => setSpeed(2100 - Number(e.target.value))}
            style={{ width: 70, accentColor: C.cyan, cursor: "pointer" }}
          />
          <span
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 10,
              color: C.cyan,
              minWidth: 34,
              fontWeight: 600,
            }}
          >
            {(1000 / speed).toFixed(1)}x
          </span>
        </div>

        {/* Step indicator */}
        <div
          className="ml-auto"
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 11,
            color: C.muted,
          }}
        >
          <span style={{ color: C.text, fontWeight: 600 }}>{idx + 1}</span>
          <span style={{ opacity: 0.5 }}> / </span>
          <span>{steps}</span>
        </div>
      </div>
    </div>
  );
}
