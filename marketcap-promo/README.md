# 時価総額 30秒プロモ（TikTok）

Remotion で作った縦型 30 秒のプロモ動画。黒地に白文字だけのミニマルな構成で、本文は 1 文字ずつ（フェード・浮上・ぼかし解除）現れます。各行はナレーションでその言葉が読まれた瞬間に書き始められます。

- 出力: `out/marketcap-promo.mp4` — 1080×1920 / 24000/1001 fps（23.976）/ 719 フレーム（29.99 秒）/ H.264 High, yuv420p ／ 音声 AAC 48kHz ステレオ（ナレーション、-14 LUFS）
- 説明文: [`caption.md`](caption.md)
- ナレーション台本（タイムコード付き）: [`narration.md`](narration.md)

## 構成

以前の解説スライド（会社の値札 → 計算 → 値札が毎日変わる理由 → 期待 → つまり）の流れを踏まえた構成です。

| 秒 | シーン | 内容 |
| --- | --- | --- |
| 0.0–4.4 | 時価総額とは | 会社の値札。これだけ。 |
| 4.4–10.5 | 計算 | 株価 × 株の枚数 ／ 1,000円 × 100万枚 → 10億円 |
| 10.5–15.1 | 値札は毎日変わる | 買いたい人が増える ↑ 上がる ／ 減る ↓ 下がる |
| 15.1–22.5 | なぜ増えるのか | 答えは、期待。そのワクワクが、そのまま数字になる。 |
| 22.5–30.0 | つまり | 未来への期待を、いまの値段に翻訳したもの。今この瞬間の、みんなの本気度。 |

文字は TikTok の UI（下部キャプション・右側ボタン）に被らないよう画面中央やや上に配置しています。

## 使い方

```bash
npm install
npm run studio   # プレビュー
npm run render   # out/marketcap-promo.mp4 を書き出し
```

ナレーションを変えたときは、先に音声とタイミングを作り直します。

```bash
pip install pyopenjtalk-plus numpy
python scripts/narrate.py   # public/narration.wav と src/narration.json を再生成
```

`scripts/narrate.py` の `SCRIPT` が読み上げ文です。1 フレーズずつ合成して並べ、各フレーズの開始時刻と長さを `src/narration.json` に書き出します。画面の各行はこの時刻に合わせて現れ、シーンの長さもここから決まります。30 秒に収まらない場合は読み上げ速度を自動で少し上げます。

`npm run render` は Remotion で PNG 連番を出力し、ffmpeg で正確に 24000/1001 fps の MP4 へエンコードします（ffmpeg が必要）。Remotion が Chrome をダウンロードできない環境では `BROWSER=/path/to/chrome npm run render` で既存の Chromium を指定してください。

画面の文字は `src/content.ts`、レイアウトは `src/MarketCapPromo.tsx`、文字アニメーションは `src/Reveal.tsx` にあります。

フォント: Noto Sans JP / Inter（SIL Open Font License、`@fontsource-variable` 経由）。

音声: HTS Voice "Mei" © Nagoya Institute of Technology（CC BY 3.0）。投稿時はクレジット表記が必要です（`caption.md` に記載済み）。
