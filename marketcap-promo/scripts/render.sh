#!/usr/bin/env bash
# Render the promo as a PNG sequence with Remotion, then encode it with ffmpeg
# at an exact 24000/1001 (23.976) fps so the MP4 timestamps are clean.
#   BROWSER=/path/to/chrome ./scripts/render.sh
set -euo pipefail
cd "$(dirname "$0")/.."

FRAMES=out/frames
OUT=out/marketcap-promo.mp4
BROWSER_FLAG=()
[[ -n "${BROWSER:-}" ]] && BROWSER_FLAG=(--browser-executable="$BROWSER")

rm -rf "$FRAMES"
npx remotion render MarketCapPromo "$FRAMES" --sequence --image-format=png "${BROWSER_FLAG[@]}"

# A whisper of temporal grain dithers the dark gradient (no banding) and reads as film.
ffmpeg -y -loglevel error -framerate 24000/1001 -i "$FRAMES/element-%03d.png" \
  -vf "noise=alls=1:allf=t,format=yuv420p" \
  -c:v libx264 -preset slow -crf 18 -tune film -profile:v high -level 4.1 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -r 24000/1001 -video_track_timescale 24000 -movflags +faststart "$OUT"

if [[ -z "${KEEP_FRAMES:-}" ]]; then rm -rf "$FRAMES"; fi
ffprobe -v error -show_entries stream=width,height,r_frame_rate,avg_frame_rate,nb_frames -show_entries format=duration "$OUT"
