"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { DEALERS, GAME_TYPES, type VenueType, type GameType } from "@/lib/dealers";
import { DealerCard } from "@/components/DealerCard";
import { useState } from "react";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY1 = "#F5F5F5";
const GRAY2 = "#E8E8E8";
const GRAY3 = "#999999";

function DealerListInner() {
  const searchParams = useSearchParams();
  const initGames = (searchParams.get("games") || "").split(",").filter(Boolean) as GameType[];
  const initQ     = searchParams.get("q") || "";

  const [keyword, setKeyword]       = useState(initQ);
  const [venueFilter, setVenueFilter] = useState<VenueType | "all">("all");
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
    <main style={{ minHeight: "100dvh", background: "#F8F8F8", paddingBottom: 32 }}>

      {/* ヘッダー */}
      <header style={{
        background: BLACK,
        padding: "12px 16px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 2,
          background: "#1A1A1A", color: WHITE, textDecoration: "none", fontSize: 16,
          border: "0.5px solid #333",
        }} aria-label="トップに戻る">‹</Link>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 400, color: WHITE, letterSpacing: 3, textTransform: "uppercase" }}>Dealers</div>
          <div style={{ fontSize: 10, color: "#666" }}>{filtered.length}名</div>
        </div>
        <div style={{ width: 32 }} />
      </header>

      {/* フィルター */}
      <div style={{ background: WHITE, borderBottom: "0.5px solid #E8E8E8", padding: "10px 12px" }}>
        <input type="text" placeholder="名前・エリアで検索..." value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px", fontSize: 13,
            borderRadius: 2, border: "0.5px solid #E8E8E8",
            background: "#F5F5F5", color: BLACK, outline: "none", marginBottom: 8,
          }} />

        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {(["all", "home", "amusement"] as const).map((v) => (
            <button key={v} onClick={() => setVenueFilter(v)} style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 2, cursor: "pointer",
              border: "0.5px solid",
              background: venueFilter === v ? BLACK : "transparent",
              color: venueFilter === v ? WHITE : "#666",
              borderColor: venueFilter === v ? BLACK : "#E8E8E8",
              letterSpacing: 1,
            }}>
              {{ all: "ALL", home: "HOME", amusement: "AMUSE" }[v]}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {GAME_TYPES.map((g) => (
            <button key={g} onClick={() => toggleGame(g)} style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 2, cursor: "pointer",
              border: "0.5px solid",
              background: gameFilter.includes(g) ? BLACK : "transparent",
              color: gameFilter.includes(g) ? WHITE : "#666",
              borderColor: gameFilter.includes(g) ? BLACK : "#E8E8E8",
              letterSpacing: 1,
            }}>{g}</button>
          ))}
        </div>
      </div>

      {/* グリッド */}
      {filtered.length > 0 ? (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 8, padding: "10px 10px 0",
        }}>
          {filtered.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", fontSize: 13, color: GRAY3, letterSpacing: 1 }}>
          該当するディーラーが見つかりませんでした
        </div>
      )}
    </main>
  );
}

export default function DealersPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center", color: "#999" }}>読み込み中...</div>}>
      <DealerListInner />
    </Suspense>
  );
}
