// ═══════════════════════════════════════════════════════════
//  THEME — central color & design tokens
// ═══════════════════════════════════════════════════════════

export const C = {
  bg: "#060e1d",
  surf: "#0c1a2e",
  card: "#112236",
  border: "#1b3050",
  text: "#a8c4e0",
  muted: "#3d6080",
  dimText: "#2a4a66",
  white: "#e8f0f8",

  cyan: "#2fb8e8",
  cyanBg: "rgba(47,184,232,0.11)",
  yellow: "#f0b429",
  yellowBg: "rgba(240,180,41,0.11)",
  green: "#30c97a",
  greenBg: "rgba(48,201,122,0.11)",
  orange: "#ef7a2a",
  orangeBg: "rgba(239,122,42,0.11)",
  red: "#e85555",
  redBg: "rgba(232,85,85,0.11)",
  purple: "#9270e8",
  purpleBg: "rgba(146,112,232,0.11)",
  pink: "#e870b8",
  pinkBg: "rgba(232,112,184,0.11)",
};

export type ColorKey = keyof typeof C;
