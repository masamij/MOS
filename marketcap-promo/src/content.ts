// On-screen copy, following the structure of the earlier market-cap explainer slides:
// 値札 → 計算 → 値札は毎日変わる → 期待 → つまり
export const COPY = {
  // 1. 時価総額とは
  defLabel: "時価総額とは",
  defLead: "会社の",
  defWord: "値札。",
  defTail: "これだけ。",
  // 2. 計算
  calcLabel: "計算は、かんたん。",
  calcFormula: "株価 × 株の枚数",
  calcExample: "1,000円 × 100万枚",
  calcResult: "10億円",
  // 3. 値札は毎日変わる
  moveLabel: "値札は、毎日変わる。",
  moveMore: "買いたい人が増える",
  moveUp: "↑ 上がる",
  moveLess: "買いたい人が減る",
  moveDown: "↓ 下がる",
  // 4. なぜ増える？
  whyLabel: "なぜ、増えるのか。",
  whyLead: "答えは、",
  whyWord: "期待。",
  whyVoice1: "「来年、もっと稼ぐかも。」",
  whyVoice2: "「この新商品、売れるかも。」",
  whyTail1: "そのワクワクが、",
  whyTail2: "そのまま数字になる。",
  // 5. つまり
  sumLabel: "つまり、時価総額とは",
  sum1: "未来への期待を、",
  sum2: "いまの値段に",
  sum3: "翻訳したもの。",
  sumTail1: "今この瞬間の、",
  sumTail2: "みんなの本気度。",
};

export const ALL_TEXT = Object.values(COPY).join("") + "0123456789,";
