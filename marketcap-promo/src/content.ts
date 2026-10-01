// On-screen copy. Milestones are the dates each market-cap threshold was first reached:
// Apple $1T (2018-08-02), $2T (2020-08-19), $3T intraday (2022-01-03);
// NVIDIA $4T (2025-07-09), $5T (2025-10-29).
export const MILESTONES = [
  { date: "2018.8", value: 1, company: "Apple" },
  { date: "2020.8", value: 2, company: "Apple" },
  { date: "2022.1", value: 3, company: "Apple" },
  { date: "2025.7", value: 4, company: "NVIDIA" },
  { date: "2025.10", value: 5, company: "NVIDIA" },
] as const;

export const COPY = {
  title: "時価総額。",
  titleSub: "企業の価値を、ひとつの数字で。",
  price: "株価",
  times: "×",
  shares: "発行済株式数",
  result: "時価総額",
  historyLabel: "時価総額の節目",
  unit: "兆ドル",
  messageLead: "時価総額とは、",
  message1: "未来への、",
  message2: "期待の大きさ。",
  closing: "数字で、世界を読む。",
  cta: "フォローして、続きを。",
};

export const ALL_TEXT =
  Object.values(COPY).join("") +
  MILESTONES.map((m) => `${m.date}${m.value}${m.company}`).join("") +
  "0123456789.";
