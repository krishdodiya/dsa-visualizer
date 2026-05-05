import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const arr = inputs.arr.split(",").map(Number).filter(n => !isNaN(n));
  if (!arr.length) return [];
  const steps: AlgoStep[] = [];
  let stepNum = 0;

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Reverse linked list: ${arr.join(" → ")} → null`,
    why: "We use three pointers (prev, curr, next) to reverse each link in-place. At each step, we redirect curr.next to point to prev instead of the original next node.",
    data: { nodes: [...arr], reversed: [] as number[] },
    highlights: { prev: -1, curr: 0, next: arr.length > 1 ? 1 : -1 },
    variables: { prev: "null", curr: arr[0], next: arr.length > 1 ? arr[1] : "null" },
    phase: "start",
  });

  let prev = -1, curr = 0;
  const reversed: number[] = [];

  while (curr < arr.length) {
    const next = curr + 1 < arr.length ? curr + 1 : -1;

    steps.push({
      step: stepNum++, codeLine: 2,
      description: `Save next = ${next === -1 ? "null" : arr[next]}. Reverse: curr(${arr[curr]}).next → prev(${prev === -1 ? "null" : arr[prev]})`,
      why: `We first save the next pointer so we don't lose the rest of the list. Then we reverse curr's link to point backwards to prev. This is the core reversal operation.`,
      data: { nodes: [...arr], reversed: [...reversed] },
      highlights: { prev, curr, next },
      variables: { prev: prev === -1 ? "null" : arr[prev], curr: arr[curr], next: next === -1 ? "null" : arr[next] },
      phase: "reverse",
    });

    reversed.push(curr);
    steps.push({
      step: stepNum++, codeLine: 3,
      description: `Advance: prev = ${arr[curr]}, curr = ${next === -1 ? "null" : arr[next]}`,
      why: `After reversing the link, we move both pointers forward: prev becomes the current node, and curr becomes the saved next node.`,
      data: { nodes: [...arr], reversed: [...reversed] },
      highlights: { prev: curr, curr: next === -1 ? arr.length : next, next: next !== -1 && next + 1 < arr.length ? next + 1 : -1 },
      variables: { prev: arr[curr], curr: next === -1 ? "null" : arr[next] },
      phase: "advance",
    });

    prev = curr;
    curr = next === -1 ? arr.length : next;
  }

  steps.push({
    step: stepNum++, codeLine: 4,
    description: `✓ Reversed! ${[...arr].reverse().join(" → ")} → null`,
    why: "curr is now null (past the end). prev points to the new head. Every link has been reversed — the list now runs in the opposite direction.",
    data: { nodes: [...arr].reverse(), reversed: Array.from({ length: arr.length }, (_, i) => i) },
    highlights: { prev: arr.length - 1, curr: -1, next: -1 },
    variables: { result: [...arr].reverse().join(" → ") + " → null" },
    phase: "done",
  });
  return steps;
}

export const reverseLinkedList: AlgoConfig = {
  id: "reverseLL",
  name: "Reverse Linked List",
  category: "Linked List",
  description: "Reverse a singly linked list in-place using three pointers.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  color: C.red,
  vizType: "linkedlist",
  inputs: [
    { id: "arr", label: "Nodes", placeholder: "1,2,3,4,5", def: "1,2,3,4,5", isArray: true },
  ],
  pseudocode: [
    "function reverseList(head):",
    "  prev = null, curr = head",
    "  while curr ≠ null:",
    "    next = curr.next",
    "    curr.next = prev",
    "    prev = curr, curr = next",
    "  return prev  // new head",
  ],
  run: generate,
};
