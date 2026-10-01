"""Synthesize the Japanese narration and the cue sheet that drives the on-screen text.

Each phrase is synthesized separately (OpenJTalk + HTS voice "Mei"), trimmed, and laid out
with controlled pauses. The start time / duration of every phrase is written to
src/narration.json so each line of text is revealed exactly as it is spoken.

    pip install pyopenjtalk-plus numpy
    python scripts/narrate.py
"""
import json
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np
import pyopenjtalk

ROOT = Path(__file__).resolve().parent.parent
TOTAL = 719 * 1001 / 24000  # composition length in seconds (719 frames @ 23.976)
LEAD = 0.3  # silence before the first phrase of a scene
TAIL = 0.7  # silence after the last phrase (covers the scene's fade-out)
GAP = {"、": 0.08, "。": 0.28}

# (cue key, spoken text, extra pause after). Keys match COPY keys in src/content.ts.
# A spoken text of None is a silent beat: the line is only shown, for `pause` seconds.
SCRIPT = [
    [
        ("defLabel", "時価総額とは、", 0.0),
        ("defLead", "会社の", 0.0),
        ("defWord", "値札。", 0.05),
        ("defTail", None, 0.95),
    ],
    [
        ("calcLabel", None, 0.4),
        ("calcFormula", "株価かける、株の枚数。", 0.05),
        ("calcExample", "千円が百万枚なら、", 0.0),
        ("calcResult", "十億円。", 0.0),
    ],
    [
        ("moveLabel", None, 0.75),
        ("moveMore", "買いたい人が増えれば、", 0.0),
        ("moveUp", "上がる。", 0.0),
        ("moveLess", "減れば、", 0.0),
        ("moveDown", "下がる。", 0.0),
    ],
    [
        ("whyLabel", "なぜ、増えるのか。", 0.0),
        ("whyLead", "答えは、", 0.0),
        ("whyWord", "期待。", 0.05),
        ("whyVoice1", None, 0.45),
        ("whyVoice2", None, 0.6),
        ("whyTail1", "そのワクワクが、", 0.0),
        ("whyTail2", "そのまま数字になる。", 0.0),
    ],
    [
        ("sumLabel", "つまり、", 0.0),
        ("sum1", "未来への期待を、", 0.0),
        ("sum2", "いまの値段に、", 0.0),
        ("sum3", "翻訳したもの。", 0.1),
        ("sumTail1", "今この瞬間の、", 0.0),
        ("sumTail2", "みんなの本気度。", 0.0),
    ],
]


def synth(text: str, speed: float):
    x, sr = pyopenjtalk.tts(text, speed=speed)
    x = x.astype(np.float32) / 32768.0
    loud = np.flatnonzero(np.abs(x) > 0.01)
    pad = int(0.02 * sr)
    x = x[max(loud[0] - pad, 0) : loud[-1] + pad]
    return x, sr


def layout(speed: float):
    scenes, clips, t = [], [], 0.0
    for lines in SCRIPT:
        start, cues = t, {}
        t += LEAD
        for i, (key, text, pause) in enumerate(lines):
            if text is None:  # silent beat
                cues[key] = {"t": round(t - start, 3), "d": pause}
                t += pause
                continue
            x, sr = synth(text, speed)
            d = len(x) / sr
            cues[key] = {"t": round(t - start, 3), "d": round(d, 3)}
            clips.append((t, x, sr))
            t += d
            if i < len(lines) - 1:
                t += GAP.get(text[-1], 0.08) + pause
        t += TAIL
        scenes.append({"start": round(start, 3), "length": round(t - start, 3), "cues": cues})
    return scenes, clips, t


def main():
    for speed in (1.0, 1.05, 1.1, 1.15, 1.2):
        scenes, clips, total = layout(speed)
        if total <= TOTAL:
            break
    else:
        raise SystemExit(f"narration is {total:.2f}s, longer than {TOTAL:.2f}s")

    # the last scene holds until the end of the composition
    scenes[-1]["length"] = round(TOTAL - scenes[-1]["start"], 3)

    sr = clips[0][2]
    mix = np.zeros(int(TOTAL * sr) + 1, dtype=np.float32)
    for t, x, _ in clips:
        i = int(round(t * sr))
        mix[i : i + len(x)] += x[: len(mix) - i]

    out_wav = ROOT / "public" / "narration.wav"
    with tempfile.TemporaryDirectory() as tmp:
        raw = Path(tmp) / "raw.wav"
        with wave.open(str(raw), "wb") as f:
            f.setnchannels(1)
            f.setsampwidth(2)
            f.setframerate(sr)
            f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
        # gentle clean-up: rumble cut, a touch of room, TikTok-level loudness, stereo 48 kHz
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
                "-af",
                "highpass=f=80,equalizer=f=3500:t=q:w=1.2:g=2,"
                "aecho=0.85:0.6:45|80:0.10|0.06,"
                "loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000",
                "-ac", "2", "-t", f"{TOTAL:.3f}", str(out_wav),
            ],
            check=True,
        )

    cue_json = ROOT / "src" / "narration.json"
    cue_json.write_text(json.dumps({"speed": speed, "scenes": scenes}, ensure_ascii=False, indent=2) + "\n")
    print(f"speed {speed}, narration ends at {scenes[-1]['start'] + max(c['t'] + c['d'] for c in scenes[-1]['cues'].values()):.2f}s")
    for s in scenes:
        print(f"  scene @ {s['start']:6.2f}s  length {s['length']:5.2f}s")


if __name__ == "__main__":
    main()
