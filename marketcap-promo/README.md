# 時価総額 30秒プロモ（TikTok）

Remotion で作った縦型 30 秒のプロモ動画。黒地に白文字だけのミニマルな構成で、本文は 1 文字ずつ（フェード・浮上・ぼかし解除）現れます。

- 出力: `out/marketcap-promo.mp4` — 1080×1920 / 24000/1001 fps（23.976）/ 719 フレーム（29.99 秒）/ H.264 High, yuv420p, 音声なし
- 説明文: [`caption.md`](caption.md)

## 構成

以前の解説スライド（会社の値札 → 計算 → 値札が毎日変わる理由 → 期待 → つまり）の流れを踏まえた構成です。

| 秒 | シーン | 内容 |
| --- | --- | --- |
| 0.0–4.6 | 時価総額とは | 会社の値札。これだけ。 |
| 4.6–10.6 | 計算 | 株価 × 株の枚数 ／ 1,000円 × 100万枚 → 10億円 |
| 10.6–16.6 | 値札は毎日変わる | 買いたい人が増える ↑ 上がる ／ 減る ↓ 下がる |
| 16.6–23.8 | なぜ増えるのか | 答えは、期待。そのワクワクが、そのまま数字になる。 |
| 23.8–30.0 | つまり | 未来への期待を、いまの値段に翻訳したもの。今この瞬間の、みんなの本気度。 |

文字は TikTok の UI（下部キャプション・右側ボタン）に被らないよう画面中央やや上に配置しています。

## 使い方

```bash
npm install
npm run studio   # プレビュー
npm run render   # out/marketcap-promo.mp4 を書き出し
```

`npm run render` は Remotion で PNG 連番を出力し、ffmpeg で正確に 24000/1001 fps の MP4 へエンコードします（ffmpeg が必要）。Remotion が Chrome をダウンロードできない環境では `BROWSER=/path/to/chrome npm run render` で既存の Chromium を指定してください。

コピーは `src/content.ts`、タイミングは `src/MarketCapPromo.tsx` の `TIMELINE`（秒）、文字アニメーションは `src/Reveal.tsx` にあります。

フォント: Noto Sans JP / Inter（SIL Open Font License、`@fontsource-variable` 経由）。
