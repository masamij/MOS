import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ALL_TEXT, COPY, MILESTONES } from "./content";
import { Reveal } from "./Reveal";
import { Scene } from "./Scene";
import { COLOR, EASE_IN_OUT, EASE_OUT, JP, LATIN } from "./theme";
import { DURATION_IN_FRAMES, sec } from "./timing";

const useFonts = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    const loads = [200, 300, 400, 500].flatMap((w) => [
      document.fonts.load(`${w} 100px 'Noto Sans JP Variable'`, ALL_TEXT),
      document.fonts.load(`${w} 100px 'Inter Variable'`, ALL_TEXT),
    ]);
    Promise.all(loads)
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);
};

/* ---------- Scene 1: title ---------- */
const Title: React.FC<{ length: number }> = ({ length }) => (
  <Scene length={length}>
    <Reveal
      text={COPY.title}
      at={0.5}
      stagger={0.13}
      duration={0.9}
      style={{ fontFamily: JP, fontWeight: 200, fontSize: 156, letterSpacing: "0.06em", color: COLOR.text }}
    />
    <Reveal
      text={COPY.titleSub}
      at={1.9}
      stagger={0.06}
      style={{ fontFamily: JP, fontWeight: 300, fontSize: 46, letterSpacing: "0.08em", color: COLOR.sub, marginTop: 56 }}
    />
  </Scene>
);

/* ---------- Scene 2: formula ---------- */
const Hairline: React.FC<{ at: number; width: number; style?: React.CSSProperties }> = ({ at, width, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame / fps, [at, at + 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });
  return <div style={{ width: width * p, height: 2, background: COLOR.hairline, ...style }} />;
};

const Formula: React.FC<{ length: number }> = ({ length }) => {
  const big = { fontFamily: JP, fontWeight: 200, fontSize: 108, letterSpacing: "0.06em", color: COLOR.text };
  return (
    <Scene length={length}>
      <Reveal text={COPY.price} at={0.35} stagger={0.1} style={big} />
      <Reveal
        text={COPY.times}
        at={1.0}
        style={{ fontFamily: LATIN, fontWeight: 200, fontSize: 76, color: COLOR.sub, margin: "28px 0" }}
      />
      <Reveal text={COPY.shares} at={1.35} stagger={0.08} style={big} />
      <Hairline at={2.75} width={600} style={{ margin: "64px 0" }} />
      <Reveal text={COPY.result} at={3.2} stagger={0.12} duration={0.9} style={{ ...big, fontWeight: 400 }} />
    </Scene>
  );
};

/* ---------- Scene 3: milestones ---------- */
const STEP = 2.4; // seconds per milestone

const Milestone: React.FC<{ m: (typeof MILESTONES)[number]; last: boolean }> = ({ m, last }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const out = last
    ? 0
    : interpolate(t, [STEP - 0.45, STEP], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...EASE_IN_OUT),
      });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: 1 - out,
        filter: `blur(${out * 10}px)`,
        transform: `translateY(${-out * 20}px)`,
      }}
    >
      <Reveal
        text={m.date}
        at={0.1}
        stagger={0.05}
        style={{
          fontFamily: LATIN,
          fontWeight: 300,
          fontSize: 44,
          letterSpacing: "0.28em",
          color: COLOR.sub,
          fontVariantNumeric: "tabular-nums",
        }}
      />
      <div style={{ display: "flex", alignItems: "baseline", marginTop: 26 }}>
        <Reveal
          text={String(m.value)}
          at={0.3}
          duration={0.9}
          style={{ fontFamily: LATIN, fontWeight: 200, fontSize: 232, lineHeight: 1, color: COLOR.text }}
        />
        <Reveal
          text={COPY.unit}
          at={0.45}
          stagger={0.08}
          style={{ fontFamily: JP, fontWeight: 300, fontSize: 84, letterSpacing: "0.04em", color: COLOR.text, marginLeft: 18 }}
        />
      </div>
      <Reveal
        text={m.company}
        at={0.8}
        stagger={0.05}
        style={{ fontFamily: LATIN, fontWeight: 500, fontSize: 48, letterSpacing: "0.06em", color: COLOR.text, marginTop: 34 }}
      />
    </AbsoluteFill>
  );
};

const ScaleBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const W = 640;
  const max = MILESTONES[MILESTONES.length - 1].value;

  const appear = interpolate(t, [0.2, 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // value eases from the previous milestone to the next shortly after each one appears
  let value = 0;
  MILESTONES.forEach((m, i) => {
    const prev = i === 0 ? 0 : MILESTONES[i - 1].value;
    value += interpolate(t, [i * STEP + 0.35, i * STEP + 1.35], [0, m.value - prev], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE_OUT),
    });
  });

  return (
    <div style={{ position: "relative", width: W, height: 12, opacity: appear }}>
      <div style={{ position: "absolute", top: 5, left: 0, width: W, height: 2, background: COLOR.hairline }} />
      <div style={{ position: "absolute", top: 5, left: 0, width: (W * value) / max, height: 2, background: COLOR.text }} />
      {Array.from({ length: max + 1 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 3,
            left: (W * i) / max - 3,
            width: 6,
            height: 6,
            borderRadius: 3,
            background: i <= value + 1e-6 ? COLOR.text : COLOR.hairline,
          }}
        />
      ))}
    </div>
  );
};

const History: React.FC<{ length: number }> = ({ length }) => {
  const { fps } = useVideoConfig();
  return (
    <Scene length={length}>
      <Reveal
        text={COPY.historyLabel}
        at={0.1}
        stagger={0.06}
        style={{ fontFamily: JP, fontWeight: 400, fontSize: 34, letterSpacing: "0.4em", color: COLOR.sub }}
      />
      <div style={{ position: "relative", width: 1080, height: 470, marginTop: 70, marginBottom: 70 }}>
        {MILESTONES.map((m, i) => (
          <Sequence
            key={m.date}
            from={Math.round(i * STEP * fps)}
            durationInFrames={i === MILESTONES.length - 1 ? undefined : Math.round(STEP * fps)}
            layout="none"
          >
            <Milestone m={m} last={i === MILESTONES.length - 1} />
          </Sequence>
        ))}
      </div>
      <ScaleBar />
    </Scene>
  );
};

/* ---------- Scene 4: message ---------- */
const Message: React.FC<{ length: number }> = ({ length }) => (
  <Scene length={length}>
    <Reveal
      text={COPY.messageLead}
      at={0.35}
      stagger={0.08}
      style={{ fontFamily: JP, fontWeight: 300, fontSize: 62, letterSpacing: "0.08em", color: COLOR.sub }}
    />
    <div style={{ marginTop: 52, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <Reveal
        text={COPY.message1}
        at={1.1}
        stagger={0.1}
        duration={0.8}
        style={{ fontFamily: JP, fontWeight: 300, fontSize: 92, letterSpacing: "0.04em", color: COLOR.text }}
      />
      <Reveal
        text={COPY.message2}
        at={1.65}
        stagger={0.1}
        duration={0.8}
        style={{ fontFamily: JP, fontWeight: 300, fontSize: 92, letterSpacing: "0.04em", color: COLOR.text }}
      />
    </div>
  </Scene>
);

/* ---------- Scene 5: closing ---------- */
const Closing: React.FC<{ length: number }> = ({ length }) => (
  <Scene length={length} exit={0.45}>
    <Reveal
      text={COPY.closing}
      at={0.3}
      stagger={0.08}
      style={{ fontFamily: JP, fontWeight: 300, fontSize: 88, letterSpacing: "0.06em", color: COLOR.text }}
    />
    <Reveal
      text={COPY.cta}
      at={1.25}
      stagger={0.05}
      style={{ fontFamily: JP, fontWeight: 400, fontSize: 38, letterSpacing: "0.2em", color: COLOR.sub, marginTop: 64 }}
    />
  </Scene>
);

/* ---------- Timeline ---------- */
const TIMELINE = [
  { C: Title, start: 0, end: 5.2 },
  { C: Formula, start: 5.2, end: 11.0 },
  { C: History, start: 11.0, end: 11.0 + STEP * MILESTONES.length },
  { C: Message, start: 23.0, end: 27.0 },
  { C: Closing, start: 27.0, end: null },
];

export const MarketCapPromo: React.FC = () => {
  useFonts();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR.bg,
        backgroundImage: "radial-gradient(ellipse 80% 55% at 50% 42%, #18181a 0%, #0a0a0b 55%, #000 100%)",
      }}
    >
      {TIMELINE.map(({ C, start, end }) => {
        const from = sec(start);
        const to = end === null ? DURATION_IN_FRAMES : sec(end);
        const length = (to - from) / fps;
        return (
          <Sequence key={start} from={from} durationInFrames={to - from}>
            <C length={length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

