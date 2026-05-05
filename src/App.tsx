import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { C } from "./theme";
import { AlgoStep, ViewMode } from "./types";
import { ALGORITHMS } from "./algorithms";
import { renderVisualization, isGraphAlgorithm } from "./visualizers";
import { Sidebar } from "./components/Sidebar";
import { InputPanel } from "./components/InputPanel";
import { Controls } from "./components/Controls";
import { CodePanel } from "./components/CodePanel";
import { VarsPanel } from "./components/VarsPanel";
import { ModeToggle } from "./components/ModeToggle";

function phaseColor(phase: string | undefined): string {
  if (!phase) return C.cyan;
  if (["found", "done", "pass_done", "new_max", "merge_done", "partition_done", "pop", "advance"].includes(phase)) return C.green;
  if (["not_found", "shrink", "invalid", "mismatch"].includes(phase)) return C.red;
  if (["swapped", "will_swap"].includes(phase)) return C.orange;
  if (["relax", "enqueue", "push"].includes(phase)) return C.yellow;
  return C.cyan;
}

export default function App() {
  const [selId, setSelId] = useState("bubbleSort");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [steps, setSteps] = useState<AlgoStep[]>([]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [viewMode, setViewMode] = useState<ViewMode>("learning");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const algo = ALGORITHMS.find(a => a.id === selId)!;
  const isGraph = isGraphAlgorithm(algo?.vizType);

  // Init inputs when algo changes
  useEffect(() => {
    if (!algo) return;
    const init: Record<string, string> = {};
    algo.inputs.forEach(i => { init[i.id] = i.def; });
    setInputs(init);
    setSteps([]);
    setIdx(0);
    setPlaying(false);
  }, [selId]);

  // Auto-play timer
  useEffect(() => {
    if (playing && steps.length > 0) {
      const interval = viewMode === "debug" ? Math.max(speed * 0.5, 100) : speed;
      timerRef.current = setInterval(() => {
        setIdx(p => {
          if (p >= steps.length - 1) {
            setPlaying(false);
            return p;
          }
          return p + 1;
        });
      }, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, steps.length, viewMode]);

  const run = useCallback(() => {
    if (!algo) return;
    try {
      const s = algo.run(inputs);
      setSteps(s);
      setIdx(0);
      setPlaying(false);
    } catch (e) {
      console.error(e);
    }
  }, [algo, inputs]);

  const step: AlgoStep | null = steps[idx] || null;

  return (
    <div
      className="flex flex-col"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════════ */}
      <header
        className="flex items-center justify-between px-5 flex-shrink-0"
        style={{
          height: 58,
          background: C.surf,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Left: Logo + Mode Toggle */}
        <div className="flex items-center gap-5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${C.cyan}, ${C.purple})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                color: "#fff",
                fontWeight: 700,
                boxShadow: `0 2px 12px ${C.cyan}30`,
              }}
            >
              {"<>"}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: -0.5,
                  color: C.white,
                }}
              >
                DSA Visualizer
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: 0.5,
                }}
              >
                Algorithm Learning Tool
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 28,
              background: C.border,
              marginLeft: 4,
            }}
          />

          {/* Mode Toggle */}
          <ModeToggle mode={viewMode} onChange={setViewMode} />
        </div>

        {/* Right: Stats & Controls */}
        <div className="flex gap-4 items-center">
          {/* Code panel toggle */}
          <button
            onClick={() => setShowCode(p => !p)}
            className="transition-all duration-150"
            style={{
              background: showCode ? C.cyanBg : C.card,
              border: `1px solid ${showCode ? C.cyan : C.border}`,
              borderRadius: 6,
              padding: "5px 12px",
              color: showCode ? C.cyan : C.muted,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {showCode ? "◧ Code" : "□ Code"}
          </button>

          {/* Complexity badges */}
          {algo && (
            <div
              className="flex items-center gap-2"
              style={{
                padding: "5px 12px",
                background: C.card,
                borderRadius: 6,
                border: `1px solid ${C.border}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 11,
                  color: algo.color,
                  fontWeight: 600,
                }}
              >
                {algo.timeComplexity}
              </span>
              <span style={{ color: C.dimText }}>·</span>
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 11,
                  color: C.muted,
                }}
              >
                {algo.spaceComplexity}
              </span>
            </div>
          )}

          {/* Step counter */}
          {steps.length > 0 && (
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 11,
                color: C.cyan,
                padding: "5px 12px",
                background: C.cyanBg,
                borderRadius: 6,
                border: `1px solid ${C.cyan}30`,
                fontWeight: 600,
              }}
            >
              {idx + 1} / {steps.length}
            </div>
          )}
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          BODY
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedId={selId}
          onSelect={setSelId}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Input panel */}
          <InputPanel algo={algo} inputs={inputs} setInputs={setInputs} onRun={run} />

          {/* Visualization + Code split */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Visualization Area */}
            <div
              className="flex-1 overflow-y-auto flex flex-col gap-3"
              style={{
                padding: isGraph ? "20px 24px" : "16px 20px",
                minWidth: 0,
                overflowX: "hidden",
              }}
            >
              {/* Step description card */}
              <AnimatePresence mode="wait">
                {step && (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      padding: "12px 16px",
                      background: C.card,
                      borderRadius: 10,
                      borderLeft: `4px solid ${phaseColor(step.phase)}`,
                      fontFamily: "'Fira Code', monospace",
                      fontSize: 12,
                      color: C.text,
                      lineHeight: 1.7,
                      overflowWrap: "break-word" as const,
                      wordBreak: "break-word" as const,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        color: phaseColor(step.phase),
                        marginRight: 10,
                        fontSize: 10,
                        fontWeight: 700,
                        opacity: 0.8,
                      }}
                    >
                      [{idx + 1}]
                    </span>
                    {step.description}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* WHY panel — only in learning mode */}
              <AnimatePresence>
                {viewMode === "learning" && step?.why && (
                  <motion.div
                    key={`why-${step.step}`}
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: "12px 16px",
                      background: `${phaseColor(step.phase)}08`,
                      borderRadius: 10,
                      border: `1px solid ${phaseColor(step.phase)}20`,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: C.text,
                      lineHeight: 1.8,
                      overflowWrap: "break-word" as const,
                      wordBreak: "break-word" as const,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        color: phaseColor(step.phase),
                        fontWeight: 700,
                        fontSize: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginRight: 10,
                      }}
                    >
                      💡 WHY
                    </span>
                    {step.why}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ══════════════════════════════════════════════════════════════
                  MAIN VISUALIZATION BOX
              ══════════════════════════════════════════════════════════════ */}
              <motion.div
                layout
                style={{
                  background: C.surf,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: isGraph ? "28px 24px" : "20px 16px",
                  minHeight: isGraph ? 480 : 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: isGraph ? "1 1 auto" : "0 0 auto",
                }}
                transition={{ duration: 0.2 }}
              >
                {renderVisualization(step, algo?.vizType, isGraph)}
              </motion.div>

              {/* Color legend — compact, only when steps exist */}
              {steps.length > 0 && !isGraph && (
                <div
                  className="flex flex-wrap gap-4"
                  style={{
                    padding: "10px 14px",
                    background: C.card,
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    fontSize: 10,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {[
                    { c: C.cyan, l: "Active" },
                    { c: C.yellow, l: "Comparing" },
                    { c: C.orange, l: "Swapping" },
                    { c: C.green, l: "Done" },
                    { c: C.red, l: "Mismatch" },
                    { c: C.purple, l: "Window" },
                  ].map(({ c, l }) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: c,
                        }}
                      />
                      <span style={{ color: C.muted }}>{l}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Variables panel */}
              {step?.variables && <VarsPanel vars={step.variables} />}

              {/* Playback controls */}
              <Controls
                steps={steps.length}
                idx={idx}
                setIdx={setIdx}
                playing={playing}
                setPlaying={setPlaying}
                speed={speed}
                setSpeed={setSpeed}
              />

              {/* Algorithm info card */}
              {algo && (
                <div
                  className="flex gap-5"
                  style={{
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 1.7,
                    minWidth: 0,
                  }}
                >
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        color: C.white,
                        fontWeight: 700,
                        fontSize: 14,
                        marginBottom: 4,
                        overflowWrap: "break-word" as const,
                      }}
                    >
                      {algo.name}
                    </div>
                    <div style={{ color: C.text, opacity: 0.85, overflowWrap: "break-word" as const }}>{algo.description}</div>
                  </div>
                  <div
                    className="flex-shrink-0 text-right"
                    style={{ fontFamily: "'Fira Code', monospace", fontSize: 11 }}
                  >
                    <div>
                      <span style={{ color: C.muted }}>Time </span>
                      <span style={{ color: algo.color, fontWeight: 600 }}>{algo.timeComplexity}</span>
                    </div>
                    <div>
                      <span style={{ color: C.muted }}>Space </span>
                      <span style={{ color: algo.color, fontWeight: 600 }}>{algo.spaceComplexity}</span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          background: `${algo.color}15`,
                          borderRadius: 4,
                          color: algo.color,
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        {algo.category}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Code Panel */}
            {showCode && algo && (
              <div
                className="flex-shrink-0 p-4 pl-0 flex flex-col"
                style={{ width: isGraph ? 280 : 300 }}
              >
                <CodePanel
                  pseudocode={algo.pseudocode}
                  activeLine={step?.codeLine ?? -1}
                  color={algo.color}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
