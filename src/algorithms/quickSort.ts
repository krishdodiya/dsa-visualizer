import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const arr = inputs.arr.split(",").map(Number).filter(n => !isNaN(n));
  if (!arr.length) return [];
  const steps: AlgoStep[] = [];
  let stepNum = 0;
  const a = [...arr];

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Quick Sort on [${a.join(", ")}] — partition around a pivot`,
    why: "Quick Sort picks a pivot, partitions elements around it, then recursively sorts the partitions. Average case O(n log n).",
    data: { arr: [...a] },
    highlights: { pivot: -1, sorted: [] },
    variables: { n: a.length },
    phase: "start",
  });

  const sorted = new Set<number>();

  function quickSort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) sorted.add(lo);
      return;
    }

    const pivotVal = a[hi];
    steps.push({
      step: stepNum++, codeLine: 1,
      description: `Partition [${lo}..${hi}], pivot = a[${hi}] = ${pivotVal}`,
      why: `We choose the last element (${pivotVal}) as pivot. We'll rearrange so all elements < pivot are left, all ≥ pivot are right.`,
      data: { arr: [...a] },
      highlights: { pivot: hi, range: [lo, hi], sorted: [...sorted] },
      variables: { lo, hi, pivot: pivotVal },
      phase: "pivot",
    });

    let i = lo;
    for (let j = lo; j < hi; j++) {
      const cmp = a[j] < pivotVal;
      steps.push({
        step: stepNum++, codeLine: 3,
        description: `Compare a[${j}]=${a[j]} ${cmp ? "<" : "≥"} pivot(${pivotVal})${cmp ? " → swap to left partition" : " → stay in right"}`,
        why: cmp
          ? `${a[j]} is less than pivot ${pivotVal}, so it belongs in the left partition. Swap a[${j}] with a[${i}] to place it correctly.`
          : `${a[j]} is ≥ pivot ${pivotVal}, so it already belongs in the right partition. No swap needed.`,
        data: { arr: [...a] },
        highlights: { pivot: hi, compare: [j, i], range: [lo, hi], sorted: [...sorted] },
        variables: { j, i, "a[j]": a[j], pivot: pivotVal, action: cmp ? "swap" : "skip" },
        phase: cmp ? "will_swap" : "compare",
      });

      if (cmp) {
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({
          step: stepNum++, codeLine: 4,
          description: `Swapped a[${i}]↔a[${j}] → [${a.slice(lo, hi + 1).join(", ")}]`,
          why: `After swapping, elements at indices [${lo}..${i}] are all less than the pivot.`,
          data: { arr: [...a] },
          highlights: { pivot: hi, compare: [i, j], range: [lo, hi], sorted: [...sorted] },
          variables: { i: i + 1 },
          phase: "swapped",
        });
        i++;
      }
    }

    [a[i], a[hi]] = [a[hi], a[i]];
    sorted.add(i);

    steps.push({
      step: stepNum++, codeLine: 5,
      description: `Place pivot ${pivotVal} at index ${i} → [${a.slice(lo, hi + 1).join(", ")}]`,
      why: `The pivot ${pivotVal} is now at its final sorted position ${i}. Everything to its left is smaller, everything to its right is larger or equal.`,
      data: { arr: [...a] },
      highlights: { pivot: i, range: [lo, hi], sorted: [...sorted] },
      variables: { pivotFinalPos: i, left: `[${lo}..${i - 1}]`, right: `[${i + 1}..${hi}]` },
      phase: "partition_done",
    });

    quickSort(lo, i - 1);
    quickSort(i + 1, hi);
  }

  quickSort(0, a.length - 1);

  steps.push({
    step: stepNum++, codeLine: 6,
    description: `✓ Sorted! [${a.join(", ")}]`,
    why: "All partitions have been recursively sorted. The array is now in ascending order.",
    data: { arr: [...a] },
    highlights: { sorted: Array.from({ length: a.length }, (_, i) => i) },
    variables: { result: `[${a.join(", ")}]` },
    phase: "done",
  });
  return steps;
}

export const quickSort: AlgoConfig = {
  id: "quickSort",
  name: "Quick Sort",
  category: "Sorting",
  description: "Partition-based sort: pick a pivot, partition, recursively sort each side.",
  timeComplexity: "O(n log n)*",
  spaceComplexity: "O(log n)",
  color: C.pink,
  vizType: "array",
  inputs: [
    { id: "arr", label: "Array", placeholder: "10,80,30,90,40,50,70", def: "10,80,30,90,40,50,70", isArray: true },
  ],
  pseudocode: [
    "function quickSort(arr, lo, hi):",
    "  if lo ≥ hi: return",
    "  pivot = arr[hi]",
    "  i = lo",
    "  for j = lo to hi-1:",
    "    if arr[j] < pivot: swap(arr[i], arr[j]); i++",
    "  swap(arr[i], arr[hi])  // place pivot",
    "  quickSort(arr, lo, i-1)",
    "  quickSort(arr, i+1, hi)",
  ],
  run: generate,
};
