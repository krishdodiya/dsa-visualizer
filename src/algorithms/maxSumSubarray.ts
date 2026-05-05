import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const arr = inputs.arr.split(",").map(Number).filter(n => !isNaN(n));
  const k = parseInt(inputs.k);
  if (!arr.length || isNaN(k) || k <= 0 || k > arr.length) return [];
  const steps: AlgoStep[] = [];
  let stepNum = 0;
  let wsum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = wsum, maxStart = 0;

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Find maximum sum of a subarray of size ${k} in [${arr.join(", ")}]`,
    why: "We use a fixed-size sliding window of size k. Instead of recalculating the sum each time, we slide: add the new element, remove the old one.",
    data: { arr: [...arr], wStart: 0, wEnd: k - 1, wsum, maxSum, maxStart },
    highlights: {},
    variables: { k, windowSum: wsum, maxSum },
    phase: "start",
  });

  steps.push({
    step: stepNum++, codeLine: 1,
    description: `Initial window [0..${k - 1}] = [${arr.slice(0, k).join("+")}] = ${wsum}`,
    why: `We compute the sum of the first k=${k} elements as our starting window. This is our initial max sum.`,
    data: { arr: [...arr], wStart: 0, wEnd: k - 1, wsum, maxSum, maxStart },
    highlights: {},
    variables: { windowStart: 0, windowEnd: k - 1, windowSum: wsum, maxSum },
    phase: "init",
  });

  for (let i = k; i < arr.length; i++) {
    const oldSum = wsum;
    wsum += arr[i] - arr[i - k];
    const isNewMax = wsum > maxSum;

    steps.push({
      step: stepNum++, codeLine: 3,
      description: `Slide: remove arr[${i - k}]=${arr[i - k]}, add arr[${i}]=${arr[i]}. Sum: ${oldSum} - ${arr[i - k]} + ${arr[i]} = ${wsum}${isNewMax ? " — new max!" : ""}`,
      why: `Instead of recomputing the entire sum, we subtract the element leaving the window (arr[${i - k}]=${arr[i - k]}) and add the element entering (arr[${i}]=${arr[i]}). This keeps the operation O(1).`,
      data: { arr: [...arr], wStart: i - k + 1, wEnd: i, wsum, maxSum, maxStart },
      highlights: { removed: i - k, added: i },
      variables: { removed: arr[i - k], added: arr[i], windowSum: wsum, maxSum, isNewMax: isNewMax ? "YES" : "NO" },
      phase: "slide",
    });

    if (isNewMax) {
      maxSum = wsum;
      maxStart = i - k + 1;
      steps.push({
        step: stepNum++, codeLine: 4,
        description: `🌟 New max = ${maxSum} at window [${maxStart}..${i}] = [${arr.slice(maxStart, i + 1).join("+")}]`,
        why: `The current window sum ${wsum} exceeds our previous max. This subarray [${arr.slice(maxStart, i + 1).join(", ")}] is the best we've seen so far.`,
        data: { arr: [...arr], wStart: maxStart, wEnd: i, wsum, maxSum, maxStart },
        highlights: {},
        variables: { maxSum, maxWindow: `[${maxStart}..${i}]` },
        phase: "new_max",
      });
    }
  }

  steps.push({
    step: stepNum++, codeLine: 5,
    description: `✓ Max sum = ${maxSum} in window [${maxStart}..${maxStart + k - 1}] = [${arr.slice(maxStart, maxStart + k).join(", ")}]`,
    why: `We've slid the window across the entire array. The maximum sum subarray of size ${k} is [${arr.slice(maxStart, maxStart + k).join(", ")}] with sum ${maxSum}.`,
    data: { arr: [...arr], wStart: maxStart, wEnd: maxStart + k - 1, wsum: maxSum, maxSum, maxStart },
    highlights: {},
    variables: { maxSum, window: `[${arr.slice(maxStart, maxStart + k).join(", ")}]` },
    phase: "done",
  });
  return steps;
}

export const maxSumSubarray: AlgoConfig = {
  id: "maxSumSub",
  name: "Max Sum Subarray",
  category: "Sliding Window",
  description: "Find the maximum sum of a contiguous subarray of fixed size k.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  color: C.green,
  vizType: "window",
  inputs: [
    { id: "arr", label: "Array", placeholder: "2,1,5,1,3,2", def: "2,1,5,1,3,2", isArray: true },
    { id: "k", label: "Window k", placeholder: "3", def: "3" },
  ],
  pseudocode: [
    "function maxSumSubarray(arr, k):",
    "  windowSum = sum(arr[0..k-1])",
    "  maxSum = windowSum",
    "  for i = k to n-1:",
    "    windowSum += arr[i] - arr[i-k]",
    "    maxSum = max(maxSum, windowSum)",
    "  return maxSum",
  ],
  run: generate,
};
