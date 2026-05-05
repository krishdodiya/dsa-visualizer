import { AlgoStep, AlgoConfig } from "../types";
import { C } from "../theme";

function generate(inputs: Record<string, string>): AlgoStep[] {
  const s = inputs.str || "";
  if (!s) return [];
  const steps: AlgoStep[] = [];
  let stepNum = 0;
  const stack: string[] = [];
  const match: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const open = new Set(["(", "[", "{"]);

  steps.push({
    step: stepNum++, codeLine: 0,
    description: `Check if "${s}" has valid parentheses using a stack`,
    why: "We use a stack to track opening brackets. When we see a closing bracket, we check if it matches the most recent opening bracket (top of stack).",
    data: { s, stack: [] },
    highlights: { curIdx: -1 },
    variables: { input: `"${s}"`, stackSize: 0 },
    phase: "start",
  });

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (open.has(ch)) {
      stack.push(ch);
      steps.push({
        step: stepNum++, codeLine: 2,
        description: `'${ch}' is an opening bracket → push onto stack. Stack: [${stack.join(", ")}]`,
        why: `Opening brackets are always valid to add. We push '${ch}' so we can match it later when we encounter its corresponding closing bracket.`,
        data: { s, stack: [...stack] },
        highlights: { curIdx: i, action: "push" },
        variables: { i, char: ch, action: "push", stack: `[${stack.join(",")}]` },
        phase: "push",
      });
    } else if (ch in match) {
      if (stack.length === 0 || stack[stack.length - 1] !== match[ch]) {
        const top = stack.length > 0 ? stack[stack.length - 1] : "empty";
        steps.push({
          step: stepNum++, codeLine: 3,
          description: `✗ '${ch}' doesn't match top of stack (${top}). INVALID!`,
          why: stack.length === 0
            ? `We found closing bracket '${ch}' but the stack is empty — there's no opening bracket to match it.`
            : `The top of stack is '${stack[stack.length - 1]}', but '${ch}' needs '${match[ch]}'. They don't match — the brackets are improperly nested.`,
          data: { s, stack: [...stack] },
          highlights: { curIdx: i, action: "mismatch" },
          variables: { i, char: ch, expected: match[ch], top, result: "INVALID" },
          phase: "invalid",
        });
        return steps;
      }

      const popped = stack.pop()!;
      steps.push({
        step: stepNum++, codeLine: 4,
        description: `'${ch}' matches '${popped}' → pop! Stack: [${stack.join(", ") || "empty"}]`,
        why: `The closing bracket '${ch}' correctly matches the most recent opening bracket '${popped}'. They form a valid pair, so we remove '${popped}' from the stack.`,
        data: { s, stack: [...stack] },
        highlights: { curIdx: i, action: "pop", matched: popped },
        variables: { i, char: ch, matched: popped, stack: `[${stack.join(",") || ""}]` },
        phase: "pop",
      });
    }
  }

  const valid = stack.length === 0;
  steps.push({
    step: stepNum++, codeLine: 5,
    description: valid
      ? `✓ All brackets matched! Stack is empty → VALID`
      : `✗ Stack not empty: [${stack.join(", ")}] — unmatched opening brackets. INVALID!`,
    why: valid
      ? "Every opening bracket found its matching closing bracket. The string has perfectly balanced parentheses."
      : `There are ${stack.length} opening bracket(s) left unmatched: [${stack.join(", ")}]. Each needs a corresponding closing bracket.`,
    data: { s, stack: [...stack] },
    highlights: { curIdx: -1 },
    variables: { stackEmpty: valid ? "YES" : "NO", result: valid ? "VALID" : "INVALID" },
    phase: valid ? "done" : "invalid",
  });
  return steps;
}

export const validParentheses: AlgoConfig = {
  id: "validParens",
  name: "Valid Parentheses",
  category: "Stack",
  description: "Check if a string of brackets is properly nested using a stack.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  color: C.yellow,
  vizType: "stack",
  inputs: [
    { id: "str", label: "Brackets String", placeholder: "({[]})", def: "({[]})" },
  ],
  pseudocode: [
    "function isValid(s):",
    "  stack = []",
    "  for each char in s:",
    "    if char is opening: stack.push(char)",
    "    if char is closing:",
    "      if stack empty or top ≠ match: return false",
    "      stack.pop()",
    "  return stack.isEmpty()",
  ],
  run: generate,
};
