// app/dealers/[id]/request/page.tsx — 依頼フォーム（料金自動計算）
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DEALERS } from "@/lib/dealers";

export default function RequestPage() {
  const params = useParams();
  const dealer = DEALERS.find((d) => d.id === params.id);

  const [date, setDate]         = useState("");
  const [startTime, setStart]   = useState("");
  const [endTime, setEnd]       = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote]         = useState("");
  const [hours, setHours]       = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  // 時間数と料金を自動計算
  useEffect(() => {
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60; // 日をまたぐ場合
      setHours(Math.round(diff / 60 * 10) / 10);
    } else {
      setHours(0);
    }
  }, [startTime, endTime]);

  if (!dealer) return <div style={{ padding: 32, textAlign: "center", color: "#888780" }}>ディーラーが見つかりません</div>;

  const totalFee = Math.round(dealer.hourlyRate * hours);

  function validate() {
    const e: Record<string, string> = {};
    if (!date)      e.date      = "日付を入力してください";
    if (!startTime) e.startTime = "開始時間を入力してください";
    if (!endTime)   e.endTime   = "終了時間を入力してください";
    if (hours <= 0) e.endTime   = "終了時間は開始時間より後にしてください";
    if (!location)  e.location  = "場所を入力してください";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main style={{ minHeight: "100dvh", background: "#F1EFE8", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ textAlign: "center", maxWidth: 280 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EAF3DE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, color: "#3B6D11" }}>✓</div>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#2C2C2A", marginBottom: 8 }}>依頼を送信しました</h2>
          <p style={{ fontSize: 14, color: "#5F5E5A", lineHeight: 1.7, marginBottom: 6 }}>{dealer.name}さんへの依頼を受け付けました。</p>
          <p style={{ fontSize: 13, color: "#888780", lineHeight: 1.7, marginBottom: 28 }}>確認後、担当者よりご連絡いたします。</p>
          <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontSize: 12, color: "#888780", marginBottom: 8 }}>依頼内容</div>
            {[
              { label: "日付",     value: date },
              { label: "時間",     value: `${startTime} 〜 ${endTime}（${hours}時間）` },
              { label: "場所",     value: location },
              { label: "料金目安", value: `¥${totalFee.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #F1EFE8" }}>
                <span style={{ color: "#888780" }}>{label}</span>
                <span style={{ color: "#2C2C2A" }}>{value}</span>
              </div>
            ))}
          </div>
          <Link href="/dealers" style={{ display: "block", padding: 14, background: "#0E2A45", color: "#fff", borderRadius: 12, fontSize: 14, fontWeight: 500, textAlign: "center", textDecoration: "none" }}>
            ディーラー一覧に戻る
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
  const errStyle: React.CSSProperties = {
    fontSize: 11, color: "#E24B4A", marginTop: 3,
  };

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 40 }}>
      {/* ヘッダー */}
      <header style={{ background: "#FFFFFF", borderBottom: "0.5px solid #D3D1C7", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href={`/dealers/${dealer.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "#0E2A45", color: "#fff", textDecoration: "none", fontSize: 16 }}>‹</Link>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>依頼を送る</span>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: "16px" }}>
        {/* 選択中ディーラー */}
        <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: dealer.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="5" fill="#fff" fillOpacity="0.6" />
              <ellipse cx="12" cy="20" rx="9" ry="5" fill="#fff" fillOpacity="0.6" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>{dealer.name}</div>
            <div style={{ fontSize: 13, color: "#0E2A45", fontWeight: 500 }}>¥{dealer.hourlyRate.toLocaleString()} / 時間</div>
          </div>
        </div>

        {/* フォーム */}
        <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 14 }}>依頼内容</div>

          {/* 日付 */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>日付 <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: "" })); }} style={inputStyle} />
            {errors.date && <p style={errStyle}>{errors.date}</p>}
          </div>

          {/* 時間 */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>時間 <span style={{ color: "#E24B4A" }}>*</span></label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="time" step="900" value={startTime} onChange={(e) => { setStart(e.target.value); setErrors((prev) => ({ ...prev, startTime: "" })); }} style={{ ...inputStyle, flex: 1 }} />
              <span style={{ color: "#888780", fontSize: 13 }}>〜</span>
              <input type="time" value={endTime} onChange={(e) => { setEnd(e.target.value); setErrors((prev) => ({ ...prev, endTime: "" })); }} style={{ ...inputStyle, flex: 1 }} />
            </div>
            {errors.startTime && <p style={errStyle}>{errors.startTime}</p>}
            {errors.endTime && <p style={errStyle}>{errors.endTime}</p>}
          </div>

          {/* 場所 */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>場所 <span style={{ color: "#E24B4A" }}>*</span></label>
            <input type="text" placeholder="例: 大阪市北区梅田〇〇マンション" value={location}
              onChange={(e) => { setLocation(e.target.value); setErrors((prev) => ({ ...prev, location: "" })); }}
              style={inputStyle} />
            {errors.location && <p style={errStyle}>{errors.location}</p>}
          </div>

          {/* 備考 */}
          <div>
            <label style={labelStyle}>備考（任意）</label>
            <textarea rows={3} placeholder="参加人数・ゲーム内容・その他要望など" value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ ...inputStyle, resize: "none" }} />
          </div>
        </div>

        {/* 料金計算 */}
        <div style={{ background: hours > 0 ? "#EAF3DE" : "#F1EFE8", border: `0.5px solid ${hours > 0 ? "#C0DD97" : "#D3D1C7"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#888780", marginBottom: 8 }}>料金目安</div>
          {hours > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: "#5F5E5A" }}>¥{dealer.hourlyRate.toLocaleString()} × {hours}時間</span>
                <span style={{ color: "#2C2C2A", fontWeight: 500 }}>¥{totalFee.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 11, color: "#888780" }}>※ 実際の金額は担当者よりご連絡します</div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: "#888780" }}>開始・終了時間を入力すると料金が表示されます</div>
          )}
        </div>

        {/* 送信ボタン */}
        <button onClick={handleSubmit} style={{ width: "100%", padding: 15, background: "#0E2A45", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer", marginBottom: 10 }}>
          依頼を送信する
        </button>
        <Link href={`/dealers/${dealer.id}`} style={{ display: "block", padding: 12, background: "transparent", color: "#5F5E5A", border: "0.5px solid #D3D1C7", borderRadius: 12, fontSize: 14, textAlign: "center", textDecoration: "none" }}>
          キャンセル
        </Link>
      </div>
    </main>
  );
}
