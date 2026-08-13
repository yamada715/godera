import Link from "next/link";
import { type Dealer, VENUE_LABEL, VENUE_STYLE } from "@/lib/dealers";

export function DealerCard({ dealer }: { dealer: Dealer }) {
  const { bg, color } = VENUE_STYLE[dealer.venueType];

  return (
    <Link
      href={`/dealers/${dealer.id}`}
      style={{
        textDecoration: "none", display: "flex", flexDirection: "row",
        background: "#FFFFFF", border: "0.5px solid #D3D1C7",
        borderRadius: 12, overflow: "hidden", cursor: "pointer",
      }}
      aria-label={`${dealer.name}の詳細を見る`}
    >
      {/* 左: 写真エリア */}
      <div style={{
        width: 76, flexShrink: 0, background: dealer.avatarColor,
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        {dealer.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dealer.photoUrl} alt={dealer.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="14" r="8" fill="#fff" fillOpacity="0.5" />
            <ellipse cx="18" cy="30" rx="13" ry="8" fill="#fff" fillOpacity="0.5" />
          </svg>
        )}
      </div>

      {/* 右: テキスト情報 */}
      <div style={{
        flex: 1, padding: "10px 10px", display: "flex",
        flexDirection: "column", gap: 2, minWidth: 0,
      }}>
        {/* 名前 */}
        <div style={{
          fontSize: 13, fontWeight: 500, color: "#2C2C2A",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {dealer.name}
        </div>

        {/* 時給 */}
        <div style={{ fontSize: 13, fontWeight: 500, color: "#0E2A45" }}>
          ¥{dealer.hourlyRate.toLocaleString()}<span style={{ fontSize: 10, color: "#888780", fontWeight: 400 }}> / 時間</span>
        </div>

        {/* 種別バッジ */}
        <span style={{
          display: "inline-block", fontSize: 10, padding: "1px 6px",
          borderRadius: 20, background: bg, color, fontWeight: 500,
          alignSelf: "flex-start",
        }}>
          {VENUE_LABEL[dealer.venueType]}
        </span>

        {/* 経験年数 */}
        <div style={{ fontSize: 11, color: "#5F5E5A" }}>
          経験{dealer.experienceYears}年 ・ 完了{dealer.completedJobs}件
        </div>

        {/* ゲーム */}
        <div style={{
          fontSize: 11, color: "#5F5E5A",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {dealer.gameTypes.join(" / ")}
        </div>

        {/* エリア */}
        <div style={{
          fontSize: 11, color: "#5F5E5A",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {dealer.areas.join(" / ")}
        </div>
      </div>
    </Link>
  );
}
