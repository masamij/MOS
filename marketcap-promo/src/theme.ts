export const JP = "'Noto Sans JP Variable', sans-serif";
export const LATIN = "'Inter Variable', 'Noto Sans JP Variable', sans-serif";

export const COLOR = {
  bg: "#000000",
  text: "#f5f5f7",
  sub: "#86868b",
  hairline: "rgba(245, 245, 247, 0.22)",
  // muted keynote-style accents, used only for the up / down arrows
  up: "#5fd08a",
  down: "#ff6b61",
};

// Apple-like ease-out: fast start, long gentle settle
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
