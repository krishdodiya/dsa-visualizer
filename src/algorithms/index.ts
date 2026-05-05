import { AlgoConfig } from "../types";
import { bubbleSort } from "./bubbleSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";
import { binarySearch } from "./binarySearch";
import { twoSum } from "./twoSum";
import { longestSubstring } from "./longestSubstring";
import { maxSumSubarray } from "./maxSumSubarray";
import { reverseLinkedList } from "./reverseLinkedList";
import { bfs, dfs } from "./bfsDfs";
import { dijkstra } from "./dijkstra";
import { validParentheses } from "./validParentheses";

export const ALGORITHMS: AlgoConfig[] = [
  bubbleSort,
  mergeSort,
  quickSort,
  binarySearch,
  twoSum,
  longestSubstring,
  maxSumSubarray,
  reverseLinkedList,
  bfs,
  dfs,
  dijkstra,
  validParentheses,
];

export const CATEGORIES = [...new Set(ALGORITHMS.map(a => a.category))];
