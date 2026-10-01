# 時価総額 30秒プロモ（TikTok）

Remotion で作った縦型 30 秒のプロモ動画。黒地に白文字だけのミニマルな構成で、本文は 1 文字ずつ（フェード・浮上・ぼかし解除）現れます。

- 出力: `out/marketcap-promo.mp4` — 1080×1920 / 24000/1001 fps（23.976）/ 719 フレーム（29.99 秒）/ H.264 High, yuv420p, 音声なし
- 説明文: [`caption.md`](caption.md)

## 構成

| 秒 | シーン | 内容 |
| --- | --- | --- |
| 0.0–5.2 | タイトル | 時価総額。／企業の価値を、ひとつの数字で。 |
| 5.2–11.0 | 定義 | 株価 × 発行済株式数 ＝ 時価総額 |
| 11.0–23.0 | 節目 | 1〜5兆ドル到達の歴史（Apple → NVIDIA）と 0〜5兆ドルのスケールバー |
| 23.0–27.0 | メッセージ | 時価総額とは、未来への、期待の大きさ。 |
| 27.0–30.0 | 締め | 数字で、世界を読む。／フォローして、続きを。 |

文字は TikTok の UI（下部キャプション・右側ボタン）に被らないよう画面中央やや上に配置しています。

## 使い方

```bash
npm install
npm run studio   # プレビュー
npm run render   # out/marketcap-promo.mp4 を書き出し
```

`npm run render` は Remotion で PNG 連番を出力し、ffmpeg で正確に 24000/1001 fps の MP4 へエンコードします（ffmpeg が必要）。Remotion が Chrome をダウンロードできない環境では `BROWSER=/path/to/chrome npm run render` で既存の Chromium を指定してください。

コピーは `src/content.ts`、タイミングは `src/MarketCapPromo.tsx` の `TIMELINE`、文字アニメーションは `src/Reveal.tsx` にあります。

フォント: Noto Sans JP / Inter（SIL Open Font License、`@fontsource-variable` 経由）。
