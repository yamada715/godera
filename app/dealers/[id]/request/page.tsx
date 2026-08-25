"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase, type DealerRow } from "@/lib/supabase";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

export default function RequestPage() {
  const params = useParams();
  const [dealer, setDealer]       = useState<DealerRow | null>(null);
  const [loading, setLoading]     = useState(true);
  const [date, setDate]           = useState("");
  const [startTime, setStart]     = useState("");
  const [endTime, setEnd]         = useState("");
  const [location, setLocation]   = useState("");
  const [email, setEmail]         = useState("");
  const [note, setNote]           = useState("");
  const [hours, setHours]         = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("dealer_applications").select("*").eq("id", params.id).eq("status", "approved").single();
      setDealer(data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  useEffect(() => {
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60;
      setHours(Math.round(diff / 60 * 10) / 10);
    } else {
      setHours(0);
    }
  }, [startTime, endTime]);

  if (loading) return <div style={{ padding: 32, textAlign: "center", color: GRAY3 }}>読み込み中...</div>;
  if (!dealer)  return <div style={{ padding: 32, textAlign: "center", color: GRAY3 }}>ディーラーが見つかりません</div>;

  const totalFee = Math.round(dealer.hourly_rate * hours);

  function validate() {
    const e: Record<string, string> = {};
    if (!date)      e.date      = "日付を入力してください";
    if (!startTime) e.startTime = "開始時間を入力してください";
    if (!endTime)   e.endTime   = "終了時間を入力してください";
    if (hours <= 0) e.endTime   = "終了時間は開始時間より後にしてください";
    if (!location)  e.location  = "場所を入力してください";
    if (!email)     e.email     = "メールアドレスを入力してください";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "正しいメールアドレスを入力してください";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (!dealer) return;
    setSending(true);
    const { error } = await supabase.from("requests").insert({
      dealer_id: dealer.id, dealer_name: dealer.name,
      date, start_time: startTime, end_time: endTime,
      location, email, note, hours, total_fee: totalFee, status: "pending",
    });
    setSending(false);
    if (error) { alert("送信に失敗しました。もう一度お試しください。"); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main style={{ minHeight: "100dvh", background: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ textAlign: "center", maxWidth: 280 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28 }}>✓</div>
          <h2 style={{ fontSize: 18, fontWeight: 400, color: BLACK, marginBottom: 8 }}>依頼を送信しました</h2>
          <p style={{ fontSize: 13, color: GRAY3, lineHeight: 1.7, marginBottom: 6 }}>{dealer.name}さんへの依頼を受け付けました。</p>
          <p style={{ fontSize: 12, color: GRAY3, lineHeight: 1.7, marginBottom: 24 }}>{email} に確認メールをお送りします。</p>
          <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "14px", marginBottom: 20, textAlign: "left" }}>
            {[
              { label: "日付",     value: date },
              { label: "時間",     value: `${startTime} 〜 ${endTime}（${hours}時間）` },
              { label: "場所",     value: location },
              { label: "料金目安", value: `¥${totalFee.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "0.5px solid #F0F0F0" }}>
                <span style={{ color: GRAY3 }}>{label}</span>
                <span style={{ color: BLACK }}>{value}</span>
              </div>
            ))}
          </div>
          <Link href="/dealers" style={{ display: "block", padding: 14, background: BLACK, color: WHITE, borderRadius: 2, fontSize: 12, fontWeight: 400, textAlign: "center", textDecoration: "none", letterSpacing: 1 }}>
            ディーラー一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 2, border: "0.5px solid #E8E8E8", background: WHITE, color: BLACK, outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 11, color: GRAY3, marginBottom: 5, display: "block", letterSpacing: 1 };
  const errStyle: React.CSSProperties   = { fontSize: 11, color: "#E24B4A", marginTop: 3 };

  return (
    <main style={{ minHeight: "100dvh", background: "#F8F8F8", paddingBottom: 40 }}>
      <header style={{ background: BLACK, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href={`/dealers/${dealer.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 2, background: "#1A1A1A", color: WHITE, textDecoration: "none", fontSize: 16, border: "0.5px solid #333" }}>‹</Link>
        <span style={{ fontSize: 11, color: WHITE, letterSpacing: 2 }}>依頼を送る</span>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: "16px" }}>
        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 2, background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
            {dealer.photo_url && dealer.photo_visible ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dealer.photo_url} alt={dealer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" fill="#CCCCCC" /><ellipse cx="12" cy="20" rx="9" ry="5" fill="#CCCCCC" /></svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: BLACK }}>{dealer.name}</div>
            <div style={{ fontSize: 13, color: GRAY3 }}>¥{dealer.hourly_rate.toLocaleString()} / 時間</div>
          </div>
        </div>

        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "16px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: GRAY3, letterSpacing: 1, marginBottom: 14 }}>依頼内容</div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>日付 <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: "" })); }} style={inputStyle} />
            {errors.date && <p style={errStyle}>{errors.date}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>時間 <span style={{ color: "#E24B4A" }}>*</span></label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="time" step="900" value={startTime} onChange={(e) => { setStart(e.target.value); setErrors((p) => ({ ...p, startTime: "" })); }} style={{ ...inputStyle, flex: 1 }} />
              <span style={{ color: GRAY3, fontSize: 13 }}>〜</span>
              <input type="time" step="900" value={endTime} onChange={(e) => { setEnd(e.target.value); setErrors((p) => ({ ...p, endTime: "" })); }} style={{ ...inputStyle, flex: 1 }} />
            </div>
            {errors.startTime && <p style={errStyle}>{errors.startTime}</p>}
            {errors.endTime && <p style={errStyle}>{errors.endTime}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>場所 <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="text" placeholder="例: 大阪市北区梅田〇〇マンション" value={location} onChange={(e) => { setLocation(e.target.value); setErrors((p) => ({ ...p, location: "" })); }} style={inputStyle} />
            {errors.location && <p style={errStyle}>{errors.location}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>メールアドレス <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="email" placeholder="example@gmail.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }} style={inputStyle} />
            <p style={{ fontSize: 11, color: GRAY3, marginTop: 3 }}>担当者からの返信はこちらに届きます</p>
            {errors.email && <p style={errStyle}>{errors.email}</p>}
          </div>

          <div>
            <label style={labelStyle}>備考（任意）</label>
            <textarea rows={3} placeholder="参加人数・ゲーム内容・その他要望など" value={note} onChange={(e) => setNote(e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
        </div>

        <div style={{ background: hours > 0 ? "#F5F5F5" : "#F8F8F8", border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: GRAY3, letterSpacing: 1, marginBottom: 8 }}>料金目安</div>
          {hours > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: GRAY3 }}>¥{dealer.hourly_rate.toLocaleString()} × {hours}時間</span>
                <span style={{ color: BLACK, fontWeight: 500 }}>¥{totalFee.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 11, color: GRAY3 }}>※ 実際の金額は担当者よりご連絡します</div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: GRAY3 }}>開始・終了時間を入力すると料金が表示されます</div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={sending} style={{ width: "100%", padding: 15, background: sending ? "#999" : BLACK, color: WHITE, border: "none", borderRadius: 2, fontSize: 13, cursor: sending ? "not-allowed" : "pointer", letterSpacing: 1, marginBottom: 10 }}>
          {sending ? "送信中..." : "依頼を送信する"}
        </button>
        <Link href={`/dealers/${dealer.id}`} style={{ display: "block", padding: 12, background: "transparent", color: GRAY3, border: "0.5px solid #E8E8E8", borderRadius: 2, fontSize: 12, textAlign: "center", textDecoration: "none" }}>
          キャンセル
        </Link>
      </div>
    </main>
  );
}
