"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, GAME_TYPES, type GameType } from "@/lib/supabase";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

const AREAS = ["エリアを選択","大阪市内","神戸市内","京都市内","堺市","尼崎市","西宮市","奈良市","和歌山市","指定なし"];

export default function TopPage() {
  const router = useRouter();
  const [area, setArea]         = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [location, setLocation] = useState("");
  const [games, setGames]       = useState<GameType[]>([]);
  const [keyword, setKeyword]   = useState("");
  const [dealerCount, setDealerCount] = useState<number | null>(null);

  // リアルタイムディーラー人数取得
  useEffect(() => {
    async function fetchCount() {
      const { count } = await supabase
        .from("dealer_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .eq("is_active", true);
      setDealerCount(count);
    }
    fetchCount();
  }, []);

  function toggleGame(g: GameType) {
    setGames((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (area)    params.set("area", area);
    if (date)    params.set("date", date);
    if (time)    params.set("time", time);
    if (location) params.set("location", location);
    if (games.length) params.set("games", games.join(","));
    if (keyword) params.set("q", keyword);
    router.push(`/dealers?${params.toString()}`);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    outline: "none", fontSize: 14, color: WHITE, fontFamily: "inherit",
  };
  const rowStyle: React.CSSProperties = {
    borderBottom: `0.5px solid #2A2A2A`, padding: "14px 16px",
    display: "flex", alignItems: "flex-start", gap: 12,
  };
  const iconBox: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 6, background: "#1A1A1A",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, fontSize: 15,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, color: GRAY3, marginBottom: 3, letterSpacing: ".08em", textTransform: "uppercase",
  };

  return (
    <main style={{ minHeight: "100dvh", background: BLACK, paddingBottom: 40, maxWidth: 480, margin: "0 auto" }}>

      {/* ヘッダー */}
      <header style={{ padding: "28px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 300, color: WHITE, letterSpacing: 6, textTransform: "uppercase" }}>GODILLA</div>
          <div style={{ fontSize: 11, color: GRAY3, marginTop: 4, letterSpacing: 3 }}>ポーカーディーラー予約</div>
        </div>
        <Link href="/dealer/login" style={{ fontSize: 11, color: GRAY3, textDecoration: "none", letterSpacing: 1, borderBottom: "0.5px solid #333", paddingBottom: 2 }}>
          ディーラーログイン
        </Link>
      </header>

      {/* バナー */}
      <div style={{ margin: "0 16px 20px", borderRadius: 2, background: "#111111", padding: "14px 16px", border: `0.5px solid #2A2A2A`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 20 }}>🃏</div>
        <div style={{ fontSize: 13, color: GRAY3, lineHeight: 1.6 }}>
          <span style={{ color: WHITE, fontWeight: 400 }}>
            {dealerCount === null ? "..." : `${dealerCount}名`}のディーラー
          </span>が在籍中
        </div>
      </div>

      {/* 検索フォーム */}
      <div style={{ margin: "0 16px", background: "#111111", borderRadius: 2, border: `0.5px solid #2A2A2A`, overflow: "hidden" }}>
        <div style={{ fontSize: 10, fontWeight: 400, color: GRAY3, padding: "14px 16px 4px", letterSpacing: ".1em", textTransform: "uppercase" }}>
          条件を指定して検索
        </div>

        <div style={rowStyle}>
          <div style={iconBox}>📍</div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>エリア</div>
            <select value={area} onChange={(e) => setArea(e.target.value)} style={{ ...inputStyle, color: area ? WHITE : GRAY3 }}>
              {AREAS.map((a) => <option key={a} value={a === "エリアを選択" ? "" : a} style={{ background: "#111" }}>{a}</option>)}
            </select>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={iconBox}>📅</div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>日時</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ ...inputStyle, colorScheme: "dark", flex: 1 }} />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ ...inputStyle, colorScheme: "dark", flex: 1 }} />
            </div>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={iconBox}>🏠</div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>場所</div>
            <input type="text" placeholder="住所・施設名" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={iconBox}>🃏</div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>ゲーム種別</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {GAME_TYPES.map((g) => (
                <label key={g} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                  <input type="checkbox" checked={games.includes(g)} onChange={() => toggleGame(g)} style={{ width: 14, height: 14, accentColor: WHITE }} />
                  <span style={{ fontSize: 13, color: games.includes(g) ? WHITE : GRAY3 }}>{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={iconBox}>🔍</div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>フリーワード</div>
            <input type="text" placeholder="名前・特徴など" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} style={inputStyle} />
          </div>
        </div>

        <button onClick={handleSearch} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          margin: "16px", width: "calc(100% - 32px)", padding: "14px",
          background: WHITE, color: BLACK, borderRadius: 2, fontSize: 13, fontWeight: 500,
          border: "none", cursor: "pointer", letterSpacing: 2,
        }}>
          ディーラーを検索
        </button>
      </div>

      {/* ボタン群 */}
      <div style={{ margin: "0 16px", display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        <button onClick={() => router.push("/dealers")} style={{
          padding: "13px", background: "transparent", color: WHITE,
          border: "0.5px solid #2A2A2A", borderRadius: 2, fontSize: 13,
          cursor: "pointer", letterSpacing: 1,
        }}>
          すべてのディーラーを見る
        </button>
        <Link href="/apply" style={{
          display: "block", padding: "13px", background: "transparent",
          color: GRAY3, border: "0.5px solid #1A1A1A", borderRadius: 2,
          fontSize: 12, cursor: "pointer", letterSpacing: 1,
          textAlign: "center", textDecoration: "none",
        }}>
          ディーラー登録申請はこちら
        </Link>
      </div>
    </main>
  );
}
