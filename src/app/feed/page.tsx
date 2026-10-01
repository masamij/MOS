"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_SPOTS } from "@/lib/demoSpots";

type Post = {
  id: string;
  nickname: string;
  body: string;
  lat: number;
  lng: number;
  radiusM: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  distance: number;
};

export default function FeedPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [demoId, setDemoId] = useState<string>("shibuya");
  const [useGPS, setUseGPS] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useGPS) {
      if (!navigator.geolocation) {
        setError("このブラウザは位置情報に対応していません");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setError(null);
        },
        (err) => setError("位置情報の取得に失敗: " + err.message),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      const s = DEMO_SPOTS.find((s) => s.id === demoId) ?? DEMO_SPOTS[0];
      setCoords({ lat: s.lat, lng: s.lng });
      setError(null);
    }
  }, [useGPS, demoId]);

  useEffect(() => {
    if (!coords) return;
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/posts?lat=${coords.lat}&lng=${coords.lng}`);
        const data = await res.json();
        if (active) setPosts(data.posts ?? []);
      } catch {
        if (active) setError("読み込みに失敗しました");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [coords]);

  return (
    <main className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <Link href="/" className="text-2xl font-bold">
          Here<span className="text-accent">Now</span>
        </Link>
        <Link
          href="/compose"
          className="px-4 py-2 rounded-full bg-accent text-white text-sm"
        >
          投稿
        </Link>
      </header>

      <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10">
        <div className="text-xs text-white/60 mb-2">📍 デモモード：場所を選ぶ</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {DEMO_SPOTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setUseGPS(false);
                setDemoId(s.id);
              }}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                !useGPS && demoId === s.id
                  ? "bg-accent border-accent text-white"
                  : "border-white/15 text-white/70 hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setUseGPS(true)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              useGPS
                ? "bg-accent border-accent text-white"
                : "border-white/15 text-white/70 hover:bg-white/5"
            }`}
          >
            📡 現在地（GPS）
          </button>
        </div>
        {coords && (
          <p className="text-[10px] text-white/40">
            参照位置: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </p>
        )}
      </div>

      {loading && <p className="text-white/50">読み込み中…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <p className="mb-2">今この場所・この時間に届く投稿はありません。</p>
          <p className="text-xs">最初の1人になりますか？</p>
        </div>
      )}

      <ul className="space-y-3">
        {posts.map((p) => (
          <li
            key={p.id}
            className="border border-white/10 rounded-2xl p-4 bg-white/5"
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-medium">{p.nickname}</span>
              <span className="text-xs text-white/40">
                {Math.round(p.distance)}m先 · 〜
                {new Date(p.endsAt).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                まで
              </span>
            </div>
            <p className="whitespace-pre-wrap text-white/90">{p.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
