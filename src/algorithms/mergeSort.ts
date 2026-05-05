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
    description: `Merge Sort on [${a.join(", ")}] — divide and conquer`,
    why: "Merge Sort recursively splits the array into halves, sorts each half, then merges them. This guarantees O(n log n) time.",
    data: { arr: [...a], ranges: [], merging: [] },
    highlights: { active: [], merged: [] },
    variables: { n: a.length },
    phase: "start",
  });

  function mergeSort(lo: number, hi: number, depth: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);

    steps.push({
      step: stepNum++, codeLine: 1,
      description: `${"  ".repeat(depth)}Split [${lo}..${hi}] → [${lo}..${mid}] and [${mid + 1}..${hi}]`,
      why: `We divide the subarray [${a.slice(lo, hi + 1).join(", ")}] at mid=${mid}. Each half will be sorted independently before merging.`,
      data: { arr: [...a], splitAt: mid, lo, hi },
      highlights: { active: [lo, hi], split: mid },
      variables: { lo, hi, mid, depth, left: `[${lo}..${mid}]`, right: `[${mid + 1}..${hi}]` },
      phase: "split",
    });

    mergeSort(lo, mid, depth + 1);
    mergeSort(mid + 1, hi, depth + 1);

    // Merge
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;

    steps.push({
      step: stepNum++, codeLine: 3,
      description: `${"  ".repeat(depth)}Merge [${left.join(", ")}] and [${right.join(", ")}]`,
      why: `Both halves are now sorted. We merge them by comparing elements from each half and placing the smaller one first.`,
      data: { arr: [...a], lo, hi, mid, leftArr: [...left], rightArr: [...right] },
      highlights: { mergeRange: [lo, hi] },
      variables: { left: `[${left.join(",")}]`, right: `[${right.join(",")}]` },
      phase: "merge_start",
    });

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        a[k] = left[i];
        steps.push({
          step: stepNum++, codeLine: 4,
          description: `${"  ".repeat(depth)}Pick ${left[i]} from left (${left[i]} ≤ ${right[j]}) → pos ${k}`,
          why: `${left[i]} from the left half is ≤ ${right[j]} from the right half, so it comes first in the merged result.`,
          data: { arr: [...a], lo, hi },
          highlights: { active: [k], mergeRange: [lo, hi] },
          variables: { picked: left[i], from: "left", pos: k },
          phase: "merge_pick",
        });
        i++;
      } else {
        a[k] = right[j];
        steps.push({
          step: stepNum++, codeLine: 4,
          description: `${"  ".repeat(depth)}Pick ${right[j]} from right (${right[j]} < ${left[i]}) → pos ${k}`,
          why: `${right[j]} from the right half is < ${left[i]} from the left half, so it comes first in the merged result.`,
          data: { arr: [...a], lo, hi },
          highlights: { active: [k], mergeRange: [lo, hi] },
          variables: { picked: right[j], from: "right", pos: k },
          phase: "merge_pick",
        });
        j++;
      }
      k++;
    }

    while (i < left.length) { a[k] = left[i]; i++; k++; }
    while (j < right.length) { a[k] = right[j]; j++; k++; }

    steps.push({
      step: stepNum++, codeLine: 5,
      description: `${"  ".repeat(depth)}Merged [${lo}..${hi}] → [${a.slice(lo, hi + 1).join(", ")}]`,
      why: `Both halves have been fully merged into sorted order. The subarray at positions [${lo}..${hi}] is now sorted.`,
      data: { arr: [...a], lo, hi },
      highlights: { mergeRange: [lo, hi], merged: Array.from({ length: hi - lo + 1 }, (_, idx) => lo + idx) },
      variables: { merged: `[${a.slice(lo, hi + 1).join(", ")}]` },
      phase: "merge_done",
    });
  }

  mergeSort(0, a.length - 1, 0);

  steps.push({
    step: stepNum++, codeLine: 6,
    description: `✓ Sorted! [${a.join(", ")}]`,
    why: "All recursive merges are complete. The entire array is now sorted in ascending order.",
    data: { arr: [...a] },
    highlights: { merged: Array.from({ length: a.length }, (_, i) => i) },
    variables: { result: `[${a.join(", ")}]` },
    phase: "done",
  });
  return steps;
}

export const mergeSort: AlgoConfig = {
  id: "mergeSort",
  name: "Merge Sort",
  category: "Sorting",
  description: "Divide-and-conquer sort: split, sort halves, then merge them back together.",
  timeComplexity: "O(n log n)",
  spaceComplexity: "O(n)",
  color: C.cyan,
  vizType: "array",
  inputs: [
    { id: "arr", label: "Array", placeholder: "38,27,43,3,9,82,10", def: "38,27,43,3,9,82,10", isArray: true },
  ],
  pseudocode: [
    "function mergeSort(arr, lo, hi):",
    "  if lo ≥ hi: return",
    "  mid = (lo + hi) / 2",
    "  mergeSort(arr, lo, mid)",
    "  mergeSort(arr, mid+1, hi)",
    "  merge(arr, lo, mid, hi)",
    "  // merge compares & combines",
    "  return arr",
  ],
  run: generate,
};
