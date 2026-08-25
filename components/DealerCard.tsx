import Link from "next/link";
import { type Dealer, VENUE_LABEL } from "@/lib/dealers";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

const VENUE_STYLE: Record<string, { bg: string; color: string }> = {
  home:      { bg: "#F5F5F5", color: "#333333" },
  amusement: { bg: "#EFEFEF", color: "#333333" },
  both:      { bg: "#E8E8E8", color: "#333333" },
};

export function DealerCard({ dealer }: { dealer: Dealer }) {
  const { bg, color } = VENUE_STYLE[dealer.venueType] || VENUE_STYLE.both;

  return (
    <Link
      href={`/dealers/${dealer.id}`}
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        background: WHITE,
        border: "0.5px solid #E8E8E8",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
      }}
      aria-label={`${dealer.name}の詳細を見る`}
    >
      {/* 左: 写真エリア */}
      <div style={{
        width: 72, flexShrink: 0,
        background: "#F0F0F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        borderRight: "0.5px solid #E8E8E8",
      }}>
        {dealer.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dealer.photoUrl} alt={dealer.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="12" r="7" fill="#CCCCCC" />
            <ellipse cx="16" cy="26" rx="11" ry="7" fill="#CCCCCC" />
          </svg>
        )}
      </div>

      {/* 右: テキスト情報 */}
      <div style={{
        flex: 1, padding: "10px 10px",
        display: "flex", flexDirection: "column", gap: 2, minWidth: 0,
      }}>
        <div style={{
          fontSize: 13, fontWeight: 500, color: BLACK,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {dealer.name}
        </div>

        <div style={{ fontSize: 13, fontWeight: 400, color: BLACK }}>
          ¥{dealer.hourlyRate.toLocaleString()}<span style={{ fontSize: 10, color: GRAY3 }}> / h</span>
        </div>

        <span style={{
          display: "inline-block", fontSize: 9, padding: "1px 6px",
          borderRadius: 1, background: bg, color,
          alignSelf: "flex-start", letterSpacing: 1,
          textTransform: "uppercase",
        }}>
          {VENUE_LABEL[dealer.venueType]}
        </span>

        <div style={{ fontSize: 11, color: GRAY3, marginTop: 1 }}>
          {dealer.experienceYears}年経験
        </div>

        <div style={{
          fontSize: 11, color: GRAY3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {dealer.gameTypes.join(" · ")}
        </div>

        <div style={{
          fontSize: 11, color: GRAY3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {dealer.areas[0]}{dealer.areas.length > 1 ? "ほか" : ""}
        </div>
      </div>
    </Link>
  );
}
