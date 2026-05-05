import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const arr = inputs.arr.split(",").map(Number).filter(n => !isNaN(n));
  const target = Number(inputs.target);
  if (!arr.length || isNaN(target)) return [];
  const steps: AlgoStep[] = [];
  const map: Record<number, number> = {};
  let stepNum = 0;

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Find two indices in [${arr.join(", ")}] whose values sum to ${target}.`,
    why: "We use a hashmap approach for O(n) time. For each element, we check if its complement (target - value) was already seen.",
    data: { arr: [...arr], map: {} },
    highlights: { curIdx: -1, found: [] },
    variables: { target, mapSize: 0 },
    phase: "start",
  });

  for (let i = 0; i < arr.length; i++) {
    const comp = target - arr[i];

    steps.push({
      step: stepNum++, codeLine: 2,
      description: `i=${i}: value=${arr[i]}, complement = ${target} - ${arr[i]} = ${comp}. Is ${comp} in map? ${map[comp] !== undefined ? "YES ✓" : "NO ✗"}`,
      why: `For arr[${i}]=${arr[i]} to be part of a pair summing to ${target}, we need another element equal to ${comp}. We check the hashmap in O(1) time.`,
      data: { arr: [...arr], map: { ...map }, complement: comp },
      highlights: { curIdx: i, found: [] },
      variables: { i, value: arr[i], complement: comp, inMap: map[comp] !== undefined ? "YES" : "NO" },
      phase: "check",
    });

    if (map[comp] !== undefined) {
      steps.push({
        step: stepNum++, codeLine: 3,
        description: `🎯 Found! map[${comp}]=${map[comp]}. Answer: [${map[comp]}, ${i}] → ${arr[map[comp]]} + ${arr[i]} = ${target}`,
        why: `The complement ${comp} was stored at index ${map[comp]}. So arr[${map[comp]}]=${arr[map[comp]]} + arr[${i}]=${arr[i]} = ${target}. Problem solved!`,
        data: { arr: [...arr], map: { ...map } },
        highlights: { curIdx: i, found: [map[comp], i] },
        variables: { result: `[${map[comp]}, ${i}]`, sum: `${arr[map[comp]]}+${arr[i]}=${target}` },
        phase: "found",
      });
      return steps;
    }

    map[arr[i]] = i;
    steps.push({
      step: stepNum++, codeLine: 4,
      description: `Complement not found. Store {${arr[i]} → ${i}} in map for future lookups.`,
      why: `We haven't found a pair yet, so we record arr[${i}]=${arr[i]} and its index. A future element might need ${arr[i]} as its complement.`,
      data: { arr: [...arr], map: { ...map } },
      highlights: { curIdx: i, found: [] },
      variables: { added: `{${arr[i]}:${i}}`, mapSize: Object.keys(map).length },
      phase: "add",
    });
  }

  steps.push({
    step: stepNum++, codeLine: 5,
    description: `✗ No pair found that sums to ${target}`,
    why: "We've checked every element and none of their complements were found in the map. No valid pair exists.",
    data: { arr: [...arr], map: { ...map } },
    highlights: { curIdx: -1, found: [] },
    variables: { result: "not found" },
    phase: "not_found",
  });
  return steps;
}

export const twoSum: AlgoConfig = {
  id: "twoSum",
  name: "Two Sum",
  category: "Arrays & Hashing",
  description: "Find two numbers that add up to a target using a hashmap for O(n) lookup.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  color: C.yellow,
  vizType: "twosum",
  inputs: [
    { id: "arr", label: "Array", placeholder: "2,7,11,15", def: "2,7,11,15", isArray: true },
    { id: "target", label: "Target Sum", placeholder: "9", def: "9" },
  ],
  pseudocode: [
    "function twoSum(arr, target):",
    "  map = {}",
    "  for i = 0 to n-1:",
    "    complement = target - arr[i]",
    "    if complement in map: return [map[complement], i]",
    "    map[arr[i]] = i",
    "  return null",
  ],
  run: generate,
};
