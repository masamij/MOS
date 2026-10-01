import { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_IN_OUT } from "./theme";

type Props = {
  /** scene length in seconds */
  length: number;
  /** fade-out length in seconds (0 = hold until cut) */
  exit?: number;
  style?: CSSProperties;
  children: ReactNode;
};

const ease = Easing.bezier(...EASE_IN_OUT);

/** Centered stage with a slow push-in and a soft blurred exit. */
export const Scene: React.FC<Props> = ({ length, exit = 0.42, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const push = interpolate(t, [0, length], [1, 1.035]);
  const out = exit > 0
    ? interpolate(t, [length - exit, length], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ease,
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        // keep content clear of TikTok's caption / action-bar UI
        paddingBottom: 260,
        opacity: 1 - out,
        filter: `blur(${out * 12}px)`,
        transform: `scale(${push}) translateY(${-out * 24}px)`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
