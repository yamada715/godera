"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase, GAME_TYPES, AREAS, type GameType } from "@/lib/supabase";

export default function ApplyPage() {
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [exp, setExp]               = useState("");
  const [games, setGames]           = useState<GameType[]>([]);
  const [areas, setAreas]           = useState<string[]>([]);
  const [venue, setVenue]           = useState("");
  const [rate, setRate]             = useState("");
  const [bio, setBio]               = useState("");
  const [tags, setTags]             = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [photo, setPhoto]           = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadTags() {
      const { data } = await supabase.from("tags").select("name").order("name");
      setTagOptions((data || []).map((t: { name: string }) => t.name));
    }
    loadTags();
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors((p) => ({ ...p, photo: "5MB以下の画像を選択してください" })); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors((p) => ({ ...p, photo: "" }));
  }

  function toggleGame(g: GameType) { setGames((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]); }
  function toggleArea(a: string)   { setAreas((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]); }
  function toggleTag(t: string)    { setTags((prev)  => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]); }

  function validate() {
    const e: Record<string, string> = {};
    if (!name)              e.name     = "名前を入力してください";
    if (!email)             e.email    = "メールアドレスを入力してください";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "正しいメールアドレスを入力してください";
    if (!password)          e.password = "パスワードを入力してください";
    if (password.length < 6) e.password = "パスワードは6文字以上にしてください";
    if (!exp)               e.exp      = "経験年数を入力してください";
    if (games.length === 0) e.games    = "ゲーム種別を選択してください";
    if (areas.length === 0) e.areas    = "対応エリアを選択してください";
    if (!venue)             e.venue    = "対応種別を選択してください";
    if (!rate)              e.rate     = "時給を入力してください";
    if (!bio)               e.bio      = "自己紹介を入力してください";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);

    // メールアドレスの重複チェック
    const { data: existing } = await supabase
      .from("dealer_applications")
      .select("id")
      .eq("email", email)
      .single();
    if (existing) {
      setErrors((p) => ({ ...p, email: "このメールアドレスはすでに登録されています" }));
      setLoading(false);
      return;
    }

    // 写真アップロード
    let photo_url: string | null = null;
    if (photo) {
      const ext = photo.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, photo, { contentType: photo.type });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from("dealer_applications").insert({
      name, email, password_hash: password,
      experience_years: parseInt(exp),
      game_types: games, areas, venue_type: venue,
      hourly_rate: parseInt(rate), bio, tags,
      photo_url, status: "pending", is_active: true, photo_visible: true,
    });
    setLoading(false);
    if (error) { alert("送信に失敗しました。もう一度お試しください。"); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main style={{ minHeight: "100dvh", background: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ textAlign: "center", maxWidth: 280 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>✓</div>
          <h2 style={{ fontSize: 18, fontWeight: 400, color: "#0A0A0A", marginBottom: 8 }}>申請を受け付けました</h2>
          <p style={{ fontSize: 14, color: "#999", lineHeight: 1.7, marginBottom: 8 }}>管理者が確認後、掲載されます。</p>
          <p style={{ fontSize: 13, color: "#999", lineHeight: 1.7, marginBottom: 28 }}>承認後は登録したメールアドレスとパスワードでログインしてプロフィールを編集できます。</p>
          <Link href="/" style={{ display: "block", padding: 14, background: "#0A0A0A", color: "#fff", borderRadius: 2, fontSize: 12, textAlign: "center", textDecoration: "none", letterSpacing: 2 }}>
            トップに戻る
          </Link>
        </div>
      </main>
    );
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 2, border: "0.5px solid #E8E8E8", background: "#fff", color: "#0A0A0A", outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: "#999", marginBottom: 6, display: "block", letterSpacing: 1, textTransform: "uppercase" };
  const errStyle:   React.CSSProperties = { fontSize: 11, color: "#E24B4A", marginTop: 3 };
  const sectionStyle: React.CSSProperties = { background: "#fff", border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "16px", marginBottom: 12 };
  const toggleBtn = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", fontSize: 12, borderRadius: 2, cursor: "pointer",
    border: "0.5px solid", background: active ? "#0A0A0A" : "transparent",
    color: active ? "#fff" : "#666", borderColor: active ? "#0A0A0A" : "#E8E8E8", letterSpacing: 1,
  });

  return (
    <main style={{ minHeight: "100dvh", background: "#F8F8F8", paddingBottom: 40 }}>
      <header style={{ background: "#0A0A0A", padding: "16px" }}>
        <div style={{ fontSize: 16, fontWeight: 300, color: "#fff", letterSpacing: 4, textTransform: "uppercase" }}>GODILLA</div>
        <div style={{ fontSize: 10, color: "#666", marginTop: 3, letterSpacing: 3 }}>ディーラー登録申請</div>
      </header>

      <div style={{ padding: "16px" }}>

        {/* 写真 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>プロフィール写真（任意）</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div onClick={() => fileRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 2, background: photoPreview ? "transparent" : "#F0F0F0", border: "0.5px solid #E8E8E8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="7" fill="#CCCCCC" /><ellipse cx="16" cy="26" rx="11" ry="7" fill="#CCCCCC" /></svg>
              )}
            </div>
            <div>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "8px 16px", background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 2, fontSize: 12, cursor: "pointer", display: "block", marginBottom: 6 }}>写真を選ぶ</button>
              <p style={{ fontSize: 11, color: "#999" }}>JPG・PNG・5MB以下</p>
              {photo && <p style={{ fontSize: 11, color: "#0A0A0A", marginTop: 4 }}>✓ {photo.name}</p>}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
          {errors.photo && <p style={errStyle}>{errors.photo}</p>}
        </div>

        {/* アカウント情報 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>アカウント情報</div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>メールアドレス <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="email" placeholder="example@gmail.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }} style={inputStyle} />
            <p style={{ fontSize: 11, color: "#999", marginTop: 3 }}>承認後のログインに使用します</p>
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>
          <div>
            <label style={labelStyle}>パスワード <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="password" placeholder="6文字以上" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }} style={inputStyle} />
            {errors.password && <p style={errStyle}>{errors.password}</p>}
          </div>
        </div>

        {/* 基本情報 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>基本情報</div>
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
          <div>
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

        {/* ゲーム */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>対応ゲーム <span style={{ color: "#E24B4A" }}>*</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GAME_TYPES.map((g) => <button key={g} onClick={() => { toggleGame(g); setErrors((p) => ({ ...p, games: "" })); }} style={toggleBtn(games.includes(g))}>{g}</button>)}
          </div>
          {errors.games && <p style={errStyle}>{errors.games}</p>}
        </div>

        {/* エリア */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>対応エリア <span style={{ color: "#E24B4A" }}>*</span></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {AREAS.map((a) => <button key={a} onClick={() => { toggleArea(a); setErrors((p) => ({ ...p, areas: "" })); }} style={toggleBtn(areas.includes(a))}>{a}</button>)}
          </div>
          {errors.areas && <p style={errStyle}>{errors.areas}</p>}
        </div>

        {/* タグ */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>特徴タグ（任意）</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {tagOptions.map((t) => <button key={t} onClick={() => toggleTag(t)} style={toggleBtn(tags.includes(t))}>{t}</button>)}
          </div>
        </div>

        {/* 自己紹介 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>プロフィール</div>
          <label style={labelStyle}>自己紹介 <span style={{ color: "#E24B4A" }}>*</span></label>
          <textarea rows={4} placeholder="経験やアピールポイントを入力してください" value={bio} onChange={(e) => { setBio(e.target.value); setErrors((p) => ({ ...p, bio: "" })); }} style={{ ...inputStyle, resize: "none" }} />
          {errors.bio && <p style={errStyle}>{errors.bio}</p>}
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: 15, background: loading ? "#999" : "#0A0A0A", color: "#fff", border: "none", borderRadius: 2, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", letterSpacing: 1 }}>
          {loading ? "送信中..." : "申請を送信する"}
        </button>
      </div>
    </main>
  );
}
