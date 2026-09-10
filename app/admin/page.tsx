"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "godilla2024";
const GAME_TYPES = ["NLH", "Omaha", "Stud", "Draw", "Hi-Lo"];
const VENUE_LABEL: Record<string, string> = { home: "個人宅", amusement: "アミューズ", both: "両方対応" };

type Application = {
  id: string; name: string; experience_years: number;
  game_types: string[]; areas: string[]; venue_type: string;
  hourly_rate: number; bio: string; tags: string[];
  status: string; is_active: boolean;
  photo_url?: string; photo_visible: boolean;
  email?: string; phone?: string; created_at: string;
};

type Request = {
  id: string; dealer_name: string; date: string;
  start_time: string; end_time: string; location: string;
  email: string; note: string; hours: number;
  total_fee: number; status: string; admin_reply: string; created_at: string;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// ディーラー編集モーダル
function DealerEditModal({ app, tagOptions, areaOptions, onClose, onSave, onApprove, onReject, onTogglePhoto }: {
  app: Application;
  tagOptions: string[];
  areaOptions: string[];
  onClose: () => void;
  onSave: (id: string, data: Partial<Application>, photoFile?: File) => Promise<void>;
  onApprove: (id: string, status: string) => void;
  onReject: (id: string, status: string) => void;
  onTogglePhoto: (id: string, current: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName]     = useState(app.name);
  const [exp, setExp]       = useState(String(app.experience_years));
  const [rate, setRate]     = useState(String(app.hourly_rate));
  const [venue, setVenue]   = useState(app.venue_type);
  const [games, setGames]   = useState<string[]>(app.game_types);
  const [areas, setAreas]   = useState<string[]>(app.areas);
  const [tags, setTags]     = useState<string[]>(app.tags || []);
  const [bio, setBio]       = useState(app.bio);
  const [photo, setPhoto]   = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleGame(g: string) { setGames((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]); }
  function toggleArea(a: string) { setAreas((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]); }
  function toggleTag(t: string)  { setTags((p)  => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]); }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(app.id, {
      name, experience_years: parseInt(exp), hourly_rate: parseInt(rate),
      venue_type: venue, game_types: games, areas, tags, bio,
    }, photo || undefined);
    setSaving(false);
    onClose();
  }

  const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none" };
  const labelStyle: React.CSSProperties = { fontSize: 10, color: "#888780", marginBottom: 4, display: "block", letterSpacing: 1, textTransform: "uppercase" };
  const toggleBtn = (active: boolean): React.CSSProperties => ({
    padding: "4px 10px", fontSize: 11, borderRadius: 20, cursor: "pointer",
    border: "0.5px solid", background: active ? "#0E2A45" : "transparent",
    color: active ? "#fff" : "#5F5E5A", borderColor: active ? "#0E2A45" : "#D3D1C7",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "12px 12px 0 0", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: "20px 16px 40px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#2C2C2A" }}>{app.name} の編集</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888780" }}>✕</button>
        </div>

        {/* 写真 */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>プロフィール写真</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div onClick={() => fileRef.current?.click()} style={{ width: 64, height: 64, borderRadius: 8, background: "#F0F0F0", border: "0.5px solid #D3D1C7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0 }}>
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : app.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.photo_url} alt={app.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: app.photo_visible ? 1 : 0.3 }} />
              ) : (
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="10" r="6" fill="#CCC" /><ellipse cx="14" cy="22" rx="10" ry="6" fill="#CCC" /></svg>
              )}
            </div>
            <div>
              <button onClick={() => fileRef.current?.click()} style={{ padding: "6px 12px", background: "#0E2A45", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", display: "block", marginBottom: 4 }}>写真を変更</button>
              {app.photo_url && (
                <button onClick={() => onTogglePhoto(app.id, app.photo_visible)} style={{ padding: "4px 10px", background: app.photo_visible ? "#FAEEDA" : "#E6F1FB", color: app.photo_visible ? "#854F0B" : "#185FA5", border: "none", borderRadius: 6, fontSize: 10, cursor: "pointer" }}>
                  {app.photo_visible ? "写真を非表示" : "写真を表示"}
                </button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
        </div>

        {/* 基本情報 */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>氏名</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>経験年数</label>
            <input type="number" min="0" max="30" value={exp} onChange={(e) => setExp(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>時給（円）</label>
            <input type="number" min="1000" step="500" value={rate} onChange={(e) => setRate(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>対応種別</label>
          <select value={venue} onChange={(e) => setVenue(e.target.value)} style={inputStyle}>
            <option value="home">個人宅</option>
            <option value="amusement">アミューズメント施設</option>
            <option value="both">両方対応</option>
          </select>
        </div>

        {/* ゲーム */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>対応ゲーム</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {GAME_TYPES.map((g) => <button key={g} onClick={() => toggleGame(g)} style={toggleBtn(games.includes(g))}>{g}</button>)}
          </div>
        </div>

        {/* エリア */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>対応エリア</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {areaOptions.map((a) => <button key={a} onClick={() => toggleArea(a)} style={toggleBtn(areas.includes(a))}>{a}</button>)}
          </div>
        </div>

        {/* タグ */}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>特徴タグ</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tagOptions.map((t) => <button key={t} onClick={() => toggleTag(t)} style={toggleBtn(tags.includes(t))}>{t}</button>)}
          </div>
        </div>
        {/* メール・電話番号 */}
        <div style={{ marginBottom: 12, background: "#F9F9F7", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 10, color: "#888780", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>連絡先（管理者のみ）</div>
          <div style={{ fontSize: 13, color: "#2C2C2A", marginBottom: 4 }}>📧 {app.email || "未登録"}</div>
          <div style={{ fontSize: 13, color: "#2C2C2A" }}>📞 {app.phone || "未登録"}</div>
        </div>
        {/* 自己紹介 */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>自己紹介</label>
          <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} style={{ ...inputStyle, resize: "none" }} />
        </div>

        {/* 承認・却下ボタン（審査中のみ） */}
        {app.status === "pending" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button onClick={() => { onApprove(app.id, "approved"); onClose(); }} style={{ flex: 1, padding: "10px", background: "#EAF3DE", color: "#3B6D11", border: "0.5px solid #C0DD97", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>✓ 承認する</button>
            <button onClick={() => { onReject(app.id, "rejected"); onClose(); }} style={{ flex: 1, padding: "10px", background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>✗ 却下する</button>
          </div>
        )}

        <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: 12, background: saving ? "#999" : "#0E2A45", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "保存中..." : "変更を保存する"}
        </button>
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
      {req.admin_reply && <div style={{ fontSize: 12, color: "#5F5E5A", background: "#F9F9F7", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>📋 メモ: {req.admin_reply}</div>}
      {!isCompleted && onMemo && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: "#888780", marginBottom: 4 }}>メモ</div>
          <textarea rows={2} placeholder="内部メモを入力..." value={memoText} onChange={(e) => setMemoText(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none", resize: "none", marginBottom: 6 }} />
          <button onClick={() => onMemo(req.id, memoText)} style={{ width: "100%", padding: "7px", background: "#F1EFE8", color: "#5F5E5A", border: "0.5px solid #D3D1C7", borderRadius: 8, fontSize: 12, cursor: "pointer", marginBottom: 6 }}>
            メモを保存
          </button>
        </div>
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
  const [tab, setTab]             = useState<"applications" | "requests" | "done" | "areas" | "tags">("applications");
  const [apps, setApps]           = useState<Application[]>([]);
  const [reqs, setReqs]           = useState<Request[]>([]);
  const [tagList, setTagList]     = useState<{ id: string; name: string }[]>([]);
  const [areaList, setAreaList]   = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag]       = useState("");
  const [newArea, setNewArea]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [doneSort, setDoneSort]   = useState<"date" | "name">("date");
  const [doneSearch, setDoneSearch] = useState("");

  async function loadData() {
    setLoading(true);
    const [{ data: a }, { data: r }, { data: t }, { data: ar }] = await Promise.all([
      supabase.from("dealer_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("requests").select("*").order("created_at", { ascending: false }),
      supabase.from("tags").select("*").order("name"),
      supabase.from("areas").select("*").order("name"),
    ]);
    setApps(a || []);
    setReqs(r || []);
    setTagList(t || []);
    setAreaList(ar || []);
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
    setSelectedApp((prev) => prev && prev.id === id ? { ...prev, photo_visible: !current } : prev);
  }

  async function saveDealer(id: string, data: Partial<Application>, photoFile?: File) {
    let photo_url = apps.find((a) => a.id === id)?.photo_url;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(fileName, photoFile, { contentType: photoFile.type });
      if (!error) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }
    }
    await supabase.from("dealer_applications").update({ ...data, photo_url }).eq("id", id);
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, ...data, photo_url } : a));
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

  async function addArea() {
    const name = newArea.trim();
    if (!name) return;
    const { data } = await supabase.from("areas").insert({ name }).select().single();
    if (data) setAreaList((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setNewArea("");
  }

  async function deleteArea(id: string) {
    await supabase.from("areas").delete().eq("id", id);
    setAreaList((prev) => prev.filter((a) => a.id !== id));
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
  const filteredDoneReqs = completedReqs
    .filter((r) => !doneSearch || r.dealer_name.includes(doneSearch) || r.location.includes(doneSearch) || r.email.includes(doneSearch))
    .sort((a, b) => doneSort === "name" ? a.dealer_name.localeCompare(b.dealer_name) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const areaNames = areaList.map((a) => a.name);

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 40 }}>
      {selectedApp && (
        <DealerEditModal
          app={selectedApp}
          tagOptions={tagList.map((t) => t.name)}
          areaOptions={areaNames.length > 0 ? areaNames : ["大阪市内", "神戸市内", "京都市内", "堺市", "尼崎市", "西宮市", "奈良市", "和歌山市"]}
          onClose={() => setSelectedApp(null)}
          onSave={saveDealer}
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
          { key: "areas",        label: `エリア管理` },
          { key: "tags",         label: `タグ管理` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key as typeof tab)} style={{ flex: 1, padding: "12px 6px", fontSize: 11, whiteSpace: "nowrap", fontWeight: tab === key ? 500 : 400, color: tab === key ? "#0E2A45" : "#888780", background: "none", border: "none", borderBottom: tab === key ? "2px solid #0E2A45" : "2px solid transparent", cursor: "pointer" }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "12px" }}>
        {loading && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>読み込み中...</div>}

        {/* 申請タブ */}
        {!loading && tab === "applications" && (
          <div>
            {pendingApps.length === 0 && approvedApps.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>申請はありません</div>}
            {pendingApps.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>審査中</div>
                {pendingApps.map((app) => (
                  <div key={app.id} style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10, cursor: "pointer" }} onClick={() => setSelectedApp(app)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {app.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={app.photo_url} alt={app.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "0.5px solid #D3D1C7" }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 6, background: "#F0F0F0", border: "0.5px solid #D3D1C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="4" fill="#CCC" /><ellipse cx="10" cy="16" rx="7" ry="4" fill="#CCC" /></svg>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: "#0E2A45", textDecoration: "underline" }}>{app.name}</div>
                          <div style={{ fontSize: 11, color: "#5F5E5A" }}>経験{app.experience_years}年 ・ ¥{app.hourly_rate.toLocaleString()}/h</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#FAEEDA", color: "#633806", fontWeight: 500 }}>審査中</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#888780", marginTop: 6 }}>📅 {formatDate(app.created_at)} · タップして編集・承認</div>
                  </div>
                ))}
              </>
            )}

            {approvedApps.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: ".06em", textTransform: "uppercase", margin: "16px 0 8px" }}>承認済みディーラー</div>
                {approvedApps.map((app) => (
                  <div key={app.id} style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 10, opacity: app.is_active ? 1 : 0.6 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                      <div onClick={() => setSelectedApp(app)} style={{ cursor: "pointer", flexShrink: 0 }}>
                        {app.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={app.photo_url} alt={app.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "0.5px solid #D3D1C7", opacity: app.photo_visible ? 1 : 0.3 }} />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#F0F0F0", border: "0.5px solid #D3D1C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" fill="#CCC" /><ellipse cx="12" cy="19" rx="8" ry="5" fill="#CCC" /></svg>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelectedApp(app)}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#0E2A45", textDecoration: "underline" }}>{app.name}</div>
                        <div style={{ fontSize: 11, color: "#5F5E5A" }}>経験{app.experience_years}年 ・ ¥{app.hourly_rate.toLocaleString()}/h ・ {VENUE_LABEL[app.venue_type]}</div>
                        <div style={{ fontSize: 10, color: "#888780", marginTop: 2 }}>タップして編集</div>
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
            <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "12px", marginBottom: 12 }}>
              <input type="text" placeholder="ディーラー名・場所・メールで検索..." value={doneSearch}
                onChange={(e) => setDoneSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none", marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setDoneSort("date")} style={{ flex: 1, padding: "6px", fontSize: 12, borderRadius: 8, border: "0.5px solid", background: doneSort === "date" ? "#0E2A45" : "transparent", color: doneSort === "date" ? "#fff" : "#5F5E5A", borderColor: doneSort === "date" ? "#0E2A45" : "#D3D1C7", cursor: "pointer" }}>日付順</button>
                <button onClick={() => setDoneSort("name")} style={{ flex: 1, padding: "6px", fontSize: 12, borderRadius: 8, border: "0.5px solid", background: doneSort === "name" ? "#0E2A45" : "transparent", color: doneSort === "name" ? "#fff" : "#5F5E5A", borderColor: doneSort === "name" ? "#0E2A45" : "#D3D1C7", cursor: "pointer" }}>名前順</button>
              </div>
            </div>
            {filteredDoneReqs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888780" }}>完了済みの依頼はありません</div>}
            {filteredDoneReqs.map((req) => <RequestCard key={req.id} req={req} onRestore={restoreRequest} />)}
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

        {/* エリア管理タブ */}
        {!loading && tab === "areas" && (
          <div>
            <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 10 }}>エリアを追加</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" placeholder="新しいエリア名" value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addArea()}
                  style={{ flex: 1, padding: "8px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid #D3D1C7", outline: "none" }} />
                <button onClick={addArea} style={{ padding: "8px 16px", background: "#0E2A45", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>追加</button>
              </div>
            </div>
            <div style={{ background: "#fff", border: "0.5px solid #D3D1C7", borderRadius: 12, padding: "14px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2C2A", marginBottom: 10 }}>登録済みエリア（{areaList.length}件）</div>
              {areaList.length === 0 && <div style={{ fontSize: 13, color: "#888780" }}>エリアがありません</div>}
              {areaList.map((area) => (
                <div key={area.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #F1EFE8" }}>
                  <span style={{ fontSize: 13, color: "#2C2C2A" }}>{area.name}</span>
                  <button onClick={() => deleteArea(area.id)} style={{ padding: "4px 10px", background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F09595", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>削除</button>
                </div>
              ))}
            </div>
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
