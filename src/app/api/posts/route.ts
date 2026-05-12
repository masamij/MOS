import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { distanceMeters } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    nickname,
    body: text,
    lat,
    lng,
    radiusM,
    startsAt,
    endsAt,
  } = body ?? {};

  if (
    typeof nickname !== "string" ||
    typeof text !== "string" ||
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    typeof startsAt !== "string" ||
    typeof endsAt !== "string"
  ) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }

  const trimmedNick = nickname.trim().slice(0, 24);
  const trimmedBody = text.trim().slice(0, 280);
  if (!trimmedNick || !trimmedBody) {
    return NextResponse.json({ error: "empty content" }, { status: 400 });
  }

  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: "invalid time range" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      nickname: trimmedNick,
      body: trimmedBody,
      lat,
      lng,
      radiusM: Math.max(20, Math.min(5000, Number(radiusM) || 100)),
      startsAt: start,
      endsAt: end,
    },
  });

  return NextResponse.json({ post });
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
  }

  const now = new Date();
  const candidates = await prisma.post.findMany({
    where: { startsAt: { lte: now }, endsAt: { gte: now } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const visible = candidates
    .map((p) => ({
      ...p,
      distance: distanceMeters(lat, lng, p.lat, p.lng),
    }))
    .filter((p) => p.distance <= p.radiusM);

  return NextResponse.json({ posts: visible });
}
