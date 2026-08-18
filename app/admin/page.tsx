// app/admin/page.tsx — 管理者画面
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "godilla2024";

type Application = {
  id: string;
  name: string;
  experience_years: number;
  game_types: string[];
  areas: string[];
  venue_type: string;
  hourly_rate: number;
  bio: string;
  tags: string[];
  status: string;
  created_at: string;
};

type Request = {
  id: string;
  dealer_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  note: string;
  hours: number;
  total_fee: number;
  status: string;
  admin_reply: string;
  email: string;
  created_at: string;
};

const VENUE_LABEL: Record<string, string> = {
  home: "個人宅", amusement: "アミューズ", both: "両方対応",
};
const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  pending:  { label: "審査中",   bg: "#FAEEDA", color: "#633806" },
  approved: { label: "承認済",   bg: "#EAF3DE", color: "#3B6D11" },
  rejected: { label: "却下",     bg: "#FCEBEB", color: "#A32D2D" },
};

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false);
  const [pw, setPw]           = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab]         = useState<"applications" | "requests">("applications");
  const [apps, setApps]       = useState<Application[]>([]);
  const [reqs, setReqs]       = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply]     = useState<Record<string, string>>({});

  async function loadData() {
    setLoading(true);
    const [{ data: a }, { data: r }] = await Promise.all([
      supabase.from("dealer_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("requests").select("*").order("created_at", { ascending: false }),
    ]);
    setApps(a || []);
    setReqs(r || []);
    setLoading(false);
  }

  useEffect(() => { if (authed) loadData(); }, [authed]);

  async function updateAppStatus(id: string, status: string) {
    await supabase.from("dealer_applications").update({ status }).eq("id", id);
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  async function sendReply(id: string) {
    const text = reply[id] || "";
    if (!text.trim()) return;
    await supabase.from("requests").update({ status: "replied", admin_reply: text }).eq("id", id);
    setReqs((prev) => prev.map((r) => r.id === id ? { ...r, status: "replied", admin_reply: text } : r));
    setReply((prev) => ({ ...prev, [id]: "" }));
  }

  if (!authed) {
    return (
      <main style={{ minHeight: "100dvh", background: "#0E2A45", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 320 }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#2C2C2A", marginBottom: 4 }}>管理者ログイン</div>
          <div style={{ fontSize: 12, color: "#888780", marginBottom: 20 }}>GODILLA Admin</div>
          <input type="password" placeholder="パスワード" value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") { if (pw === ADMIN_PASSWORD) setAuthed(true); else setPwError("パスワードが違います"); } }}
            style={{ width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none", marginBottom: 8 }} />
          {pwError && <p style={{ fontSize: 11, color: "#E24B4A", marginBottom: 8 }}>{pwError}</p>}
          <button onClick={() => { if (pw === ADMIN_PASSWORD) setAuthed(true); else setPwError("パスワードが違います"); }}
            style={{ width: "100%", padding: 12, background: "#0E2A45", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            ログイン
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 40 }}>
      <header style={{ background: "#0E2A45", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>管理者画面</div>
          <div style={{ fontSize: 11, color: "#6FA3C8" }}>GODILLA Admin</div>
        </div>
        <button onClick={loadData} style={{ background: "#F5A623", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#0E2A45" }}>
          更新
        </button>
      </header>

      {/* タブ */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "0.5px solid #D3D1C7" }}>
        <button onClick={() => setTab("applications")} style={{ flex: 1, padding: "12px", fontSize: 13, fontWeight: tab === "applications" ? 500 : 400, color: tab === "applications" ? "#0E2A45" : "#888780", background: "none", border: "none", borderBottom: tab === "applications" ? "2px solid #0E2A45" : "2px solid transparent", cursor: "pointer" }}>
          ディーラー申請 ({apps.filter((a) => a.status === "pending").length})
        </button>
        <button onClick={() => setTab("requests")} style={{ flex: 1, padding: "12px", fontSize: 13, fontWeight: tab === "requests" ? 500 : 400, color: tab === "requests" ? "#0E2A45" : "#888780", background: "none", border: "none", borderBottom: tab === "requests" ? "2px solid #0E2A45" : "2px solid transparent", cursor: "pointer" }}>
          依頼一覧 ({reqs.filter((r) => r.status === "pending").length})
        </button>
      </div>

      <div style={{ padding: "12px" }}>
        {loading && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>読み込み中...</div>}

        {/* ディーラー申請 */}
        {!loading && tab === "applications" && (
          <div>
            {apps.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>申請はありません</div>}
            {apps.map((app) => {
              const st = STATUS_LABEL[app.status] || STATUS_LABEL.pending;
              return (
                <div key={app.id} style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#2C2C2A" }}>{app.name}</div>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color, fontWeight: 500 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 4 }}>経験{app.experience_years}年 ・ ¥{app.hourly_rate.toLocaleString()}/h ・ {VENUE_LABEL[app.venue_type]}</div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 4 }}>ゲーム: {app.game_types.join(", ")}</div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 8 }}>エリア: {app.areas.join(", ")}</div>
                  <div style={{ fontSize: 13, color: "#2C2C2A", lineHeight: 1.6, marginBottom: 12, background: "#F9F9F7", borderRadius: 8, padding: "8px 10px" }}>{app.bio}</div>
                  {app.status === "pending" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => updateAppStatus(app.id, "approved")} style={{ flex: 1, padding: "8px", background: "#EAF3DE", color: "#3B6D11", border: "0.5px solid #C0DD97", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                        ✓ 承認
                      </button>
                      <button onClick={() => updateAppStatus(app.id, "rejected")} style={{ flex: 1, padding: "8px", background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                        ✗ 却下
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 依頼一覧 */}
        {!loading && tab === "requests" && (
          <div>
            {reqs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>依頼はありません</div>}
            {reqs.map((req) => {
              const st = req.status === "replied"
                ? { label: "返信済", bg: "#EAF3DE", color: "#3B6D11" }
                : { label: "未返信", bg: "#FAEEDA", color: "#633806" };
              return (
                <div key={req.id} style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#2C2C2A" }}>{req.dealer_name}</div>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: st.bg, color: st.color, fontWeight: 500 }}>{st.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 2 }}>メール: <a href={`mailto:${req.email}`} style={{ color: "#0E2A45" }}>{req.email}</a></div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 2 }}>日時: {req.date} {req.start_time}〜{req.end_time}（{req.hours}時間）</div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 2 }}>場所: {req.location}</div>
                  <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 8 }}>料金目安: ¥{req.total_fee.toLocaleString()}</div>
                  {req.note && <div style={{ fontSize: 13, color: "#2C2C2A", lineHeight: 1.6, marginBottom: 10, background: "#F9F9F7", borderRadius: 8, padding: "8px 10px" }}>{req.note}</div>}
                  {req.admin_reply && (
                    <div style={{ fontSize: 12, color: "#3B6D11", background: "#EAF3DE", borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>返信済: {req.admin_reply}</div>
                  )}
                  {req.status === "pending" && (
                    <div>
                      <textarea rows={2} placeholder="返信内容を入力..." value={reply[req.id] || ""}
                        onChange={(e) => setReply((prev) => ({ ...prev, [req.id]: e.target.value }))}
                        style={{ width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none", resize: "none", marginBottom: 8 }} />
                      <button onClick={() => sendReply(req.id)} style={{ width: "100%", padding: "8px", background: "#0E2A45", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                        返信する
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
