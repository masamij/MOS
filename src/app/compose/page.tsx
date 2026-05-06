"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ComposePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusM, setRadiusM] = useState(100);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nickname");
    if (saved) setNickname(saved);

    const now = new Date();
    const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    setStartsAt(toLocalInput(now));
    setEndsAt(toLocalInput(later));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setError("位置情報の取得に失敗: " + err.message),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!coords) {
      setError("位置情報が必要です");
      return;
    }
    setSubmitting(true);
    localStorage.setItem("nickname", nickname);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          body,
          lat: coords.lat,
          lng: coords.lng,
          radiusM,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: new Date(endsAt).toISOString(),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "投稿に失敗しました");
      }
      router.push("/feed");
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-2xl font-bold">
          Here<span className="text-accent">Now</span>
        </Link>
        <Link href="/feed" className="text-sm text-white/60">
          フィードへ
        </Link>
      </header>

      <h2 className="text-xl font-semibold mb-1">投稿する</h2>
      <p className="text-xs text-white/50 mb-6">
        この場所・この時間にいる人にだけ届きます。
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs text-white/60 mb-1">ニックネーム</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={24}
            required
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-white/60 mb-1">
            本文 ({body.length}/280)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={280}
            required
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent outline-none"
            placeholder="今ここで起きていること、伝えたいこと…"
          />
        </div>

        <div>
          <label className="block text-xs text-white/60 mb-1">
            届く範囲: 半径 {radiusM}m
          </label>
          <input
            type="range"
            min={20}
            max={1000}
            step={10}
            value={radiusM}
            onChange={(e) => setRadiusM(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1">公開開始</label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1">公開終了</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
            />
          </div>
        </div>

        <p className="text-xs text-white/40">
          位置: {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "取得中…"}
        </p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !coords}
          className="w-full py-3 rounded-full bg-accent text-white font-medium disabled:opacity-40"
        >
          {submitting ? "投稿中…" : "ここに残す"}
        </button>
      </form>
    </main>
  );
}
