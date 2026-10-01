import { CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT } from "./theme";

type Props = {
  text: string;
  /** seconds (relative to the parent Sequence) when the first character starts */
  at: number;
  /** seconds between characters */
  stagger?: number;
  /** seconds each character takes to settle */
  duration?: number;
  style?: CSSProperties;
};

const ease = Easing.bezier(...EASE_OUT);

/** Reveals text one character at a time: fade, rise and de-blur. */
export const Reveal: React.FC<Props> = ({ text, at, stagger = 0.075, duration = 0.7, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <div style={{ whiteSpace: "pre", ...style }}>
      {Array.from(text).map((ch, i) => {
        const p = interpolate(t, [at + i * stagger, at + i * stagger + duration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 0.32}em)`,
              filter: `blur(${(1 - p) * 10}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
