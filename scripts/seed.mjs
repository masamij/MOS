import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SPOTS = {
  shibuya: { lat: 35.6595, lng: 139.7005 },
  shinjuku: { lat: 35.6909, lng: 139.7006 },
  shinbashi: { lat: 35.6664, lng: 139.7585 },
  osaka: { lat: 34.6687, lng: 135.5012 },
  kyoto: { lat: 34.9949, lng: 135.7849 },
  sf: { lat: 37.7956, lng: -122.3935 },
};

const now = new Date();
const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const in6h = new Date(now.getTime() + 6 * 60 * 60 * 1000);

const SEED = [
  {
    spot: "shibuya",
    nickname: "matcha",
    body: "スクランブル交差点、いま信号待ちの人波がすごい。ストリートピアノの音が遠くから聴こえる🎹",
    radiusM: 150,
    endsAt: in2h,
  },
  {
    spot: "shibuya",
    nickname: "anon",
    body: "渋谷ハチ公前で待ち合わせ中。10分遅刻されてる…",
    radiusM: 80,
    endsAt: in2h,
  },
  {
    spot: "shibuya",
    nickname: "wanderer",
    body: "この交差点を見てると、自分の悩みなんて小さく思える。みんなどこに向かってるんだろう。",
    radiusM: 300,
    endsAt: in6h,
  },
  {
    spot: "shinjuku",
    nickname: "tomo",
    body: "新宿東口の喫煙所、いつもの常連さんと会えた。今日もお疲れさまでした。",
    radiusM: 50,
    endsAt: in2h,
  },
  {
    spot: "shinjuku",
    nickname: "midnight",
    body: "終電逃した。歌舞伎町の朝まで営業の店、いいとこ知ってる人いる？",
    radiusM: 500,
    endsAt: in6h,
  },
  {
    spot: "shinbashi",
    nickname: "salaryman",
    body: "SL広場のいつものベンチで一杯。今日は早く帰る予定。",
    radiusM: 100,
    endsAt: in2h,
  },
  {
    spot: "osaka",
    nickname: "takoyaki",
    body: "道頓堀のグリコ前、外国人観光客でいっぱいや。ええ景色。",
    radiusM: 200,
    endsAt: in6h,
  },
  {
    spot: "osaka",
    nickname: "kuidaore",
    body: "道頓堀の川沿い、夜の灯りが映ってる。誰かと歩きたい夜。",
    radiusM: 250,
    endsAt: in6h,
  },
  {
    spot: "kyoto",
    nickname: "kohaku",
    body: "清水寺の参道、桜の余韻。観光客が引いた夕方が一番好き。",
    radiusM: 200,
    endsAt: in6h,
  },
  {
    spot: "sf",
    nickname: "fog",
    body: "Ferry Building, watching the bay bridge lights flicker on. Salt in the air.",
    radiusM: 200,
    endsAt: in6h,
  },
];

await prisma.post.deleteMany({});
for (const s of SEED) {
  const coord = SPOTS[s.spot];
  await prisma.post.create({
    data: {
      nickname: s.nickname,
      body: s.body,
      lat: coord.lat,
      lng: coord.lng,
      radiusM: s.radiusM,
      startsAt: now,
      endsAt: s.endsAt,
    },
  });
}
console.log(`Seeded ${SEED.length} posts.`);
await prisma.$disconnect();
