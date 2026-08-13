// app/page.tsx — トップ検索画面
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GAME_TYPES, type GameType } from "@/lib/dealers";

const NAVY   = "#0E2A45";
const PANEL  = "#163B5E";
const BORDER = "#1E5280";
const MUTED  = "#6FA3C8";
const ICON   = "#1A4A72";
const ACCENT = "#F5A623";

const AREAS = ["エリアを選択","大阪市内","神戸市内","京都市内","堺市","尼崎市","西宮市","奈良市","和歌山市","指定なし"];

export default function TopPage() {
  const router = useRouter();
  const [area, setArea]         = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [location, setLocation] = useState("");
  const [games, setGames]       = useState<GameType[]>([]);
  const [keyword, setKeyword]   = useState("");

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

  const rowStyle: React.CSSProperties = {
    borderBottom: `0.5px solid #1A4A72`,
    padding: "12px 14px",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, color: MUTED, marginBottom: 4,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", background: "transparent", border: "none",
    outline: "none", fontSize: 14, color: "#fff",
  };

  return (
    <main style={{ minHeight: "100dvh", background: NAVY, paddingBottom: 40, maxWidth: 480, margin: "0 auto" }}>

      {/* ヘッダー */}
      <header style={{ padding: "18px 16px 10px" }}>
        <div style={{ fontSize: 24, fontWeight: 500, color: "#fff", letterSpacing: -0.5 }}>GODILLA</div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>ポーカーディーラー予約</div>
      </header>

      {/* バナー */}
      <div style={{
        margin: "0 12px 16px", borderRadius: 12, background: "#1A4A72",
        padding: "14px 16px", border: `0.5px solid ${BORDER}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: ACCENT,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18,
        }}>🃏</div>
        <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.5 }}>
          <span style={{ color: ACCENT, fontWeight: 500 }}>40名のディーラー</span>が在籍中。今すぐ予約できます。
        </div>
      </div>

      {/* 検索フォーム */}
      <div style={{ margin: "0 12px", background: PANEL, borderRadius: 16, border: `0.5px solid ${BORDER}`, overflow: "hidden" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#A8C8E0", padding: "14px 14px 4px" }}>
          条件を指定して検索
        </div>

        {/* エリア */}
        <div style={rowStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ICON, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>📍</div>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>エリア</div>
              <select value={area} onChange={(e) => setArea(e.target.value)}
                style={{ ...inputStyle, color: area ? "#fff" : "#4A7A9B" }}>
                {AREAS.map((a) => <option key={a} value={a === "エリアを選択" ? "" : a} style={{ background: PANEL }}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* 日時 */}
        <div style={rowStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ICON, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>📅</div>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>日時</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark", width: "auto", flex: 1 }} />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark", width: "auto", flex: 1 }} />
              </div>
            </div>
          </div>
        </div>

        {/* 場所 */}
        <div style={rowStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ICON, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>🏠</div>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>場所（住所・施設名）</div>
              <input type="text" placeholder="例: 大阪市北区梅田〇〇" value={location}
                onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* ゲーム種別（チェックボックス） */}
        <div style={rowStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ICON, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15, marginTop: 2 }}>🃏</div>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>ゲーム種別</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                {GAME_TYPES.map((g) => (
                  <label key={g} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={games.includes(g)}
                      onChange={() => toggleGame(g)}
                      style={{ width: 16, height: 16, accentColor: ACCENT }}
                    />
                    <span style={{ fontSize: 13, color: games.includes(g) ? ACCENT : "#A8C8E0", fontWeight: games.includes(g) ? 500 : 400 }}>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* フリーワード */}
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: ICON, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>🔍</div>
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>フリーワード</div>
              <input type="text" placeholder="名前・特徴など" value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={inputStyle} />
            </div>
          </div>
        </div>

        {/* 検索ボタン */}
        <button onClick={handleSearch} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          margin: "14px", width: "calc(100% - 28px)",
          padding: "13px", background: ACCENT, color: NAVY,
          borderRadius: 10, fontSize: 15, fontWeight: 500,
          border: "none", cursor: "pointer",
        }}>
          🔍 ディーラーを検索
        </button>
      </div>

      {/* 今すぐボタン */}
      <button onClick={() => router.push("/dealers")} style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "16px", fontSize: 14, color: ACCENT,
        background: "none", border: "none", cursor: "pointer", width: "100%",
      }}>
        ⚡ 今すぐ呼べるディーラーはこちら
      </button>
    </main>
  );
}
