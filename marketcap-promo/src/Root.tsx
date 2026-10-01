import "@fontsource-variable/noto-sans-jp/wght.css";
import "@fontsource-variable/inter/wght.css";
import { Composition } from "remotion";
import { MarketCapPromo } from "./MarketCapPromo";
import { DURATION_IN_FRAMES, FPS } from "./timing";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MarketCapPromo"
    component={MarketCapPromo}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
