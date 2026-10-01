import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Here<span className="text-accent">Now</span>
        </h1>
        <p className="text-lg text-white/70 mb-2">
          今ここでしか読めないSNS。
        </p>
        <p className="text-sm text-white/50 mb-10">
          投稿は「指定された場所・指定された時間」にいる人にしか届きません。
          通り過ぎた人だけが知る、その瞬間の言葉。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/feed"
            className="px-6 py-3 rounded-full bg-accent text-white font-medium hover:opacity-90"
          >
            今ここを覗く
          </Link>
          <Link
            href="/compose"
            className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5"
          >
            投稿する
          </Link>
        </div>
        <div className="mt-16 text-xs text-white/30">
          位置情報の使用許可が必要です
        </div>
      </div>
    </main>
  );
}
