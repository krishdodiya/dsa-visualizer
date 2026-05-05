import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

// Simple graph from adjacency list string: "0:1,2;1:0,3;2:0,4;3:1;4:2"
function parseGraph(s: string): Record<number, number[]> {
  const g: Record<number, number[]> = {};
  s.split(";").forEach(part => {
    const [node, nbrs] = part.split(":");
    const n = parseInt(node.trim());
    if (isNaN(n)) return;
    g[n] = (nbrs || "").split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  });
  return g;
}

function generateBFS(inputs: Record<string, string>): AlgoStep[] {
  const g = parseGraph(inputs.graph);
  const start = parseInt(inputs.start);
  const nodes = Object.keys(g).map(Number).sort((a, b) => a - b);
  if (!nodes.length || isNaN(start) || !(start in g)) return [];

  const steps: AlgoStep[] = [];
  let stepNum = 0;
  const visited = new Set<number>();
  const queue: number[] = [start];
  visited.add(start);
  const order: number[] = [];

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `BFS from node ${start}. Graph: ${nodes.map(n => `${n}→[${g[n].join(",")}]`).join(", ")}`,
    why: "BFS explores nodes level by level using a queue. It visits all neighbors of the current node before moving deeper.",
    data: { graph: g, nodes },
    highlights: { visited: [], queue: [start], current: -1 },
    variables: { start, queue: `[${start}]`, visited: "{}" },
    phase: "start",
  });

  while (queue.length > 0) {
    const curr = queue.shift()!;
    order.push(curr);

    steps.push({
      step: stepNum++, codeLine: 2,
      description: `Dequeue node ${curr}. Process it.`,
      why: `Node ${curr} is at the front of the queue, meaning it's the next closest unprocessed node from the start. We process it now.`,
      data: { graph: g, nodes },
      highlights: { visited: [...visited], queue: [...queue], current: curr },
      variables: { current: curr, queue: `[${queue.join(",")}]`, visitOrder: order.join("→") },
      phase: "visit",
    });

    const neighbors = g[curr] || [];
    for (const nbr of neighbors) {
      if (!visited.has(nbr)) {
        visited.add(nbr);
        queue.push(nbr);
        steps.push({
          step: stepNum++, codeLine: 4,
          description: `Neighbor ${nbr} not visited → enqueue. Queue: [${queue.join(", ")}]`,
          why: `Node ${nbr} is adjacent to ${curr} and hasn't been visited yet. Adding it to the queue ensures we'll visit it after processing all nodes at the current level.`,
          data: { graph: g, nodes },
          highlights: { visited: [...visited], queue: [...queue], current: curr, edge: [curr, nbr] },
          variables: { neighbor: nbr, queue: `[${queue.join(",")}]` },
          phase: "enqueue",
        });
      } else {
        steps.push({
          step: stepNum++, codeLine: 3,
          description: `Neighbor ${nbr} already visited → skip`,
          why: `Node ${nbr} was already visited/enqueued. Skipping prevents cycles and redundant work.`,
          data: { graph: g, nodes },
          highlights: { visited: [...visited], queue: [...queue], current: curr, edge: [curr, nbr] },
          variables: { neighbor: nbr, status: "already visited" },
          phase: "skip",
        });
      }
    }
  }

  steps.push({
    step: stepNum++, codeLine: 5,
    description: `✓ BFS complete! Visit order: ${order.join(" → ")}`,
    why: "The queue is empty, meaning all reachable nodes have been visited in breadth-first order.",
    data: { graph: g, nodes },
    highlights: { visited: [...visited], queue: [], current: -1 },
    variables: { order: order.join("→"), nodesVisited: order.length },
    phase: "done",
  });
  return steps;
}

function generateDFS(inputs: Record<string, string>): AlgoStep[] {
  const g = parseGraph(inputs.graph);
  const start = parseInt(inputs.start);
  const nodes = Object.keys(g).map(Number).sort((a, b) => a - b);
  if (!nodes.length || isNaN(start) || !(start in g)) return [];

  const steps: AlgoStep[] = [];
  let stepNum = 0;
  const visited = new Set<number>();
  const stack: number[] = [start];
  const order: number[] = [];

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `DFS from node ${start}. Graph: ${nodes.map(n => `${n}→[${g[n].join(",")}]`).join(", ")}`,
    why: "DFS explores as deep as possible before backtracking using a stack (or recursion). It's useful for path finding and cycle detection.",
    data: { graph: g, nodes },
    highlights: { visited: [], stack: [start], current: -1 },
    variables: { start, stack: `[${start}]`, visited: "{}" },
    phase: "start",
  });

  while (stack.length > 0) {
    const curr = stack.pop()!;
    if (visited.has(curr)) {
      steps.push({
        step: stepNum++, codeLine: 2,
        description: `Pop ${curr} — already visited, skip`,
        why: `Node ${curr} was already visited via another path. Skip to avoid processing it twice.`,
        data: { graph: g, nodes },
        highlights: { visited: [...visited], stack: [...stack], current: curr },
        variables: { popped: curr, status: "skip" },
        phase: "skip",
      });
      continue;
    }

    visited.add(curr);
    order.push(curr);

    steps.push({
      step: stepNum++, codeLine: 3,
      description: `Pop and visit node ${curr}`,
      why: `Node ${curr} is at the top of the stack, meaning we're exploring it next. DFS goes deep first.`,
      data: { graph: g, nodes },
      highlights: { visited: [...visited], stack: [...stack], current: curr },
      variables: { current: curr, stack: `[${stack.join(",")}]`, visitOrder: order.join("→") },
      phase: "visit",
    });

    const neighbors = (g[curr] || []).slice().reverse();
    for (const nbr of neighbors) {
      if (!visited.has(nbr)) {
        stack.push(nbr);
        steps.push({
          step: stepNum++, codeLine: 5,
          description: `Push unvisited neighbor ${nbr} onto stack`,
          why: `Node ${nbr} is adjacent to ${curr} and not yet visited. Pushing onto stack means we'll explore it (or its branch) before finishing ${curr}'s other neighbors.`,
          data: { graph: g, nodes },
          highlights: { visited: [...visited], stack: [...stack], current: curr, edge: [curr, nbr] },
          variables: { neighbor: nbr, stack: `[${stack.join(",")}]` },
          phase: "push",
        });
      }
    }
  }

  steps.push({
    step: stepNum++, codeLine: 6,
    description: `✓ DFS complete! Visit order: ${order.join(" → ")}`,
    why: "The stack is empty, meaning all reachable nodes have been visited in depth-first order.",
    data: { graph: g, nodes },
    highlights: { visited: [...visited], stack: [], current: -1 },
    variables: { order: order.join("→"), nodesVisited: order.length },
    phase: "done",
  });
  return steps;
}

export const bfs: AlgoConfig = {
  id: "bfs",
  name: "BFS (Breadth-First)",
  category: "Graphs",
  description: "Explore a graph level by level using a queue.",
  timeComplexity: "O(V+E)",
  spaceComplexity: "O(V)",
  color: C.cyan,
  vizType: "graph",
  inputs: [
    { id: "graph", label: "Adjacency List", placeholder: "0:1,2;1:0,3;2:0,3;3:1,2", def: "0:1,2;1:0,3,4;2:0,4;3:1,5;4:1,2,5;5:3,4", isArray: true },
    { id: "start", label: "Start Node", placeholder: "0", def: "0" },
  ],
  pseudocode: [
    "function BFS(graph, start):",
    "  queue = [start], visited = {start}",
    "  while queue not empty:",
    "    curr = queue.dequeue()",
    "    for neighbor in graph[curr]:",
    "      if neighbor not visited:",
    "        visited.add(neighbor)",
    "        queue.enqueue(neighbor)",
  ],
  run: generateBFS,
};

export const dfs: AlgoConfig = {
  id: "dfs",
  name: "DFS (Depth-First)",
  category: "Graphs",
  description: "Explore a graph by going as deep as possible before backtracking.",
  timeComplexity: "O(V+E)",
  spaceComplexity: "O(V)",
  color: C.orange,
  vizType: "graph",
  inputs: [
    { id: "graph", label: "Adjacency List", placeholder: "0:1,2;1:0,3;2:0,3;3:1,2", def: "0:1,2;1:0,3,4;2:0,4;3:1,5;4:1,2,5;5:3,4", isArray: true },
    { id: "start", label: "Start Node", placeholder: "0", def: "0" },
  ],
  pseudocode: [
    "function DFS(graph, start):",
    "  stack = [start], visited = {}",
    "  while stack not empty:",
    "    curr = stack.pop()",
    "    if curr in visited: continue",
    "    visited.add(curr)",
    "    for neighbor in graph[curr]:",
    "      if neighbor not visited:",
    "        stack.push(neighbor)",
  ],
  run: generateDFS,
};
