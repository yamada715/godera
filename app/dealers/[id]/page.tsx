import Link from "next/link";
import { notFound } from "next/navigation";
import { DEALERS, VENUE_LABEL } from "@/lib/dealers";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

const VENUE_STYLE: Record<string, { bg: string; color: string }> = {
  home:      { bg: "#F5F5F5", color: "#333333" },
  amusement: { bg: "#EFEFEF", color: "#333333" },
  both:      { bg: "#E8E8E8", color: "#333333" },
};

export async function generateStaticParams() {
  return DEALERS.map((d) => ({ id: d.id }));
}

export default async function DealerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dealer = DEALERS.find((d) => d.id === id);
  if (!dealer) notFound();

  const { bg, color } = VENUE_STYLE[dealer.venueType] || VENUE_STYLE.both;

  return (
    <main style={{ minHeight: "100dvh", background: "#F8F8F8", paddingBottom: 40 }}>
      {/* ヘッダー */}
      <header style={{
        background: BLACK,
        padding: "12px 16px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <Link href="/dealers" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 2,
          background: "#1A1A1A", color: WHITE, textDecoration: "none", fontSize: 16,
          border: "0.5px solid #333",
        }} aria-label="一覧に戻る">‹</Link>
        <span style={{ fontSize: 11, fontWeight: 400, color: WHITE, letterSpacing: 3, textTransform: "uppercase" }}>Profile</span>
        <div style={{ width: 32 }} />
      </header>

      <div style={{ padding: "16px" }}>
        {/* 上部: 写真 + 名前 */}
        <div style={{
          background: WHITE, border: "0.5px solid #E8E8E8",
          borderRadius: 2, padding: "16px", marginBottom: 12,
          display: "flex", gap: 16, alignItems: "flex-start",
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: 2, flexShrink: 0,
            background: "#F0F0F0", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "0.5px solid #E8E8E8",
          }}>
            {dealer.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dealer.photoUrl} alt={dealer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="16" r="10" fill="#CCCCCC" />
                <ellipse cx="22" cy="36" rx="16" ry="9" fill="#CCCCCC" />
              </svg>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 18, fontWeight: 400, color: BLACK, marginBottom: 6, letterSpacing: 1 }}>{dealer.name}</h1>
            <div style={{ fontSize: 22, fontWeight: 300, color: BLACK, marginBottom: 4 }}>
              ¥{dealer.hourlyRate.toLocaleString()}<span style={{ fontSize: 12, color: GRAY3, fontWeight: 400 }}> / hour</span>
            </div>
            <span style={{
              display: "inline-block", fontSize: 9, padding: "2px 8px",
              borderRadius: 1, background: bg, color, letterSpacing: 2, textTransform: "uppercase",
            }}>
              {VENUE_LABEL[dealer.venueType]}
            </span>
            <p style={{ fontSize: 11, color: GRAY3, marginTop: 6 }}>
              {dealer.completedJobs} jobs · {dealer.experienceYears} years exp
            </p>
          </div>
        </div>

        {/* 紹介 */}
        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 400, color: GRAY3, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>About</div>
          <p style={{ fontSize: 13, color: BLACK, lineHeight: 1.8 }}>{dealer.bio}</p>
        </div>

        {/* スペック */}
        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 400, color: GRAY3, letterSpacing: ".1em", textTransform: "uppercase", padding: "14px 16px 8px" }}>Specs</div>
          {[
            { label: "Games",  value: dealer.gameTypes.join(" · ") },
            { label: "Areas",  value: dealer.areas.join(" · ") },
            { label: "Venue",  value: VENUE_LABEL[dealer.venueType] },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 16px",
              borderTop: "0.5px solid #F0F0F0",
              fontSize: 13,
            }}>
              <span style={{ color: GRAY3, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
              <span style={{ color: BLACK, textAlign: "right", maxWidth: "60%" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* タグ */}
        <div style={{ background: WHITE, border: "0.5px solid #E8E8E8", borderRadius: 2, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 400, color: GRAY3, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>Tags</div>
          {dealer.tags.map((tag) => (
            <span key={tag} style={{
              display: "inline-block", fontSize: 11, padding: "3px 10px",
              borderRadius: 1, background: "#F5F5F5", color: "#333",
              border: "0.5px solid #E8E8E8", marginRight: 6, marginTop: 6, letterSpacing: 1,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* 依頼ボタン */}
        <Link href={"/dealers/" + dealer.id + "/request"} style={{
          display: "block", padding: 16,
          background: BLACK, color: WHITE,
          borderRadius: 2, fontSize: 12, fontWeight: 400,
          textAlign: "center", textDecoration: "none",
          letterSpacing: 3, textTransform: "uppercase",
        }}>
          Book This Dealer
        </Link>
      </div>
    </main>
  );
}
