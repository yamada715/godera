// app/apply/page.tsx — ディーラー登録申請フォーム
"use client";

import { useState } from "react";
import Link from "next/link";
import { GAME_TYPES, type GameType } from "@/lib/dealers";
import { supabase } from "@/lib/supabase";

const AREAS = ["大阪市内", "神戸市内", "京都市内", "堺市", "尼崎市", "西宮市", "奈良市", "和歌山市"];

export default function ApplyPage() {
  const [name, setName]           = useState("");
  const [exp, setExp]             = useState("");
  const [games, setGames]         = useState<GameType[]>([]);
  const [areas, setAreas]         = useState<string[]>([]);
  const [venue, setVenue]         = useState("");
  const [rate, setRate]           = useState("");
  const [bio, setBio]             = useState("");
  const [tags, setTags]           = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  function toggleGame(g: GameType) {
    setGames((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  function toggleArea(a: string) {
    setAreas((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name)              e.name  = "名前を入力してください";
    if (!exp)               e.exp   = "経験年数を入力してください";
    if (games.length === 0) e.games = "ゲーム種別を選択してください";
    if (areas.length === 0) e.areas = "対応エリアを選択してください";
    if (!venue)             e.venue = "対応種別を選択してください";
    if (!rate)              e.rate  = "時給を入力してください";
    if (!bio)               e.bio   = "自己紹介を入力してください";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    const { error } = await supabase.from("dealer_applications").insert({
      name,
      experience_years: parseInt(exp),
      game_types: games,
      areas,
      venue_type: venue,
      hourly_rate: parseInt(rate),
      bio,
      tags: tags.split(/\s+/).filter(Boolean),
      status: "pending",
    });
    setLoading(false);
    if (error) { alert("送信に失敗しました。もう一度お試しください。"); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main style={{ minHeight: "100dvh", background: "#F1EFE8", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ textAlign: "center", maxWidth: 280 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EAF3DE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, color: "#3B6D11" }}>✓</div>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#2C2C2A", marginBottom: 8 }}>申請を受け付けました</h2>
          <p style={{ fontSize: 14, color: "#5F5E5A", lineHeight: 1.7, marginBottom: 28 }}>管理者が確認後、掲載されます。しばらくお待ちください。</p>
          <Link href="/" style={{ display: "block", padding: 14, background: "#0E2A45", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 500, textAlign: "center", textDecoration: "none" }}>
            トップに戻る
          </Link>
        </div>
      </main>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", fontSize: 14,
    borderRadius: 8, border: "0.5px solid #D3D1C7",
    background: "#fff", color: "#2C2C2A", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: "#5F5E5A", fontWeight: 500, marginBottom: 5, display: "block",
  };
  const errStyle: React.CSSProperties = { fontSize: 11, color: "#E24B4A", marginTop: 3 };

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 40 }}>
      <header style={{ background: "#0E2A45", padding: "14px 16px" }}>
        <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>GODILLA</div>
        <div style={{ fontSize: 11, color: "#6FA3C8", marginTop: 2 }}>ディーラー登録申請</div>
      </header>

      <div style={{ padding: "16px" }}>
        <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 14 }}>基本情報</div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>氏名 <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="text" placeholder="山田 太郎" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }} style={inputStyle} />
            {errors.name && <p style={errStyle}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>経験年数 <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="number" placeholder="3" min="0" max="30" value={exp} onChange={(e) => { setExp(e.target.value); setErrors((p) => ({ ...p, exp: "" })); }} style={inputStyle} />
            {errors.exp && <p style={errStyle}>{errors.exp}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>時給（円） <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="number" placeholder="4000" min="1000" step="500" value={rate} onChange={(e) => { setRate(e.target.value); setErrors((p) => ({ ...p, rate: "" })); }} style={inputStyle} />
            {errors.rate && <p style={errStyle}>{errors.rate}</p>}
          </div>

          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>対応種別 <span style={{ color: "#E24B4A" }}>*</span></label>
            <select value={venue} onChange={(e) => { setVenue(e.target.value); setErrors((p) => ({ ...p, venue: "" })); }} style={inputStyle}>
              <option value="">選択してください</option>
              <option value="home">個人宅</option>
              <option value="amusement">アミューズメント施設</option>
              <option value="both">両方対応</option>
            </select>
            {errors.venue && <p style={errStyle}>{errors.venue}</p>}
          </div>
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 10 }}>対応ゲーム <span style={{ color: "#E24B4A" }}>*</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {GAME_TYPES.map((g) => (
              <label key={g} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <input type="checkbox" checked={games.includes(g)} onChange={() => { toggleGame(g); setErrors((p) => ({ ...p, games: "" })); }} style={{ width: 16, height: 16, accentColor: "#0E2A45" }} />
                <span style={{ fontSize: 13, color: games.includes(g) ? "#0E2A45" : "#5F5E5A", fontWeight: games.includes(g) ? 500 : 400 }}>{g}</span>
              </label>
            ))}
          </div>
          {errors.games && <p style={errStyle}>{errors.games}</p>}
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 10 }}>対応エリア <span style={{ color: "#E24B4A" }}>*</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {AREAS.map((a) => (
              <label key={a} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                <input type="checkbox" checked={areas.includes(a)} onChange={() => { toggleArea(a); setErrors((p) => ({ ...p, areas: "" })); }} style={{ width: 16, height: 16, accentColor: "#0E2A45" }} />
                <span style={{ fontSize: 13, color: areas.includes(a) ? "#0E2A45" : "#5F5E5A", fontWeight: areas.includes(a) ? 500 : 400 }}>{a}</span>
              </label>
            ))}
          </div>
          {errors.areas && <p style={errStyle}>{errors.areas}</p>}
        </div>

        <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 14 }}>プロフィール</div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>自己紹介 <span style={{ color: "#E24B4A" }}>*</span></label>
            <textarea rows={4} placeholder="経験やアピールポイントを入力してください" value={bio} onChange={(e) => { setBio(e.target.value); setErrors((p) => ({ ...p, bio: "" })); }} style={{ ...inputStyle, resize: "none" }} />
            {errors.bio && <p style={errStyle}>{errors.bio}</p>}
          </div>
          <div>
            <label style={labelStyle}>タグ（任意・スペース区切り）</label>
            <input type="text" placeholder="例: 個人宅歓迎 英語可 深夜対応" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: 15, background: loading ? "#888780" : "#0E2A45", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "送信中..." : "申請を送信する"}
        </button>
      </div>
    </main>
  );
}
