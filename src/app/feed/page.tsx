"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("このブラウザは位置情報に対応していません");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        setError("位置情報の取得に失敗しました: " + err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

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

      {coords && (
        <p className="text-xs text-white/40 mb-6">
          現在地: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </p>
      )}

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
