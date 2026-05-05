import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const arr = inputs.arr.split(",").map(Number).filter(n => !isNaN(n));
  if (!arr.length) return [];
  const a = [...arr], n = a.length, steps: AlgoStep[] = [];
  let swaps = 0, stepNum = 0;

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Start Bubble Sort on [${a.join(", ")}]`,
    why: "We need to sort this array by repeatedly comparing adjacent elements and swapping them if they're in the wrong order.",
    data: { arr: [...a] },
    highlights: { compare: [], sorted: [] },
    variables: { n, pass: 0, swaps: 0 },
    phase: "start",
  });

  for (let i = 0; i < n - 1; i++) {
    steps.push({
      step: stepNum++, codeLine: 1,
      description: `Begin Pass ${i + 1} — bubble the largest unsorted element to the right`,
      why: `After ${i} passes, the ${i} largest elements are already in place. We need to bubble the next largest to position ${n - 1 - i}.`,
      data: { arr: [...a] },
      highlights: { compare: [], sorted: Array.from({ length: i }, (_, k) => n - 1 - k) },
      variables: { pass: i + 1, j: 0, swaps },
      phase: "pass_start",
    });

    for (let j = 0; j < n - i - 1; j++) {
      const isSwap = a[j] > a[j + 1];
      steps.push({
        step: stepNum++, codeLine: 2,
        description: `Compare a[${j}]=${a[j]} vs a[${j + 1}]=${a[j + 1]} — ${isSwap ? "out of order!" : "already in order ✓"}`,
        why: isSwap
          ? `${a[j]} > ${a[j + 1]}, so they are in the wrong order. We must swap them to move the larger value rightward.`
          : `${a[j]} ≤ ${a[j + 1]}, so they are already in correct relative order. No swap needed.`,
        data: { arr: [...a] },
        highlights: { compare: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k) },
        variables: { pass: i + 1, j, comparing: `${a[j]} vs ${a[j + 1]}` },
        phase: isSwap ? "will_swap" : "compare",
      });

      if (isSwap) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        steps.push({
          step: stepNum++, codeLine: 3,
          description: `Swapped a[${j}]↔a[${j + 1}] → [${a.join(", ")}]`,
          why: `The swap moves ${a[j + 1]} (the larger value) one position to the right, closer to its final sorted position.`,
          data: { arr: [...a] },
          highlights: { compare: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k) },
          variables: { pass: i + 1, j, swaps },
          phase: "swapped",
        });
      }
    }

    steps.push({
      step: stepNum++, codeLine: 4,
      description: `Pass ${i + 1} complete — a[${n - 1 - i}]=${a[n - 1 - i]} is now in its final position`,
      why: `After each complete pass, the largest unsorted element "bubbles up" to the end. Element ${a[n - 1 - i]} is guaranteed to be in position ${n - 1 - i}.`,
      data: { arr: [...a] },
      highlights: { compare: [], sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k) },
      variables: { pass: i + 1, swaps },
      phase: "pass_done",
    });
  }

  steps.push({
    step: stepNum++, codeLine: 5,
    description: `✓ Sorted! [${a.join(", ")}] — total swaps: ${swaps}`,
    why: `All elements have been compared and swapped into their correct positions. The array is now fully sorted in ascending order.`,
    data: { arr: [...a] },
    highlights: { compare: [], sorted: Array.from({ length: n }, (_, k) => k) },
    variables: { result: `[${a.join(", ")}]`, totalSwaps: swaps },
    phase: "done",
  });

  return steps;
}

export const bubbleSort: AlgoConfig = {
  id: "bubbleSort",
  name: "Bubble Sort",
  category: "Sorting",
  description: "Repeatedly swap adjacent elements that are out of order until the array is sorted.",
  timeComplexity: "O(n²)",
  spaceComplexity: "O(1)",
  color: C.orange,
  vizType: "array",
  inputs: [
    { id: "arr", label: "Array", placeholder: "64,34,25,12,22", def: "64,34,25,12,22,11,90", isArray: true },
  ],
  pseudocode: [
    "function bubbleSort(arr):",
    "  for i = 0 to n-2:",
    "    for j = 0 to n-i-2:",
    "      if arr[j] > arr[j+1]:",
    "        swap(arr[j], arr[j+1])",
    "  return arr",
  ],
  run: generate,
};
