import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { VENUE_LABEL, type DealerRow } from "@/lib/supabase";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

async function getDealer(id: string): Promise<DealerRow | null> {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await supabase.from("dealer_applications").select("*").eq("id", id).eq("status", "approved").single();
  return data;
}

export default async function DealerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dealer = await getDealer(id);
  if (!dealer) notFound();

  return (
    <main style={{ minHeight: "100dvh", background: "#F8F8F8", paddingBottom: 40 }}>
      <header style={{ background: BLACK, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/dealers" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 2, background: "#1A1A1A", color: WHITE, textDecoration: "none", fontSize: 16, border: "0.5px solid #333" }}>‹</Link>
        <span style={{ fontSize: 11, fontWeight: 400, color: WHITE, letterSpacing: 2 }}>プロフィール</span>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: "16px" }}>
        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "16px", marginBottom: 12, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 88, height: 88, borderRadius: 2, flexShrink: 0, background: "#F0F0F0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "0.5px solid #E8E8E8" }}>
            {dealer.photo_url && dealer.photo_visible ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dealer.photo_url} alt={dealer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="16" r="10" fill="#CCCCCC" /><ellipse cx="22" cy="36" rx="16" ry="9" fill="#CCCCCC" /></svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 18, fontWeight: 400, color: BLACK, marginBottom: 6 }}>{dealer.name}</h1>
            <div style={{ fontSize: 22, fontWeight: 300, color: BLACK, marginBottom: 4 }}>
              ¥{dealer.hourly_rate.toLocaleString()}<span style={{ fontSize: 12, color: GRAY3, fontWeight: 400 }}> / 時間</span>
            </div>
            <span style={{ display: "inline-block", fontSize: 9, padding: "2px 8px", borderRadius: 1, background: "#F5F5F5", color: "#333", letterSpacing: 1 }}>{VENUE_LABEL[dealer.venue_type]}</span>
            <p style={{ fontSize: 11, color: GRAY3, marginTop: 6 }}>経験{dealer.experience_years}年</p>
          </div>
        </div>

        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>自己紹介</div>
          <p style={{ fontSize: 13, color: BLACK, lineHeight: 1.8 }}>{dealer.bio}</p>
        </div>

        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 1, textTransform: "uppercase", padding: "14px 16px 8px" }}>スペック</div>
          {[
            { label: "対応ゲーム", value: dealer.game_types.join(" · ") },
            { label: "対応エリア", value: dealer.areas.join(" · ") },
            { label: "対応種別",   value: VENUE_LABEL[dealer.venue_type] },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderTop: "0.5px solid #F0F0F0", fontSize: 13 }}>
              <span style={{ color: GRAY3, fontSize: 11 }}>{label}</span>
              <span style={{ color: BLACK, textAlign: "right", maxWidth: "60%" }}>{value}</span>
            </div>
          ))}
        </div>

        {dealer.tags && dealer.tags.length > 0 && (
          <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: GRAY3, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>特徴</div>
            {dealer.tags.map((tag) => (
              <span key={tag} style={{ display: "inline-block", fontSize: 11, padding: "3px 10px", borderRadius: 1, background: "#F5F5F5", color: "#333", border: "0.5px solid #E8E8E8", marginRight: 6, marginTop: 6 }}>{tag}</span>
            ))}
          </div>
        )}

        <Link href={`/dealers/${dealer.id}/request`} style={{ display: "block", padding: 16, background: BLACK, color: WHITE, borderRadius: 2, fontSize: 13, fontWeight: 400, textAlign: "center", textDecoration: "none", letterSpacing: 1 }}>
          このディーラーに依頼する
        </Link>
      </div>
    </main>
  );
}
