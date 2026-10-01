// On-screen copy. Display text carries no 句読点: pauses are expressed with spaces and line breaks.
// The spoken version of each line (with punctuation for prosody) lives in scripts/narrate.py.
export const COPY = {
  // 1. 時価総額とは
  defLabel: "時価総額とは",
  defLead: "会社の",
  defWord: "今の値段",
  defFormula: "株価 × 株の枚数",
  // 2. 値段は毎日動く
  moveLabel: "値段は毎日動く",
  moveMore: "買いたい人が増える",
  moveUp: "↑ 上がる",
  moveLess: "買いたい人が減る",
  moveDown: "↓ 下がる",
  // 3. なぜ増える？
  whyLabel: "なぜ買いたい人が増えるのか",
  whyVoice1: "「この会社には こんな未来がある」",
  whyVoice2: "「きっと これをやってくれる」",
  whyWord: "期待値",
  whyTail: "そのまま今の値段になる",
  // 4. ウォーレン・バフェット
  buffettLabel: "ウォーレン・バフェット",
  buffett1: "価格は あなたが払うもの",
  buffett2: "価値は あなたが得るもの",
  // 5. 阿部修平（スパークス・グループ）
  abeLabel: "阿部修平　スパークス・グループ",
  abe1: "株価と 企業の実態価値",
  abe2: "そのギャップに投資する",
  // 6. つまり
  sumLabel: "つまり時価総額とは",
  sum1: "未来への期待を",
  sum2: "今の値段に",
  sum3: "翻訳したもの",
};

export const ALL_TEXT = Object.values(COPY).join("");
