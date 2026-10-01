# HereNow

> 今ここでしか読めないSNS。

投稿は「指定された場所」かつ「指定された時間帯」にいる人にしか届きません。
通り過ぎた人だけが知る、その瞬間の言葉。

## コンセプト

- **位置 × 時間限定**: 投稿は半径20m〜1kmの範囲で、指定した時間帯のみ公開
- **その場所にいないと読めない**: GPSベース、リアルとデジタルの融合
- **匿名（ニックネーム）**: 気軽に。フォロー・いいね・シェアなし

## ローカル開発

```bash
# 1. 依存をインストール
npm install

# 2. .env を作成（.env.example をコピー）
cp .env.example .env
# DATABASE_URL に PostgreSQL の接続文字列を入れる
# 例: ローカルなら docker run -e POSTGRES_PASSWORD=pw -p 5432:5432 -d postgres:16
#     DATABASE_URL="postgresql://postgres:pw@localhost:5432/postgres"
#     DIRECT_URL も同じ値で OK

# 3. マイグレーション適用
npx prisma migrate deploy

# 4. 起動
npm run dev
```

`http://localhost:3000` を開く（位置情報の許可が必要）。

## Vercel へのデプロイ

### 1. Postgres を用意する

無料枠があるどれでも OK：

| プロバイダ | 備考 |
|---|---|
| [Neon](https://neon.tech) | 推奨。サーバレス、無料枠あり |
| [Supabase](https://supabase.com) | Postgres + 認証一括 |
| [Vercel Postgres](https://vercel.com/storage/postgres) | Vercel 統合が楽 |

ダッシュボードで **Pooled** と **Direct** 両方の接続文字列を取得。

### 2. Vercel にプロジェクトを接続

1. https://vercel.com/new で GitHub リポジトリ `masamij/MOS` をインポート
2. Framework Preset は **Next.js** が自動検出される
3. **Environment Variables** に以下を追加：
   - `DATABASE_URL` = Pooled 接続文字列（`?pgbouncer=true&connection_limit=1` 推奨）
   - `DIRECT_URL` = Direct 接続文字列（マイグレーション用）
4. **Deploy** を押す

ビルドコマンドは `vercel.json` で `prisma migrate deploy && next build` に固定済み。初回デプロイで自動的にテーブルが作られます。

### 3. 動作確認

デプロイされた URL を開き、位置情報を許可 → 投稿 → 同じ場所からフィードを見て表示されることを確認。

> モバイルから試すと位置情報の体験が良いです。

## 技術スタック

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma + PostgreSQL
- Haversine 距離計算でサーバ側フィルタリング

## ディレクトリ

```
src/
  app/
    page.tsx           # ランディング
    feed/page.tsx      # 現在地に届いている投稿一覧
    compose/page.tsx   # 投稿フォーム
    api/posts/route.ts # 投稿の作成・取得
  lib/
    prisma.ts          # Prisma クライアント
    geo.ts             # 距離計算（Haversine）
prisma/
  schema.prisma        # Post モデル
  migrations/          # マイグレーション
```

## 本番化に向けたメモ

- DB に PostGIS を入れて `ST_DWithin` でサーバ側絞り込み（現在は全件取って JS で距離計算）
- 位置情報の精度を意図的に丸める（プライバシー保護）
- 投稿のモデレーション（NGワード／通報フロー）
- レート制限（1ユーザー 1日 N投稿）
- メール／パスキー認証の追加
- 期限切れ投稿の自動削除ジョブ
