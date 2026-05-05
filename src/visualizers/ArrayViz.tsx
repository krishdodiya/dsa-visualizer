import { AlgoStep } from "../types";
import { C } from "../theme";
import { Cell } from "./Cell";

interface Props { step: AlgoStep }

export function ArrayViz({ step }: Props) {
  const { data, highlights, phase } = step;
  const arr: number[] = data.arr || [];
  const compare: number[] = highlights.compare || [];
  const sorted: number[] = highlights.sorted || [];
  const pivot: number = highlights.pivot ?? -1;
  const range: number[] = highlights.range || [];
  const merged: number[] = highlights.merged || [];
  const mergeRange: number[] = highlights.mergeRange || [];
  const active: number[] = highlights.active || [];

  // Window-type viz
  const wStart: number = data.wStart ?? -1;
  const wEnd: number = data.wEnd ?? -1;

  // Binary search
  const left: number = highlights.left ?? -1;
  const right: number = highlights.right ?? -1;
  const mid: number = highlights.mid ?? -1;
  const found: number = highlights.found ?? -1;

  const isBSearch = step.data.arr && (highlights.left !== undefined || highlights.right !== undefined);
  const isWindow = wStart >= 0 && wEnd >= 0;

  const cellStyle = (i: number) => {
    // Done state
    if (phase === "done" && (sorted.includes(i) || merged.includes(i))) {
      return { bg: C.greenBg, border: C.green, color: C.green, glow: true };
    }

    // Sorted elements
    if (sorted.includes(i)) return { bg: C.greenBg, border: C.green, color: C.green, glow: false };

    // Merged range
    if (merged.includes(i) && phase === "merge_done") return { bg: C.greenBg, border: C.green, color: C.green, glow: true };
    if (mergeRange.length && i >= mergeRange[0] && i <= mergeRange[1]) return { bg: C.purpleBg, border: C.purple, color: C.purple, glow: false };

    // Active (merge pick)
    if (active.includes(i) && phase === "merge_pick") return { bg: C.cyanBg, border: C.cyan, color: C.cyan, glow: true };

    // Binary search
    if (isBSearch) {
      if (found === i) return { bg: C.greenBg, border: C.green, color: C.green, glow: true };
      if (i === mid) return { bg: C.yellowBg, border: C.yellow, color: C.yellow, glow: true };
      if (i >= left && i <= right) return { bg: C.cyanBg, border: C.cyan + "60", color: C.text, glow: false };
      return { bg: C.card, border: C.dimText, color: C.muted, glow: false };
    }

    // Window
    if (isWindow) {
      if (phase === "done" && i >= wStart && i <= wEnd) return { bg: C.greenBg, border: C.green, color: C.green, glow: true };
      if (phase === "new_max" && i >= wStart && i <= wEnd) return { bg: C.orangeBg, border: C.orange, color: C.orange, glow: true };
      if (i >= wStart && i <= wEnd) return { bg: C.purpleBg, border: C.purple, color: C.purple, glow: false };
      return { bg: C.card, border: C.border, color: C.text, glow: false };
    }

    // Quick sort pivot
    if (i === pivot) return { bg: C.yellowBg, border: C.yellow, color: C.yellow, glow: true };

    // Partition range
    if (range.length === 2 && i >= range[0] && i <= range[1] && !compare.includes(i) && i !== pivot) {
      return { bg: C.cyanBg, border: C.cyan + "40", color: C.text, glow: false };
    }

    // Compare
    if (compare.includes(i)) {
      if (phase === "swapped") return { bg: C.orangeBg, border: C.orange, color: C.orange, glow: true };
      if (phase === "will_swap") return { bg: C.redBg, border: C.red, color: C.red, glow: true };
      return { bg: C.yellowBg, border: C.yellow, color: C.yellow, glow: false };
    }

    return { bg: C.card, border: C.border, color: C.text, glow: false };
  };

  const getLabel = (i: number) => {
    if (isBSearch) {
      const ls: string[] = [];
      if (i === left && left <= right) ls.push("L");
      if (i === right && left <= right) ls.push("R");
      if (i === mid && mid >= 0) ls.push("M");
      return ls.join("/") || undefined;
    }
    return undefined;
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center items-end py-2">
      {arr.map((v, i) => (
        <Cell key={`${i}-${v}`} val={v} idx={i} label={getLabel(i)} {...cellStyle(i)} />
      ))}
    </div>
  );
}
