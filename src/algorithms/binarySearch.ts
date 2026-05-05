import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const arr = inputs.arr.split(",").map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
  const target = Number(inputs.target);
  if (!arr.length || isNaN(target)) return [];
  const steps: AlgoStep[] = [];
  let left = 0, right = arr.length - 1, stepNum = 0;

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Search for ${target} in sorted array [${arr.join(", ")}]`,
    why: "Binary search works on sorted arrays by repeatedly halving the search space. We start with the entire array.",
    data: { arr: [...arr] },
    highlights: { left, right, mid: -1 },
    variables: { left, right, target, mid: "—" },
    phase: "start",
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      step: stepNum++, codeLine: 2,
      description: `Calculate mid = ⌊(${left}+${right})/2⌋ = ${mid}, arr[${mid}] = ${arr[mid]}`,
      why: `We pick the middle index to split the remaining search space [${left}..${right}] in half. This guarantees O(log n) time.`,
      data: { arr: [...arr] },
      highlights: { left, right, mid },
      variables: { left, right, mid, "arr[mid]": arr[mid], target },
      phase: "check",
    });

    if (arr[mid] === target) {
      steps.push({
        step: stepNum++, codeLine: 3,
        description: `🎯 arr[${mid}]=${arr[mid]} equals target ${target}! Found at index ${mid}.`,
        why: `The middle element exactly matches our target. Search is complete — we found ${target} at index ${mid}.`,
        data: { arr: [...arr] },
        highlights: { left, right, mid, found: mid },
        variables: { result: mid, "arr[mid]": arr[mid] },
        phase: "found",
      });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({
        step: stepNum++, codeLine: 4,
        description: `arr[${mid}]=${arr[mid]} < ${target} → discard left half, set left = ${mid + 1}`,
        why: `Since the array is sorted and arr[${mid}]=${arr[mid]} < ${target}, ALL elements at indices ≤${mid} must also be < ${target}. We can safely discard the entire left half.`,
        data: { arr: [...arr] },
        highlights: { left, right, mid, direction: "right" },
        variables: { left, right, mid, newLeft: mid + 1 },
        phase: "go_right",
      });
      left = mid + 1;
    } else {
      steps.push({
        step: stepNum++, codeLine: 5,
        description: `arr[${mid}]=${arr[mid]} > ${target} → discard right half, set right = ${mid - 1}`,
        why: `Since the array is sorted and arr[${mid}]=${arr[mid]} > ${target}, ALL elements at indices ≥${mid} must also be > ${target}. We can safely discard the entire right half.`,
        data: { arr: [...arr] },
        highlights: { left, right, mid, direction: "left" },
        variables: { left, right, mid, newRight: mid - 1 },
        phase: "go_left",
      });
      right = mid - 1;
    }
  }

  steps.push({
    step: stepNum++, codeLine: 6,
    description: `✗ left(${left}) > right(${right}) — search space is empty. ${target} not found.`,
    why: `The search space has been fully exhausted (left > right). The target ${target} does not exist in this array.`,
    data: { arr: [...arr] },
    highlights: { left, right, mid: -1 },
    variables: { left, right, result: "not found" },
    phase: "not_found",
  });
  return steps;
}

export const binarySearch: AlgoConfig = {
  id: "binarySearch",
  name: "Binary Search",
  category: "Searching",
  description: "Efficiently find a target in a sorted array by halving the search space each step.",
  timeComplexity: "O(log n)",
  spaceComplexity: "O(1)",
  color: C.cyan,
  vizType: "bsearch",
  inputs: [
    { id: "arr", label: "Sorted Array", placeholder: "1,3,5,7,9,11", def: "1,3,5,7,9,11,13", isArray: true },
    { id: "target", label: "Target", placeholder: "7", def: "7" },
  ],
  pseudocode: [
    "function binarySearch(arr, target):",
    "  left = 0, right = n - 1",
    "  while left ≤ right:",
    "    mid = ⌊(left + right) / 2⌋",
    "    if arr[mid] == target: return mid",
    "    if arr[mid] < target: left = mid + 1",
    "    else: right = mid - 1",
    "  return -1  // not found",
  ],
  run: generate,
};
