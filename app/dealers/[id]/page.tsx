import Link from "next/link";
import { notFound } from "next/navigation";
import { DEALERS, VENUE_LABEL, VENUE_STYLE } from "@/lib/dealers";

export async function generateStaticParams() {
  return DEALERS.map((d) => ({ id: d.id }));
}

export default async function DealerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dealer = DEALERS.find((d) => d.id === id);
  if (!dealer) notFound();
  const { bg, color } = VENUE_STYLE[dealer.venueType];

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 40 }}>
      <header style={{ background: "#FFFFFF", borderBottom: "0.5px solid #D3D1C7", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/dealers" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, background: "#0E2A45", color: "#fff", textDecoration: "none", fontSize: 16 }}>‹</Link>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>プロフィール</span>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ width: 90, height: 90, borderRadius: 12, flexShrink: 0, background: dealer.avatarColor, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {dealer.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dealer.photoUrl} alt={dealer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="18" r="11" fill="#fff" fillOpacity="0.5" />
                <ellipse cx="24" cy="40" rx="18" ry="10" fill="#fff" fillOpacity="0.5" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h1 style={{ fontSize: 20, fontWeight: 500, color: "#2C2C2A" }}>{dealer.name}</h1>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: bg, color, fontWeight: 500 }}>{VENUE_LABEL[dealer.venueType]}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#0E2A45", marginTop: 6 }}>
              ¥{dealer.hourlyRate.toLocaleString()}<span style={{ fontSize: 13, color: "#888780", fontWeight: 400 }}> / 時間</span>
            </div>
            <p style={{ fontSize: 12, color: "#888780", marginTop: 4 }}>完了件数 {dealer.completedJobs}件 ・ 経験{dealer.experienceYears}年</p>
            <div style={{ marginTop: 6 }}>
              {dealer.tags.slice(0, 2).map((tag) => (
                <span key={tag} style={{ display: "inline-block", fontSize: 10, padding: "2px 6px", borderRadius: 20, background: "#F1EFE8", color: "#5F5E5A", border: "0.5px solid #D3D1C7", marginRight: 4 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>紹介</p>
        <p style={{ fontSize: 14, color: "#2C2C2A", lineHeight: 1.75, marginBottom: 20 }}>{dealer.bio}</p>

        <p style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>スペック</p>
        <div style={{ background: "#FFFFFF", border: "0.5px solid #D3D1C7", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
          {[
            { label: "対応ゲーム", value: dealer.gameTypes.join(" / ") },
            { label: "対応エリア", value: dealer.areas.join(" / ") },
            { label: "対応種別",   value: VENUE_LABEL[dealer.venueType] },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", borderBottom: i < arr.length - 1 ? "0.5px solid #F1EFE8" : "none", fontSize: 13 }}>
              <span style={{ color: "#888780", flexShrink: 0 }}>{label}</span>
              <span style={{ color: "#2C2C2A", textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 500, color: "#888780", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>特徴</p>
        <div style={{ marginBottom: 28 }}>
          {dealer.tags.map((tag) => (
            <span key={tag} style={{ display: "inline-block", fontSize: 11, padding: "2px 7px", borderRadius: 20, background: "#F1EFE8", color: "#5F5E5A", border: "0.5px solid #D3D1C7", marginRight: 4, marginTop: 4 }}>{tag}</span>
          ))}
        </div>

        <Link href={"/dealers/" + dealer.id + "/request"} style={{ display: "block", padding: 15, background: "#0E2A45", color: "#FFFFFF", borderRadius: 12, fontSize: 15, fontWeight: 500, textAlign: "center", textDecoration: "none" }}>
          このディーラーに依頼する
        </Link>
      </div>
    </main>
  );
}