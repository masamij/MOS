import { CSSProperties, useEffect, useState } from "react";
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
import { ALL_TEXT, COPY } from "./content";
import { Reveal } from "./Reveal";
import { Scene } from "./Scene";
import { COLOR, EASE_OUT, JP, LATIN } from "./theme";
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

/* ---------- type styles ---------- */
const label: CSSProperties = {
  fontFamily: JP,
  fontWeight: 400,
  fontSize: 34,
  letterSpacing: "0.32em",
  color: COLOR.sub,
  marginBottom: 72,
};
const lead: CSSProperties = { fontFamily: JP, fontWeight: 300, fontSize: 50, letterSpacing: "0.1em", color: COLOR.sub };
const hero: CSSProperties = {
  fontFamily: JP,
  fontWeight: 200,
  fontSize: 230,
  lineHeight: 1.15,
  letterSpacing: "0.04em",
  color: COLOR.text,
};
const body: CSSProperties = { fontFamily: JP, fontWeight: 300, fontSize: 76, letterSpacing: "0.04em", color: COLOR.text };
const small: CSSProperties = { fontFamily: JP, fontWeight: 300, fontSize: 44, letterSpacing: "0.06em", color: COLOR.sub };

const Hairline: React.FC<{ at: number; width: number; style?: CSSProperties }> = ({ at, width, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame / fps, [at, at + 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EASE_OUT),
  });
  return <div style={{ width: width * p, height: 2, background: COLOR.hairline, ...style }} />;
};

/* ---------- 1. 時価総額とは：会社の値札 ---------- */
const Definition: React.FC<{ length: number }> = ({ length }) => (
  <Scene length={length}>
    <Reveal text={COPY.defLabel} at={0.2} stagger={0.06} style={label} />
    <Reveal text={COPY.defLead} at={0.7} stagger={0.08} style={{ ...body, fontSize: 80 }} />
    <Reveal text={COPY.defWord} at={1.2} stagger={0.14} duration={0.9} style={hero} />
    <Reveal text={COPY.defTail} at={2.5} stagger={0.08} style={{ ...lead, marginTop: 36 }} />
  </Scene>
);

/* ---------- 2. 計算はかんたん ---------- */
const Calculation: React.FC<{ length: number }> = ({ length }) => (
  <Scene length={length}>
    <Reveal text={COPY.calcLabel} at={0.2} stagger={0.06} style={label} />
    <Reveal text={COPY.calcFormula} at={0.8} stagger={0.07} style={{ ...body, fontFamily: LATIN, fontWeight: 300 }} />
    <Hairline at={1.9} width={640} style={{ margin: "60px 0" }} />
    <Reveal
      text={COPY.calcExample}
      at={2.3}
      stagger={0.045}
      style={{ ...small, fontFamily: LATIN, fontSize: 52, fontVariantNumeric: "tabular-nums" }}
    />
    <Reveal
      text={COPY.calcResult}
      at={3.5}
      stagger={0.12}
      duration={0.9}
      style={{ ...hero, fontFamily: LATIN, fontSize: 200, marginTop: 40, letterSpacing: "0.01em" }}
    />
  </Scene>
);

/* ---------- 3. 値札は毎日変わる ---------- */
const Movement: React.FC<{ length: number }> = ({ length }) => {
  const cause: CSSProperties = { ...small, fontSize: 50, color: COLOR.text };
  const effect = (color: string): CSSProperties => ({
    fontFamily: JP,
    fontWeight: 300,
    fontSize: 100,
    letterSpacing: "0.08em",
    color,
    marginTop: 18,
  });
  return (
    <Scene length={length}>
      <Reveal text={COPY.moveLabel} at={0.2} stagger={0.06} style={label} />
      <Reveal text={COPY.moveMore} at={1.0} stagger={0.05} style={cause} />
      <Reveal text={COPY.moveUp} at={1.8} stagger={0.08} style={effect(COLOR.up)} />
      <Reveal text={COPY.moveLess} at={2.7} stagger={0.05} style={{ ...cause, marginTop: 84 }} />
      <Reveal text={COPY.moveDown} at={3.5} stagger={0.08} style={effect(COLOR.down)} />
    </Scene>
  );
};

/* ---------- 4. なぜ増える？答えは期待 ---------- */
const Expectation: React.FC<{ length: number }> = ({ length }) => {
  const voice: CSSProperties = { ...small, fontSize: 42, marginTop: 14 };
  const tail: CSSProperties = { ...body, fontSize: 58 };
  return (
    <Scene length={length}>
      <Reveal text={COPY.whyLabel} at={0.2} stagger={0.06} style={label} />
      <Reveal text={COPY.whyLead} at={0.9} stagger={0.08} style={lead} />
      <Reveal text={COPY.whyWord} at={1.5} stagger={0.16} duration={1.0} style={{ ...hero, marginBottom: 40 }} />
      <Reveal text={COPY.whyVoice1} at={2.7} stagger={0.045} style={voice} />
      <Reveal text={COPY.whyVoice2} at={3.2} stagger={0.045} style={voice} />
      <Reveal text={COPY.whyTail1} at={4.2} stagger={0.06} style={{ ...tail, marginTop: 72 }} />
      <Reveal text={COPY.whyTail2} at={4.6} stagger={0.06} style={{ ...tail, marginTop: 12 }} />
    </Scene>
  );
};

/* ---------- 5. つまり ---------- */
const Summary: React.FC<{ length: number }> = ({ length }) => {
  const line: CSSProperties = { ...body, fontSize: 84, lineHeight: 1.45 };
  return (
    <Scene length={length} exit={0.5}>
      <Reveal text={COPY.sumLabel} at={0.2} stagger={0.05} style={label} />
      <Reveal text={COPY.sum1} at={0.8} stagger={0.07} style={line} />
      <Reveal text={COPY.sum2} at={1.3} stagger={0.07} style={line} />
      <Reveal text={COPY.sum3} at={1.8} stagger={0.07} style={line} />
      <Hairline at={3.0} width={600} style={{ margin: "64px 0 56px" }} />
      <Reveal text={COPY.sumTail1} at={3.2} stagger={0.06} style={small} />
      <Reveal text={COPY.sumTail2} at={3.7} stagger={0.09} duration={0.8} style={{ ...body, fontSize: 72, marginTop: 20 }} />
    </Scene>
  );
};

/* ---------- Timeline (seconds) ---------- */
const TIMELINE = [
  { C: Definition, start: 0, end: 4.6 },
  { C: Calculation, start: 4.6, end: 10.6 },
  { C: Movement, start: 10.6, end: 16.6 },
  { C: Expectation, start: 16.6, end: 23.8 },
  { C: Summary, start: 23.8, end: null },
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
        return (
          <Sequence key={start} from={from} durationInFrames={to - from}>
            <C length={(to - from) / fps} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
