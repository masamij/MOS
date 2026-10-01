// NTSC film rate: 24000/1001 ≈ 23.976 fps
export const FPS = 24000 / 1001;
// 719 frames ≈ 29.99 s
export const DURATION_IN_FRAMES = 719;

export const sec = (s: number) => Math.round(s * FPS);
