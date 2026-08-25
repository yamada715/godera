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
  is_active: boolean;
  photo_url?: string;
  photo_visible: boolean;
  email?: string;
  created_at: string;
};

type Request = {
  id: string;
  dealer_name: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  email: string;
  note: string;
  hours: number;
  total_fee: number;
  status: string;
  admin_reply: string;
  created_at: string;
};

const VENUE_LABEL: Record<string, string> = {
  home: "個人宅", amusement: "アミューズ", both: "両方対応",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ディーラー詳細モーダル
function DealerModal({ app, onClose, onApprove, onReject, onTogglePhoto }: {
  app: Application;
  onClose: () => void;
  onApprove: (id: string, status: string) => void;
  onReject: (id: string, status: string) => void;
  onTogglePhoto: (id: string, current: boolean) => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "12px 12px 0 0", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: "20px 16px 40px" }} onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#2C2C2A" }}>{app.name}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888780" }}>✕</button>
        </div>

        {/* 写真 */}
        {app.photo_url && (
          <div style={{ marginBottom: 16, position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={app.photo_url} alt={app.name} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, opacity: app.photo_visible ? 1 : 0.3 }} />
            {!app.photo_visible && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", borderRadius: 8 }}>
                <span style={{ color: "#fff", fontSize: 13 }}>写真非表示中</span>
              </div>
            )}
          </div>
        )}

        {/* 基本情報 */}
        <div style={{ background: "#F9F9F7", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "経験年数",   value: `${app.experience_years}年` },
              { label: "時給",       value: `¥${app.hourly_rate.toLocaleString()}` },
              { label: "対応種別",   value: VENUE_LABEL[app.venue_type] },
              { label: "メール",     value: app.email || "未登録" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 10, color: "#888780", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#2C2C2A" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ゲーム */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>対応ゲーム</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {app.game_types.map((g) => <span key={g} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: "#F1EFE8", color: "#2C2C2A", border: "0.5px solid #D3D1C7" }}>{g}</span>)}
          </div>
        </div>

        {/* エリア */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>対応エリア</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {app.areas.map((a) => <span key={a} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: "#F1EFE8", color: "#2C2C2A", border: "0.5px solid #D3D1C7" }}>{a}</span>)}
          </div>
        </div>

        {/* タグ */}
        {app.tags && app.tags.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>特徴タグ</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {app.tags.map((t) => <span key={t} style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: "#E6F1FB", color: "#185FA5", border: "0.5px solid #A8CFF5" }}>{t}</span>)}
            </div>
          </div>
        )}

        {/* 自己紹介 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>自己紹介</div>
          <div style={{ fontSize: 13, color: "#2C2C2A", lineHeight: 1.7, background: "#F9F9F7", borderRadius: 8, padding: "10px 12px" }}>{app.bio}</div>
        </div>

        <div style={{ fontSize: 11, color: "#888780", marginBottom: 12 }}>📅 申請日: {formatDate(app.created_at)}</div>

        {/* アクションボタン */}
        {app.status === "pending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { onApprove(app.id); onClose(); }} style={{ width: "100%", padding: "10px", background: "#EAF3DE", color: "#3B6D11", border: "0.5px solid #C0DD97", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              ✓ 承認する
            </button>
            <button onClick={() => { onReject(app.id); onClose(); }} style={{ width: "100%", padding: "10px", background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              ✗ 却下する
            </button>
          </div>
        )}
        {app.status === "approved" && app.photo_url && (
          <button onClick={() => onTogglePhoto(app.id, app.photo_visible)} style={{
            width: "100%", padding: "10px",
            background: app.photo_visible ? "#FAEEDA" : "#E6F1FB",
            color: app.photo_visible ? "#854F0B" : "#185FA5",
            border: `0.5px solid ${app.photo_visible ? "#F5CC8A" : "#A8CFF5"}`,
            borderRadius: 8, fontSize: 13, cursor: "pointer",
          }}>
            {app.photo_visible ? "🚫 写真を非表示にする" : "📷 写真を表示する"}
          </button>
        )}
      </div>
    </div>
  );
}

// 依頼カード
function RequestCard({ req, onMemo, onComplete, onRestore }: {
  req: Request;
  onMemo?: (id: string, text: string) => void;
  onComplete?: (id: string) => void;
  onRestore?: (id: string) => void;
}) {
  const [memoText, setMemoText] = useState(req.admin_reply || "");
  const isCompleted = req.status === "completed";
  const isPending   = req.status === "pending";

  return (
    <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10, opacity: isCompleted ? 0.8 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#2C2C2A" }}>{req.dealer_name}</div>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500, background: isCompleted ? "#F1EFE8" : isPending ? "#FAEEDA" : "#EAF3DE", color: isCompleted ? "#888780" : isPending ? "#633806" : "#3B6D11" }}>
          {isCompleted ? "完了" : isPending ? "未対応" : "対応済"}
        </span>
      </div>
      <div style={{ fontSize: 11, color: "#888780", marginBottom: 6 }}>📅 送信: {formatDate(req.created_at)}</div>
      <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 2 }}>日時: {req.date} {req.start_time}〜{req.end_time}（{req.hours}時間）</div>
      <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 2 }}>場所: {req.location}</div>
      <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: 2 }}>メール: <a href={`mailto:${req.email}`} style={{ color: "#0E2A45" }}>{req.email}</a></div>
      <div style={{ fontSize: 12, color: "#5F5E5A", marginBottom: req.note ? 8 : 0 }}>料金目安: ¥{req.total_fee.toLocaleString()}</div>
      {req.note && <div style={{ fontSize: 13, color: "#2C2C2A", lineHeight: 1.6, marginBottom: 10, background: "#F9F9F7", borderRadius: 8, padding: "8px 10px" }}>📝 {req.note}</div>}

      {/* メモ欄 */}
      {!isCompleted && onMemo && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>メモ</div>
          <textarea rows={2} placeholder="内部メモを入力..." value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none", resize: "none", marginBottom: 6 }} />
          <button onClick={() => onMemo(req.id, memoText)}
            style={{ width: "100%", padding: "7px", background: "#F1EFE8", color: "#5F5E5A", border: "0.5px solid #D3D1C7", borderRadius: 8, fontSize: 12, cursor: "pointer", marginBottom: 6 }}>
            メモを保存
          </button>
        </div>
      )}
      {req.admin_reply && !memoText && (
        <div style={{ fontSize: 12, color: "#5F5E5A", background: "#F9F9F7", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>📋 メモ: {req.admin_reply}</div>
      )}

      {!isCompleted && onComplete && (
        <button onClick={() => onComplete(req.id)} style={{ width: "100%", padding: "8px", background: "#EAF3DE", color: "#3B6D11", border: "0.5px solid #C0DD97", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
          完了済みに移動
        </button>
      )}
      {isCompleted && onRestore && (
        <button onClick={() => onRestore(req.id)} style={{ width: "100%", padding: "8px", background: "#E6F1FB", color: "#185FA5", border: "0.5px solid #A8CFF5", borderRadius: 8, fontSize: 12, cursor: "pointer", marginTop: 8 }}>
          ↩ 依頼に戻す
        </button>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false);
  const [pw, setPw]               = useState("");
  const [pwError, setPwError]     = useState("");
  const [tab, setTab]             = useState<"applications" | "requests" | "done" | "tags">("applications");
  const [apps, setApps]           = useState<Application[]>([]);
  const [reqs, setReqs]           = useState<Request[]>([]);
  const [tagList, setTagList]     = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // 完了済みソート・検索
  const [doneSort, setDoneSort]   = useState<"date" | "name">("date");
  const [doneSearch, setDoneSearch] = useState("");

  async function loadData() {
    setLoading(true);
    const [{ data: a }, { data: r }, { data: t }] = await Promise.all([
      supabase.from("dealer_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("requests").select("*").order("created_at", { ascending: false }),
      supabase.from("tags").select("*").order("name"),
    ]);
    setApps(a || []);
    setReqs(r || []);
    setTagList(t || []);
    setLoading(false);
  }

  useEffect(() => { if (authed) loadData(); }, [authed]);

  async function updateAppStatus(id: string, status: string) {
    await supabase.from("dealer_applications").update({ status }).eq("id", id);
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("dealer_applications").update({ is_active: !current }).eq("id", id);
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, is_active: !current } : a));
  }

  async function togglePhotoVisible(id: string, current: boolean) {
    await supabase.from("dealer_applications").update({ photo_visible: !current }).eq("id", id);
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, photo_visible: !current } : a));
    if (selectedApp?.id === id) setSelectedApp((prev) => prev ? { ...prev, photo_visible: !current } : null);
  }

  async function saveMemo(id: string, text: string) {
    await supabase.from("requests").update({ admin_reply: text, status: "replied" }).eq("id", id);
    setReqs((prev) => prev.map((r) => r.id === id ? { ...r, admin_reply: text, status: "replied" } : r));
  }

  async function completeRequest(id: string) {
    await supabase.from("requests").update({ status: "completed" }).eq("id", id);
    setReqs((prev) => prev.map((r) => r.id === id ? { ...r, status: "completed" } : r));
  }

  async function restoreRequest(id: string) {
    await supabase.from("requests").update({ status: "pending" }).eq("id", id);
    setReqs((prev) => prev.map((r) => r.id === id ? { ...r, status: "pending" } : r));
  }

  async function addTag() {
    const name = newTag.trim();
    if (!name) return;
    const { data } = await supabase.from("tags").insert({ name }).select().single();
    if (data) setTagList((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setNewTag("");
  }

  async function deleteTag(id: string) {
    await supabase.from("tags").delete().eq("id", id);
    setTagList((prev) => prev.filter((t) => t.id !== id));
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

  const pendingApps   = apps.filter((a) => a.status === "pending");
  const approvedApps  = apps.filter((a) => a.status === "approved");
  const rejectedApps  = apps.filter((a) => a.status === "rejected");
  const activeReqs    = reqs.filter((r) => r.status !== "completed");
  const completedReqs = reqs.filter((r) => r.status === "completed");

  // 完了済みフィルター・ソート
  const filteredDoneReqs = completedReqs
    .filter((r) => !doneSearch || r.dealer_name.includes(doneSearch) || r.location.includes(doneSearch) || r.email.includes(doneSearch))
    .sort((a, b) => doneSort === "name"
      ? a.dealer_name.localeCompare(b.dealer_name)
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 40 }}>
      {/* モーダル */}
      {selectedApp && (
        <DealerModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={updateAppStatus}
          onReject={updateAppStatus}
          onTogglePhoto={togglePhotoVisible}
        />
      )}

      <header style={{ background: "#0E2A45", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>管理者画面</div>
          <div style={{ fontSize: 11, color: "#6FA3C8" }}>GODILLA Admin</div>
        </div>
        <button onClick={loadData} style={{ background: "#F5A623", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#0E2A45" }}>更新</button>
      </header>

      <div style={{ display: "flex", background: "#fff", borderBottom: "0.5px solid #D3D1C7", overflowX: "auto" }}>
        {[
          { key: "applications", label: `申請 (${pendingApps.length})` },
          { key: "requests",     label: `依頼 (${activeReqs.length})` },
          { key: "done",         label: `完了済 (${completedReqs.length})` },
          { key: "tags",         label: `タグ管理` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key as typeof tab)} style={{ flex: 1, padding: "12px 8px", fontSize: 12, whiteSpace: "nowrap", fontWeight: tab === key ? 500 : 400, color: tab === key ? "#0E2A45" : "#888780", background: "none", border: "none", borderBottom: tab === key ? "2px solid #0E2A45" : "2px solid transparent", cursor: "pointer" }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "12px" }}>
        {loading && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>読み込み中...</div>}

        {/* 申請タブ */}
        {!loading && tab === "applications" && (
          <div>
            {pendingApps.length === 0 && approvedApps.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>申請はありません</div>}

            {/* 審査中 */}
            {pendingApps.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>審査中</div>
                {pendingApps.map((app) => (
                  <div key={app.id} style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10, cursor: "pointer" }}
                    onClick={() => setSelectedApp(app)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {app.photo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={app.photo_url} alt={app.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "0.5px solid #D3D1C7" }} />
                        )}
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: "#0E2A45", textDecoration: "underline" }}>{app.name}</div>
                          <div style={{ fontSize: 12, color: "#5F5E5A" }}>経験{app.experience_years}年 ・ ¥{app.hourly_rate.toLocaleString()}/h</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#FAEEDA", color: "#633806", fontWeight: 500 }}>審査中</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#888780", marginTop: 6 }}>📅 {formatDate(app.created_at)} ・ タップして詳細を見る →</div>
                  </div>
                ))}
              </>
            )}

            {/* 承認済み */}
            {approvedApps.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: ".06em", textTransform: "uppercase", margin: "16px 0 8px" }}>承認済みディーラー</div>
                {approvedApps.map((app) => (
                  <div key={app.id} style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10, opacity: app.is_active ? 1 : 0.6 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                      {app.photo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={app.photo_url} alt={app.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "0.5px solid #D3D1C7", opacity: app.photo_visible ? 1 : 0.3, flexShrink: 0, cursor: "pointer" }}
                          onClick={() => setSelectedApp(app)} />
                      )}
                      <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelectedApp(app)}>
                        <div style={{ fontSize: 15, fontWeight: 500, color: "#0E2A45", textDecoration: "underline" }}>{app.name}</div>
                        <div style={{ fontSize: 12, color: "#5F5E5A" }}>経験{app.experience_years}年 ・ ¥{app.hourly_rate.toLocaleString()}/h</div>
                      </div>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: app.is_active ? "#EAF3DE" : "#F1EFE8", color: app.is_active ? "#3B6D11" : "#888780", fontWeight: 500 }}>
                        {app.is_active ? "表示中" : "非表示"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => toggleActive(app.id, app.is_active)} style={{ flex: 1, padding: "7px", minWidth: 120, background: app.is_active ? "#FCEBEB" : "#EAF3DE", color: app.is_active ? "#A32D2D" : "#3B6D11", border: `0.5px solid ${app.is_active ? "#F09595" : "#C0DD97"}`, borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                        {app.is_active ? "⏸ 非表示にする" : "▶ 表示に戻す"}
                      </button>
                      {app.photo_url && (
                        <button onClick={() => togglePhotoVisible(app.id, app.photo_visible)} style={{ flex: 1, padding: "7px", minWidth: 120, background: app.photo_visible ? "#FAEEDA" : "#E6F1FB", color: app.photo_visible ? "#854F0B" : "#185FA5", border: `0.5px solid ${app.photo_visible ? "#F5CC8A" : "#A8CFF5"}`, borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                          {app.photo_visible ? "🚫 写真を非表示" : "📷 写真を表示"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* 依頼タブ */}
        {!loading && tab === "requests" && (
          <div>
            {activeReqs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>未対応の依頼はありません</div>}
            {activeReqs.map((req) => <RequestCard key={req.id} req={req} onMemo={saveMemo} onComplete={completeRequest} />)}
          </div>
        )}

        {/* 完了済みタブ */}
        {!loading && tab === "done" && (
          <div>
            {/* 検索・ソート */}
            <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "12px", marginBottom: 12 }}>
              <input type="text" placeholder="ディーラー名・場所・メールで検索..." value={doneSearch}
                onChange={(e) => setDoneSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none", marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setDoneSort("date")} style={{ flex: 1, padding: "6px", fontSize: 12, borderRadius: 8, border: "0.5px solid", background: doneSort === "date" ? "#0E2A45" : "transparent", color: doneSort === "date" ? "#fff" : "#5F5E5A", borderColor: doneSort === "date" ? "#0E2A45" : "#D3D1C7", cursor: "pointer" }}>
                  日付順
                </button>
                <button onClick={() => setDoneSort("name")} style={{ flex: 1, padding: "6px", fontSize: 12, borderRadius: 8, border: "0.5px solid", background: doneSort === "name" ? "#0E2A45" : "transparent", color: doneSort === "name" ? "#fff" : "#5F5E5A", borderColor: doneSort === "name" ? "#0E2A45" : "#D3D1C7", cursor: "pointer" }}>
                  名前順
                </button>
              </div>
            </div>

            {filteredDoneReqs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>完了済みの依頼はありません</div>}
            {filteredDoneReqs.map((req) => <RequestCard key={req.id} req={req} onRestore={restoreRequest} />)}

            {/* 却下済み申請 */}
            {rejectedApps.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: ".06em", textTransform: "uppercase", margin: "16px 0 8px" }}>却下済み申請</div>
                {rejectedApps.map((app) => (
                  <div key={app.id} style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10, opacity: 0.7 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>{app.name}</div>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#FCEBEB", color: "#A32D2D", fontWeight: 500 }}>却下</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#888780" }}>📅 {formatDate(app.created_at)}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* タグ管理タブ */}
        {!loading && tab === "tags" && (
          <div>
            <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 10 }}>タグを追加</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" placeholder="新しいタグ名" value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  style={{ flex: 1, padding: "8px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none" }} />
                <button onClick={addTag} style={{ padding: "8px 16px", background: "#0E2A45", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>追加</button>
              </div>
            </div>
            <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 10 }}>登録済みタグ（{tagList.length}件）</div>
              {tagList.length === 0 && <div style={{ fontSize: 13, color: "#888780" }}>タグがありません</div>}
              {tagList.map((tag) => (
                <div key={tag.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #F1EFE8" }}>
                  <span style={{ fontSize: 13, color: "#2C2C2A" }}>{tag.name}</span>
                  <button onClick={() => deleteTag(tag.id)} style={{ padding: "4px 10px", background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>削除</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
