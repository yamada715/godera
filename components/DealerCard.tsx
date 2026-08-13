// components/DealerCard.tsx
// 2×2グリッドの1枚のカード（上:写真 / 下:名前・情報）

import Link from "next/link";
import type { Dealer } from "@/lib/dealers";
import { VENUE_LABEL, VENUE_STYLE } from "@/lib/dealers";

export function DealerCard({ dealer }: { dealer: Dealer }) {
  const { bg, color } = VENUE_STYLE[dealer.venueType];

  return (
    <Link
      href={`/dealers/${dealer.id}`}
      style={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        border: "0.5px solid #D3D1C7",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
      }}
      aria-label={`${dealer.name}の詳細を見る`}
    >
      {/* 上: 写真 or イニシャル */}
      <div
        style={{
          width: "100%",
          height: 90,
          background: dealer.avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 500,
          color: "#2C2C2A",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {dealer.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dealer.photoUrl}
            alt={dealer.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          dealer.avatarInitial
        )}
      </div>

      {/* 仕切り線 */}
      <div style={{ height: "0.5px", background: "#D3D1C7", flexShrink: 0 }} />

      {/* 下: テキスト情報 */}
      <div style={{ padding: "8px 10px 10px", background: "#FFFFFF" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#2C2C2A",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 2,
          }}
        >
          {dealer.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#5F5E5A",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          経験{dealer.experienceYears}年 ・ {dealer.areas[0]}
          {dealer.areas.length > 1 ? "ほか" : ""}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#5F5E5A",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginTop: 1,
          }}
        >
          {dealer.gameTypes.join(" / ")}
        </div>
        <span
          style={{
            display: "inline-block",
            fontSize: 10,
            padding: "2px 7px",
            borderRadius: 20,
            background: bg,
            color,
            fontWeight: 500,
            marginTop: 4,
          }}
        >
          {VENUE_LABEL[dealer.venueType]}
        </span>
      </div>
    </Link>
  );
}
