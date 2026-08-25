"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, VENUE_LABEL, GAME_TYPES, type DealerRow, type VenueType, type GameType } from "@/lib/supabase";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

function DealerCard({ dealer }: { dealer: DealerRow }) {
  return (
    <Link
      href={`/dealers/${dealer.id}`}
      style={{
        textDecoration: "none", display: "flex", flexDirection: "row",
        background: WHITE, border: "0.5px solid #E8E8E8",
        borderRadius: 2, overflow: "hidden", cursor: "pointer",
      }}
    >
      <div style={{
        width: 72, flexShrink: 0, background: "#F0F0F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", borderRight: "0.5px solid #E8E8E8",
        minHeight: 110,
      }}>
        {dealer.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dealer.photo_url} alt={dealer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="12" r="7" fill="#CCCCCC" />
            <ellipse cx="16" cy="26" rx="11" ry="7" fill="#CCCCCC" />
          </svg>
        )}
      </div>
      <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: BLACK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {dealer.name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 400, color: BLACK }}>
          ¥{dealer.hourly_rate.toLocaleString()}<span style={{ fontSize: 10, color: GRAY3 }}> / h</span>
        </div>
        <span style={{ display: "inline-block", fontSize: 9, padding: "1px 6px", borderRadius: 1, background: "#F5F5F5", color: "#333", alignSelf: "flex-start", letterSpacing: 1, textTransform: "uppercase" }}>
          {VENUE_LABEL[dealer.venue_type]}
        </span>
        <div style={{ fontSize: 11, color: GRAY3 }}>{dealer.experience_years}年経験</div>
        <div style={{ fontSize: 11, color: GRAY3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {dealer.game_types.join(" · ")}
        </div>
        <div style={{ fontSize: 11, color: GRAY3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {dealer.areas[0]}{dealer.areas.length > 1 ? "ほか" : ""}
        </div>
      </div>
    </Link>
  );
}

function DealerListInner() {
  const searchParams  = useSearchParams();
  const initGames     = (searchParams.get("games") || "").split(",").filter(Boolean) as GameType[];
  const initQ         = searchParams.get("q") || "";

  const [dealers, setDealers]       = useState<DealerRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [keyword, setKeyword]       = useState(initQ);
  const [venueFilter, setVenueFilter] = useState<VenueType | "all">("all");
  const [gameFilter, setGameFilter]   = useState<GameType[]>(initGames);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("dealer_applications")
        .select("*")
        .eq("status", "approved")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setDealers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  function toggleGame(g: GameType) {
    setGameFilter((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  const filtered = dealers.filter((d) => {
    if (venueFilter !== "all" && d.venue_type !== venueFilter && d.venue_type !== "both") return false;
    if (gameFilter.length > 0 && !gameFilter.some((g) => d.game_types.includes(g))) return false;
    if (keyword) {
      const kw = keyword.toLowerCase();
      const hit =
        d.name.toLowerCase().includes(kw) ||
        d.game_types.some((g) => g.toLowerCase().includes(kw)) ||
        d.areas.some((a) => a.includes(kw)) ||
        d.tags.some((t) => t.includes(kw));
      if (!hit) return false;
    }
    return true;
  });

  return (
    <main style={{ minHeight: "100dvh", background: "#F8F8F8", paddingBottom: 32 }}>
      <header style={{ background: BLACK, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 2, background: "#1A1A1A", color: WHITE, textDecoration: "none", fontSize: 16, border: "0.5px solid #333" }}>‹</Link>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 400, color: WHITE, letterSpacing: 3, textTransform: "uppercase" }}>Dealers</div>
          <div style={{ fontSize: 10, color: "#666" }}>{loading ? "..." : `${filtered.length}名`}</div>
        </div>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ background: WHITE, borderBottom: "0.5px solid #E8E8E8", padding: "10px 12px" }}>
        <input type="text" placeholder="名前・エリアで検索..." value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: 2, border: "0.5px solid #E8E8E8", background: "#F5F5F5", color: BLACK, outline: "none", marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {(["all", "home", "amusement"] as const).map((v) => (
            <button key={v} onClick={() => setVenueFilter(v)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 2, cursor: "pointer", border: "0.5px solid", background: venueFilter === v ? BLACK : "transparent", color: venueFilter === v ? WHITE : "#666", borderColor: venueFilter === v ? BLACK : "#E8E8E8", letterSpacing: 1 }}>
              {{ all: "ALL", home: "HOME", amusement: "AMUSE" }[v]}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {GAME_TYPES.map((g) => (
            <button key={g} onClick={() => toggleGame(g)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 2, cursor: "pointer", border: "0.5px solid", background: gameFilter.includes(g) ? BLACK : "transparent", color: gameFilter.includes(g) ? WHITE : "#666", borderColor: gameFilter.includes(g) ? BLACK : "#E8E8E8", letterSpacing: 1 }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", fontSize: 13, color: GRAY3 }}>読み込み中...</div>
      ) : filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 10px 0" }}>
          {filtered.map((dealer) => <DealerCard key={dealer.id} dealer={dealer} />)}
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
