import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

// Format: "0:1=4,2=1;1:3=1;2:1=2,3=5;3:"
function parseWeighted(s: string): Record<number, [number, number][]> {
  const g: Record<number, [number, number][]> = {};
  s.split(";").forEach(part => {
    const [node, edges] = part.split(":");
    const n = parseInt(node.trim());
    if (isNaN(n)) return;
    g[n] = [];
    if (!edges || !edges.trim()) return;
    edges.split(",").forEach(e => {
      const [to, w] = e.split("=");
      const t = parseInt(to.trim()), wt = parseInt(w.trim());
      if (!isNaN(t) && !isNaN(wt)) g[n].push([t, wt]);
    });
  });
  return g;
}

function generate(inputs: Record<string, string>): AlgoStep[] {
  const g = parseWeighted(inputs.graph);
  const src = parseInt(inputs.start);
  const nodes = Object.keys(g).map(Number).sort((a, b) => a - b);
  if (!nodes.length || isNaN(src) || !(src in g)) return [];

  const steps: AlgoStep[] = [];
  let stepNum = 0;

  const dist: Record<number, number> = {};
  const prev: Record<number, number | null> = {};
  const visited = new Set<number>();
  const INF = Infinity;

  nodes.forEach(n => { dist[n] = INF; prev[n] = null; });
  dist[src] = 0;

  const fmtDist = () => nodes.map(n => `${n}:${dist[n] === INF ? "∞" : dist[n]}`).join(", ");

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Dijkstra from node ${src}. Initialize all distances to ∞, source to 0.`,
    why: "Dijkstra's algorithm finds the shortest path from a source to all other nodes. We start by assuming all nodes are infinitely far away, except the source itself.",
    data: { graph: g, nodes, dist: { ...dist } },
    highlights: { visited: [], current: -1 },
    variables: { source: src, distances: fmtDist() },
    phase: "start",
  });

  for (let iter = 0; iter < nodes.length; iter++) {
    // Find unvisited node with min distance
    let u = -1, minD = INF;
    for (const n of nodes) {
      if (!visited.has(n) && dist[n] < minD) { minD = dist[n]; u = n; }
    }
    if (u === -1) break;

    visited.add(u);
    steps.push({
      step: stepNum++, codeLine: 2,
      description: `Select unvisited node with min distance: node ${u} (dist=${dist[u]})`,
      why: `Among all unvisited nodes, node ${u} has the smallest tentative distance (${dist[u]}). By the greedy property of Dijkstra's, this distance is now finalized.`,
      data: { graph: g, nodes, dist: { ...dist } },
      highlights: { visited: [...visited], current: u },
      variables: { current: u, dist: dist[u], distances: fmtDist() },
      phase: "select",
    });

    for (const [v, w] of g[u]) {
      if (visited.has(v)) continue;
      const newDist = dist[u] + w;
      const better = newDist < dist[v];

      steps.push({
        step: stepNum++, codeLine: 4,
        description: `Edge ${u}→${v} (weight ${w}): dist[${u}]+${w} = ${newDist} ${better ? `< ${dist[v] === INF ? "∞" : dist[v]} → update!` : `≥ ${dist[v]} → no update`}`,
        why: better
          ? `Going through node ${u} to reach ${v} costs ${newDist}, which is cheaper than the current best (${dist[v] === INF ? "∞" : dist[v]}). Update the shortest distance.`
          : `Going through node ${u} to reach ${v} costs ${newDist}, which is NOT cheaper than the current best (${dist[v]}). Keep the existing distance.`,
        data: { graph: g, nodes, dist: { ...dist } },
        highlights: { visited: [...visited], current: u, edge: [u, v], relaxed: better },
        variables: { from: u, to: v, weight: w, newDist, oldDist: dist[v] === INF ? "∞" : dist[v], updated: better ? "YES" : "NO" },
        phase: better ? "relax" : "check",
      });

      if (better) {
        dist[v] = newDist;
        prev[v] = u;
      }
    }
  }

  steps.push({
    step: stepNum++, codeLine: 5,
    description: `✓ Dijkstra complete! Shortest distances: ${fmtDist()}`,
    why: "All reachable nodes have been visited and their shortest distances finalized. The algorithm guarantees optimal paths.",
    data: { graph: g, nodes, dist: { ...dist } },
    highlights: { visited: [...visited], current: -1 },
    variables: { distances: fmtDist() },
    phase: "done",
  });
  return steps;
}

export const dijkstra: AlgoConfig = {
  id: "dijkstra",
  name: "Dijkstra's Algorithm",
  category: "Graphs",
  description: "Find shortest paths from a source node to all other nodes in a weighted graph.",
  timeComplexity: "O(V²)",
  spaceComplexity: "O(V)",
  color: C.green,
  vizType: "graph",
  inputs: [
    { id: "graph", label: "Weighted Graph (node:to=wt,...)", placeholder: "0:1=4,2=1;1:3=1;2:1=2,3=5;3:", def: "0:1=4,2=1;1:3=1;2:1=2,3=5;3:", isArray: true },
    { id: "start", label: "Source", placeholder: "0", def: "0" },
  ],
  pseudocode: [
    "function dijkstra(graph, source):",
    "  dist[v] = ∞ for all v; dist[source] = 0",
    "  while unvisited nodes remain:",
    "    u = unvisited node with min dist",
    "    mark u as visited",
    "    for each neighbor v of u:",
    "      if dist[u] + weight(u,v) < dist[v]:",
    "        dist[v] = dist[u] + weight(u,v)",
  ],
  run: generate,
};
