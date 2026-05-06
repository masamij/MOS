# HereNow

> 今ここでしか読めないSNS。

投稿は「指定された場所」かつ「指定された時間帯」にいる人にしか届きません。
通り過ぎた人だけが知る、その瞬間の言葉。

## コンセプト

- **位置 × 時間限定**: 投稿は半径20m〜1kmの範囲で、指定した時間帯のみ公開
- **その場所にいないと読めない**: GPSベース、リアルとデジタルの融合
- **匿名（ニックネーム）**: 気軽に。フォロー・いいね・シェアなし

## セットアップ

```bash
npm install
npx prisma db push
npm run dev
```

http://localhost:3000 を開く（位置情報の許可が必要）。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript + Tailwind CSS
- Prisma + SQLite (本番は PostgreSQL + PostGIS 推奨)

## ディレクトリ

```
src/
  app/
    page.tsx          # ランディング
    feed/page.tsx     # 現在地に届いている投稿一覧
    compose/page.tsx  # 投稿フォーム
    api/posts/route.ts # 投稿の作成・取得
  lib/
    prisma.ts         # Prisma クライアント
    geo.ts            # 距離計算（Haversine）
prisma/
  schema.prisma       # Post モデル
```

## 本番化メモ

- DB は PostgreSQL + PostGIS に移行し、`ST_DWithin` でサーバ側絞り込み
- 位置情報は精度を意図的に丸める（プライバシー）
- 投稿のモデレーション（NGワード／通報）
- レート制限（1人 1日 N投稿）
- メール／パスキー認証の追加
