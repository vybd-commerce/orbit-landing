#!/usr/bin/env bash
# Encode the chosen Veo candidates into web loops for /consulting/journey.
#
#   tools/journey-clips/encode.sh <dir-with-raw-veo-mp4s>
#
# Each clip: 1s tail→head crossfade (seamless loop, 7s), graded toward the
# page black, then 960 (phones + triptych panels) and, for full-bleed clips,
# 1280, in mp4 + webm, plus a webp poster. Needs ffmpeg and python3 + Pillow.
set -euo pipefail
SRC="$1"
OUT="$(cd "$(dirname "$0")/../.." && pwd)/public/media/journey"
GRADE="eq=brightness=-0.03:contrast=1.08:saturation=0.85,vignette=PI/5"

# clip name : chosen candidate : sizes
CLIPS=(
  "made-dhaka:made-dhaka_2:960"
  "made-hcmc:made-hcmc_2:960"
  "made-shanghai:made-shanghai_2:960"
  "loaded:loaded_1:960 1280"
  "cleared:cleared_2:960 1280"
  "shelf-ny:shelf-ny_2:960"
  "shelf-london:shelf-london_1:960"
  "shelf-mumbai:shelf-mumbai_2:960"
  "hand-ny:hand-ny_2:960 1280"
  "hand-london:hand-london_2:960 1280"
  "hand-mumbai:hand-mumbai_1:960 1280"
)

for entry in "${CLIPS[@]}"; do
  IFS=: read -r name pick sizes <<<"$entry"
  mkdir -p "$OUT/$name"
  master="$(mktemp -t "$name").mp4"
  ffmpeg -loglevel error -y -i "$SRC/$pick.mp4" -filter_complex \
    "[0:v]split[a][b];[a]trim=1:8,setpts=PTS-STARTPTS[main];[b]trim=0:1,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=1:offset=6,$GRADE,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -crf 12 -preset slow "$master"
  for w in $sizes; do
    ffmpeg -loglevel error -y -i "$master" -vf "scale=$w:-2:flags=lanczos" -an -c:v libx264 -profile:v high \
      -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$name/$w.mp4"
    ffmpeg -loglevel error -y -i "$master" -vf "scale=$w:-2:flags=lanczos" -an -c:v libvpx-vp9 \
      -crf 40 -b:v 0 -row-mt 1 "$OUT/$name/$w.webm"
  done
  png="$(mktemp -t "$name").png"
  ffmpeg -loglevel error -y -ss 2 -i "$master" -frames:v 1 -vf scale=960:-2 "$png"
  python3 -c "from PIL import Image; Image.open('$png').save('$OUT/$name/poster.webp', 'WEBP', quality=70)"
  rm -f "$master" "$png"
  echo "$name done"
done
