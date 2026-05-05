import { motion } from "framer-motion";
import { AlgoStep } from "../types";
import { C } from "../theme";
import { useMemo } from "react";

interface Props {
  step: AlgoStep;
  expanded?: boolean;
}

function layoutNodes(nodes: number[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(cx, cy) - 50;
  const positions: Record<number, { x: number; y: number }> = {};
  const count = nodes.length;
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    positions[n] = {
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
    };
  });
  return positions;
}

export function GraphViz({ step, expanded = false }: Props) {
  const { data, highlights, phase } = step;
  const graph: Record<number, (number | [number, number])[]> = data.graph || {};
  const dist: Record<number, number> = data.dist || {};
  const nodes: number[] = data.nodes || [];
  const visited: number[] = highlights.visited || [];
  const current: number = highlights.current ?? -1;
  const edge: number[] | undefined = highlights.edge;
  const queue: number[] | undefined = highlights.queue;
  const stack: number[] | undefined = highlights.stack;
  const hasDist = Object.keys(dist).length > 0;

  // Larger dimensions for expanded view
  const W = expanded ? 580 : 440;
  const H = expanded ? 400 : 300;
  const nodeRadius = expanded ? 24 : 20;
  const fontSize = expanded ? 14 : 13;

  const nodeKey = nodes.join(",");
  const pos = useMemo(() => layoutNodes(nodes, W, H), [nodeKey, W, H]);

  // Build edges for rendering
  const edges: { from: number; to: number; weight?: number }[] = [];
  const edgeSet = new Set<string>();
  for (const n of nodes) {
    const nbrs = graph[n] || [];
    for (const nbr of nbrs) {
      const to = Array.isArray(nbr) ? nbr[0] : (nbr as number);
      const w = Array.isArray(nbr) ? nbr[1] : undefined;
      const key = `${Math.min(n, to)}-${Math.max(n, to)}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ from: n, to, weight: w });
      }
    }
  }

  const isEdgeActive = (from: number, to: number) => {
    if (!edge) return false;
    return (edge[0] === from && edge[1] === to) || (edge[0] === to && edge[1] === from);
  };

  const nodeColor = (n: number) => {
    if (phase === "done") return { fill: C.green, stroke: C.green, textFill: "#fff", glow: true };
    if (n === current) return { fill: C.cyan, stroke: C.cyan, textFill: "#fff", glow: true };
    if (visited.includes(n)) return { fill: C.greenBg, stroke: C.green, textFill: C.green, glow: false };
    if ((queue && queue.includes(n)) || (stack && stack.includes(n))) {
      return { fill: C.yellowBg, stroke: C.yellow, textFill: C.yellow, glow: false };
    }
    return { fill: C.card, stroke: C.border, textFill: C.text, glow: false };
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ maxWidth: "100%", display: "block" }}
      >
        {/* Edges */}
        {edges.map(({ from, to, weight }, i) => {
          const p1 = pos[from];
          const p2 = pos[to];
          if (!p1 || !p2) return null;
          const active = isEdgeActive(from, to);
          const relaxed = active && highlights.relaxed;
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          return (
            <g key={`e-${i}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={relaxed ? C.green : active ? C.cyan : C.border}
                strokeWidth={active ? 3 : 2}
                opacity={active ? 1 : 0.5}
                style={{ transition: "all 0.2s ease" }}
              />
              {weight !== undefined && (
                <g>
                  <rect
                    x={mx - 12}
                    y={my - 10}
                    width={24}
                    height={16}
                    rx={4}
                    fill={C.bg}
                    stroke={active ? C.yellow : C.border}
                    strokeWidth={1}
                  />
                  <text
                    x={mx}
                    y={my + 2}
                    fill={active ? C.yellow : C.muted}
                    fontSize={11}
                    fontFamily="'Fira Code', monospace"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight={600}
                  >
                    {weight}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const p = pos[n];
          if (!p) return null;
          const nc = nodeColor(n);
          return (
            <g key={`n-${n}`}>
              {nc.glow && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={nodeRadius + 6}
                  fill="none"
                  stroke={nc.stroke}
                  strokeWidth={2}
                  opacity={0.25}
                />
              )}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={nodeRadius}
                fill={nc.fill}
                stroke={nc.stroke}
                strokeWidth={2.5}
                initial={false}
                animate={{ r: nodeRadius }}
                style={{ transition: "fill 0.2s, stroke 0.2s" }}
              />
              <text
                x={p.x}
                y={p.y + 1}
                fill={nc.textFill}
                fontSize={fontSize}
                fontWeight={700}
                fontFamily="'Fira Code', monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {n}
              </text>
              {hasDist && dist[n] !== undefined && (
                <text
                  x={p.x}
                  y={p.y + nodeRadius + 16}
                  fill={C.yellow}
                  fontSize={10}
                  fontFamily="'Fira Code', monospace"
                  textAnchor="middle"
                  fontWeight={600}
                >
                  d={dist[n] === Infinity ? "∞" : dist[n]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Queue / Stack display */}
      {(queue || stack) && (
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 12,
            padding: "8px 14px",
            background: C.card,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            display: "flex",
            flexWrap: "wrap" as const,
            alignItems: "center",
            gap: "6px 12px",
            maxWidth: "100%",
            minWidth: 0,
          }}
        >
          <span style={{ color: C.muted, fontWeight: 600 }}>{queue ? "Queue:" : "Stack:"}</span>
          <div className="flex gap-1.5">
            {(queue || stack || []).map((n, i) => (
              <motion.span
                key={`${n}-${i}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: C.yellowBg,
                  border: `1px solid ${C.yellow}50`,
                  color: C.yellow,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {n}
              </motion.span>
            ))}
            {(queue || stack || []).length === 0 && (
              <span style={{ color: C.dimText, fontStyle: "italic" }}>empty</span>
            )}
          </div>
        </div>
      )}

      {/* Color legend */}
      <div
        className="flex flex-wrap gap-5 justify-center"
        style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
      >
        {[
          { c: C.cyan, l: "Current" },
          { c: C.green, l: "Visited" },
          { c: C.yellow, l: queue ? "In Queue" : "In Stack" },
          { c: C.border, l: "Unvisited" },
        ].map(({ c, l }) => (
          <div key={l} className="flex items-center gap-2">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: c === C.border ? C.card : `${c}30`,
                border: `2px solid ${c}`,
              }}
            />
            <span style={{ color: C.muted }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
