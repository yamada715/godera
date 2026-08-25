"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, GAME_TYPES, AREAS, type GameType, type DealerRow } from "@/lib/supabase";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

export default function DealerProfilePage() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [dealer, setDealer]         = useState<DealerRow | null>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  // 編集フィールド
  const [name, setName]     = useState("");
  const [exp, setExp]       = useState("");
  const [games, setGames]   = useState<GameType[]>([]);
  const [areas, setAreas]   = useState<string[]>([]);
  const [venue, setVenue]   = useState("");
  const [rate, setRate]     = useState("");
  const [bio, setBio]       = useState("");
  const [tags, setTags]     = useState<string[]>([]);
  const [photo, setPhoto]   = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const dealerId = localStorage.getItem("dealer_id");
    if (!dealerId) { router.push("/dealer/login"); return; }

    async function load() {
      const [{ data: d }, { data: t }] = await Promise.all([
        supabase.from("dealer_applications").select("*").eq("id", dealerId).single(),
        supabase.from("tags").select("name").order("name"),
      ]);
      if (!d) { router.push("/dealer/login"); return; }
      setDealer(d);
      setName(d.name || "");
      setExp(String(d.experience_years || ""));
      setGames((d.game_types as GameType[]) || []);
      setAreas(d.areas || []);
      setVenue(d.venue_type || "");
      setRate(String(d.hourly_rate || ""));
      setBio(d.bio || "");
      setTags(d.tags || []);
      setTagOptions((t || []).map((x: { name: string }) => x.name));
      setLoading(false);
    }
    load();
  }, [router]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("5MB以下の画像を選択してください"); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function toggleGame(g: GameType) { setGames((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]); }
  function toggleArea(a: string)   { setAreas((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]); }
  function toggleTag(t: string)    { setTags((prev)  => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]); }

  async function handleSave() {
    if (!dealer) return;
    setSaving(true);

    let photo_url = dealer.photo_url;
    if (photo) {
      const ext = photo.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, photo, { contentType: photo.type });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }
    }

    await supabase.from("dealer_applications").update({
      name, experience_years: parseInt(exp),
      game_types: games, areas, venue_type: venue,
      hourly_rate: parseInt(rate), bio, tags, photo_url,
    }).eq("id", dealer.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogout() {
    localStorage.removeItem("dealer_id");
    localStorage.removeItem("dealer_name");
    router.push("/dealer/login");
  }

  if (loading) return <div style={{ padding: 32, textAlign: "center", color: GRAY3 }}>読み込み中...</div>;
  if (!dealer) return null;

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 2, border: "0.5px solid #E8E8E8", background: "#fff", color: BLACK, outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 10, color: GRAY3, marginBottom: 6, display: "block", letterSpacing: 1, textTransform: "uppercase" };
  const sectionStyle: React.CSSProperties = { background: "#fff", border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "16px", marginBottom: 12 };
  const toggleBtn = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", fontSize: 12, borderRadius: 2, cursor: "pointer",
    border: "0.5px solid", background: active ? BLACK : "transparent",
    color: active ? "#fff" : "#666", borderColor: active ? BLACK : "#E8E8E8", letterSpacing: 1,
  });

  return (
    <main style={{ minHeight: "100dvh", background: "#F8F8F8", paddingBottom: 40 }}>
      <header style={{ background: BLACK, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 300, color: WHITE, letterSpacing: 3, textTransform: "uppercase" }}>GODILLA</div>
          <div style={{ fontSize: 10, color: GRAY3, marginTop: 2, letterSpacing: 2 }}>マイページ</div>
        </div>
        <button onClick={handleLogout} style={{ fontSize: 11, color: GRAY3, background: "none", border: "0.5px solid #333", borderRadius: 2, padding: "5px 10px", cursor: "pointer" }}>
          ログアウト
        </button>
      </header>

      <div style={{ padding: "16px" }}>

        {/* ステータス */}
        <div style={{ background: dealer.is_active ? "#F0F8F0" : "#FFF8F0", border: `0.5px solid ${dealer.is_active ? "#C0DD97" : "#F5CC8A"}`, borderRadius: 2, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: dealer.is_active ? "#3B6D11" : "#854F0B" }}>
          {dealer.is_active ? "✓ 現在ディーラー一覧に表示されています" : "⏸ 現在非表示になっています（管理者にお問い合わせください）"}
        </div>

        {/* 写真 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>プロフィール写真</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div onClick={() => fileRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 2, background: "#F0F0F0", border: "0.5px solid #E8E8E8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : dealer.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dealer.photo_url} alt={dealer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="7" fill="#CCCCCC" /><ellipse cx="16" cy="26" rx="11" ry="7" fill="#CCCCCC" /></svg>
              )}
            </div>
            <div>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "8px 16px", background: BLACK, color: "#fff", border: "none", borderRadius: 2, fontSize: 12, cursor: "pointer", display: "block", marginBottom: 6 }}>写真を変更</button>
              <p style={{ fontSize: 11, color: GRAY3 }}>JPG・PNG・5MB以下</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
        </div>

        {/* 基本情報 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>基本情報</div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>氏名</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>経験年数</label>
            <input type="number" min="0" max="30" value={exp} onChange={(e) => setExp(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>時給（円）</label>
            <input type="number" min="1000" step="500" value={rate} onChange={(e) => setRate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>対応種別</label>
            <select value={venue} onChange={(e) => setVenue(e.target.value)} style={inputStyle}>
              <option value="home">個人宅</option>
              <option value="amusement">アミューズメント施設</option>
              <option value="both">両方対応</option>
            </select>
          </div>
        </div>

        {/* ゲーム */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>対応ゲーム</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GAME_TYPES.map((g) => <button key={g} onClick={() => toggleGame(g)} style={toggleBtn(games.includes(g))}>{g}</button>)}
          </div>
        </div>

        {/* エリア */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>対応エリア</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {AREAS.map((a) => <button key={a} onClick={() => toggleArea(a)} style={toggleBtn(areas.includes(a))}>{a}</button>)}
          </div>
        </div>

        {/* タグ */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>特徴タグ</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tagOptions.map((t) => <button key={t} onClick={() => toggleTag(t)} style={toggleBtn(tags.includes(t))}>{t}</button>)}
          </div>
        </div>

        {/* 自己紹介 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>自己紹介</div>
          <textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} style={{ ...inputStyle, resize: "none" }} />
        </div>

        {/* 保存ボタン */}
        {saved && (
          <div style={{ background: "#F0F8F0", border: "0.5px solid #C0DD97", borderRadius: 2, padding: "12px", marginBottom: 10, textAlign: "center", fontSize: 13, color: "#3B6D11" }}>
            ✓ 保存しました
          </div>
        )}
        <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: 15, background: saving ? "#999" : BLACK, color: "#fff", border: "none", borderRadius: 2, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", letterSpacing: 1, marginBottom: 10 }}>
          {saving ? "保存中..." : "変更を保存する"}
        </button>
        <Link href="/" style={{ display: "block", padding: 12, background: "transparent", color: GRAY3, border: "0.5px solid #E8E8E8", borderRadius: 2, fontSize: 12, textAlign: "center", textDecoration: "none", letterSpacing: 1 }}>
          トップに戻る
        </Link>
      </div>
    </main>
  );
}
