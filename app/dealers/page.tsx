// app/dealers/page.tsx — ディーラー一覧（2列・縦スクロール）
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { DEALERS, VENUE_LABEL, VENUE_STYLE, GAME_TYPES, type VenueType, type GameType } from "@/lib/dealers";
import { DealerCard } from "@/components/DealerCard";
import { useState } from "react";

function DealerListInner() {
  const searchParams = useSearchParams();
  const initGames = (searchParams.get("games") || "").split(",").filter(Boolean) as GameType[];
  const initVenue = (searchParams.get("venue") || "all") as VenueType | "all";
  const initQ     = searchParams.get("q") || "";

  const [keyword, setKeyword]     = useState(initQ);
  const [venueFilter, setVenueFilter] = useState<VenueType | "all">(initVenue);
  const [gameFilter, setGameFilter]   = useState<GameType[]>(initGames);

  function toggleGame(g: GameType) {
    setGameFilter((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  const filtered = DEALERS.filter((d) => {
    if (!d.isActive) return false;
    if (venueFilter !== "all" && d.venueType !== venueFilter && d.venueType !== "both") return false;
    if (gameFilter.length > 0 && !gameFilter.some((g) => d.gameTypes.includes(g))) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      const hit =
        d.name.toLowerCase().includes(kw) ||
        d.gameTypes.some((g) => g.toLowerCase().includes(kw)) ||
        d.areas.some((a) => a.includes(kw)) ||
        d.tags.some((t) => t.includes(kw));
      if (!hit) return false;
    }
    return true;
  });

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 32 }}>

      {/* ヘッダー */}
      <header style={{
        background: "#FFFFFF", borderBottom: "0.5px solid #D3D1C7",
        padding: "12px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8,
          background: "#0E2A45", color: "#fff", textDecoration: "none", fontSize: 16,
        }} aria-label="トップに戻る">‹</Link>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#2C2C2A" }}>ディーラーを選ぶ</div>
          <div style={{ fontSize: 11, color: "#888780" }}>{filtered.length}名表示中</div>
        </div>
        <div style={{ width: 32 }} />
      </header>

      {/* フィルターエリア */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #D3D1C7", padding: "10px 12px" }}>

        {/* フリーワード */}
        <input type="text" placeholder="名前・エリアで検索..." value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px", fontSize: 13,
            borderRadius: 8, border: "0.5px solid #D3D1C7",
            background: "#F9F9F7", color: "#2C2C2A", outline: "none", marginBottom: 8,
          }} />

        {/* 種別フィルター */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {(["all", "home", "amusement"] as const).map((v) => (
            <button key={v} onClick={() => setVenueFilter(v)} style={{
              fontSize: 12, padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              border: "0.5px solid",
              background: venueFilter === v ? "#0E2A45" : "transparent",
              color: venueFilter === v ? "#fff" : "#5F5E5A",
              borderColor: venueFilter === v ? "#0E2A45" : "#D3D1C7",
              fontWeight: venueFilter === v ? 500 : 400,
            }}>
              {{ all: "すべて", home: "個人宅", amusement: "アミューズ" }[v]}
            </button>
          ))}
        </div>

        {/* ゲームフィルター */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {GAME_TYPES.map((g) => (
            <button key={g} onClick={() => toggleGame(g)} style={{
              fontSize: 12, padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              border: "0.5px solid",
              background: gameFilter.includes(g) ? "#F5A623" : "transparent",
              color: gameFilter.includes(g) ? "#0E2A45" : "#5F5E5A",
              borderColor: gameFilter.includes(g) ? "#F5A623" : "#D3D1C7",
              fontWeight: gameFilter.includes(g) ? 500 : 400,
            }}>{g}</button>
          ))}
        </div>
      </div>

      {/* 2列グリッド（縦スクロール） */}
      {filtered.length > 0 ? (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 10, padding: "10px 12px 0",
        }}>
          {filtered.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", fontSize: 14, color: "#888780" }}>
          該当するディーラーが見つかりませんでした
        </div>
      )}
    </main>
  );
}

export default function DealersPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center", color: "#888780" }}>読み込み中...</div>}>
      <DealerListInner />
    </Suspense>
  );
}
