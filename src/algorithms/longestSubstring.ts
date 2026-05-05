import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const s = inputs.str || "";
  if (!s) return [];
  const steps: AlgoStep[] = [];
  let left = 0, maxLen = 0, maxStart = 0, stepNum = 0;
  const cmap: Record<string, number> = {};

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Find longest substring without repeating characters in "${s}"`,
    why: "We use a sliding window with two pointers. Expand right to include new characters, shrink left when we find a duplicate.",
    data: { s, left: 0, right: -1, cmap: {}, maxLen: 0, maxStart: 0 },
    highlights: {},
    variables: { left: 0, right: -1, window: '""', maxLen: 0 },
    phase: "start",
  });

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];

    if (cmap[ch] !== undefined && cmap[ch] >= left) {
      const prev = left;
      left = cmap[ch] + 1;
      steps.push({
        step: stepNum++, codeLine: 3,
        description: `'${ch}' already in window at index ${cmap[ch]}! Shrink: left ${prev} → ${left}`,
        why: `Character '${ch}' is a duplicate within our current window. To maintain the "no repeating" invariant, we must move left past the previous occurrence of '${ch}' (index ${cmap[ch]}).`,
        data: { s, left, right, cmap: { ...cmap }, maxLen, maxStart },
        highlights: { duplicate: cmap[ch] },
        variables: { left, right, duplicate: `'${ch}'`, window: `"${s.slice(left, right + 1)}"` },
        phase: "shrink",
      });
    }

    cmap[ch] = right;
    const wlen = right - left + 1;
    const isNew = wlen > maxLen;
    if (isNew) { maxLen = wlen; maxStart = left; }

    steps.push({
      step: stepNum++, codeLine: isNew ? 5 : 4,
      description: `Expand: right=${right}, ch='${ch}', window="${s.slice(left, right + 1)}" (len=${wlen})${isNew ? ` — new max! ${maxLen}` : ""}`,
      why: isNew
        ? `Window "${s.slice(left, right + 1)}" has length ${wlen}, which is longer than our previous best of ${maxLen - (isNew ? wlen - maxLen : 0)}. Update max!`
        : `Window "${s.slice(left, right + 1)}" has length ${wlen}, which doesn't exceed our current max of ${maxLen}. Continue expanding.`,
      data: { s, left, right, cmap: { ...cmap }, maxLen, maxStart },
      highlights: {},
      variables: { left, right, window: `"${s.slice(left, right + 1)}"`, winLen: wlen, maxLen },
      phase: isNew ? "new_max" : "expand",
    });
  }

  steps.push({
    step: stepNum++, codeLine: 6,
    description: `✓ Longest substring: "${s.slice(maxStart, maxStart + maxLen)}" — length ${maxLen}`,
    why: `We've scanned the entire string. The longest window without repeating characters was "${s.slice(maxStart, maxStart + maxLen)}" starting at index ${maxStart}.`,
    data: { s, left: maxStart, right: maxStart + maxLen - 1, cmap, maxLen, maxStart },
    highlights: {},
    variables: { result: `"${s.slice(maxStart, maxStart + maxLen)}"`, length: maxLen },
    phase: "done",
  });
  return steps;
}

export const longestSubstring: AlgoConfig = {
  id: "longestSub",
  name: "Longest Substring",
  category: "Sliding Window",
  description: "Find the longest substring without repeating characters using a sliding window.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(k)",
  color: C.purple,
  vizType: "string",
  inputs: [
    { id: "str", label: "String", placeholder: "abcabcbb", def: "abcabcbb" },
  ],
  pseudocode: [
    "function lengthOfLongestSubstring(s):",
    "  left = 0, maxLen = 0, charMap = {}",
    "  for right = 0 to s.length-1:",
    "    if s[right] in charMap and charMap[s[right]] ≥ left:",
    "      left = charMap[s[right]] + 1",
    "    charMap[s[right]] = right",
    "    if right - left + 1 > maxLen: update maxLen",
    "  return maxLen",
  ],
  run: generate,
};
