import { CSSProperties, useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ALL_TEXT, COPY } from "./content";
import narration from "./narration.json";
import { Reveal } from "./Reveal";
import { Scene } from "./Scene";
import { COLOR, EASE_OUT, JP, LATIN } from "./theme";
import { DURATION_IN_FRAMES, sec } from "./timing";

type CopyKey = keyof typeof COPY;
type Cues = Record<string, { t: number; d: number }>;

/** Reveal props for a line: starts when its phrase is spoken and finishes writing as the phrase ends. */
const cue = (cues: Cues, key: CopyKey) => {
  const c = cues[key];
  const text = COPY[key];
  const n = Array.from(text).length;
  return {
    text,
    at: Math.max(c.t - 0.04, 0),
    stagger: Math.min(Math.max((c.d * 0.6) / n, 0.03), 0.12),
    duration: 0.6,
  };
};

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

type SceneProps = { length: number; cues: Cues };

/* ---------- 1. 時価総額とは：会社の値札 ---------- */
const Definition: React.FC<SceneProps> = ({ length, cues }) => (
  <Scene length={length}>
    <Reveal {...cue(cues, "defLabel")} style={label} />
    <Reveal {...cue(cues, "defLead")} style={{ ...body, fontSize: 80 }} />
    <Reveal {...cue(cues, "defWord")} duration={0.85} style={hero} />
    <Reveal {...cue(cues, "defTail")} style={{ ...lead, marginTop: 36 }} />
  </Scene>
);

/* ---------- 2. 計算はかんたん ---------- */
const Calculation: React.FC<SceneProps> = ({ length, cues }) => (
  <Scene length={length}>
    <Reveal {...cue(cues, "calcLabel")} style={label} />
    <Reveal {...cue(cues, "calcFormula")} style={{ ...body, fontFamily: LATIN, fontWeight: 300 }} />
    <Hairline at={cues.calcExample.t - 0.35} width={640} style={{ margin: "60px 0" }} />
    <Reveal
      {...cue(cues, "calcExample")}
      style={{ ...small, fontFamily: LATIN, fontSize: 52, fontVariantNumeric: "tabular-nums" }}
    />
    <Reveal
      {...cue(cues, "calcResult")}
      duration={0.85}
      style={{ ...hero, fontFamily: LATIN, fontSize: 200, marginTop: 40, letterSpacing: "0.01em" }}
    />
  </Scene>
);

/* ---------- 3. 値札は毎日変わる ---------- */
const Movement: React.FC<SceneProps> = ({ length, cues }) => {
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
      <Reveal {...cue(cues, "moveLabel")} style={label} />
      <Reveal {...cue(cues, "moveMore")} style={cause} />
      <Reveal {...cue(cues, "moveUp")} style={effect(COLOR.up)} />
      <Reveal {...cue(cues, "moveLess")} style={{ ...cause, marginTop: 84 }} />
      <Reveal {...cue(cues, "moveDown")} style={effect(COLOR.down)} />
    </Scene>
  );
};

/* ---------- 4. なぜ増える？答えは期待 ---------- */
const Expectation: React.FC<SceneProps> = ({ length, cues }) => {
  const voice: CSSProperties = { ...small, fontSize: 42, marginTop: 14 };
  const tail: CSSProperties = { ...body, fontSize: 58 };
  return (
    <Scene length={length}>
      <Reveal {...cue(cues, "whyLabel")} style={label} />
      <Reveal {...cue(cues, "whyLead")} style={lead} />
      <Reveal {...cue(cues, "whyWord")} duration={0.85} style={{ ...hero, marginBottom: 40 }} />
      <Reveal {...cue(cues, "whyVoice1")} style={voice} />
      <Reveal {...cue(cues, "whyVoice2")} style={voice} />
      <Reveal {...cue(cues, "whyTail1")} style={{ ...tail, marginTop: 72 }} />
      <Reveal {...cue(cues, "whyTail2")} style={{ ...tail, marginTop: 12 }} />
    </Scene>
  );
};

/* ---------- 5. つまり ---------- */
const Summary: React.FC<SceneProps> = ({ length, cues }) => {
  const line: CSSProperties = { ...body, fontSize: 84, lineHeight: 1.45 };
  return (
    <Scene length={length} exit={0.5}>
      <Reveal {...cue(cues, "sumLabel")} style={label} />
      <Reveal {...cue(cues, "sum1")} style={line} />
      <Reveal {...cue(cues, "sum2")} style={line} />
      <Reveal {...cue(cues, "sum3")} style={line} />
      <Hairline at={cues.sumTail1.t - 0.4} width={600} style={{ margin: "64px 0 56px" }} />
      <Reveal {...cue(cues, "sumTail1")} style={small} />
      <Reveal {...cue(cues, "sumTail2")} duration={0.8} style={{ ...body, fontSize: 72, marginTop: 20 }} />
    </Scene>
  );
};

/* ---------- Timeline: scene starts / lengths come from the narration cue sheet ---------- */
const SCENES = [Definition, Calculation, Movement, Expectation, Summary];

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
      {(narration.scenes as unknown as { start: number; length: number; cues: Cues }[]).map(({ start, length, cues }, i) => {
        const C = SCENES[i];
        const from = sec(start);
        const to = i === SCENES.length - 1 ? DURATION_IN_FRAMES : sec(start + length);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <C length={(to - from) / fps} cues={cues} />
          </Sequence>
        );
      })}
      <Audio src={staticFile("narration.wav")} />
    </AbsoluteFill>
  );
};
