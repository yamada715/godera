// app/dealers/[id]/page.tsx  ← ディーラー詳細画面
// ─────────────────────────────────────────────────────────────────────────────
// - /dealers/[id] にアクセスすると表示
// - 大きな写真 → 氏名・バッジ → 紹介文 → スペック表 → タグ → 依頼ボタン
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { notFound } from "next/navigation";
import { DEALERS, VENUE_LABEL, VENUE_STYLE } from "@/lib/dealers";

// 本番: Supabase から取得に差し替え
// import { createClient } from "@/lib/supabase/server";
// async function getDealer(id: string) {
//   const { data } = await createClient()
//     .from("dealer_profiles")
//     .select("*")
//     .eq("id", id)
//     .single();
//   return data;
// }

export default async function DealerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 本番: const dealer = await getDealer(params.id);
  const dealer = DEALERS.find((d) => d.id === params.id);
  if (!dealer) notFound();

  const { bg, color } = VENUE_STYLE[dealer.venueType];

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 40 }}>

      {/* ヘッダー */}
      <header
        style={{
          background: "#FFFFFF",
          borderBottom: "0.5px solid #D3D1C7",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          href="/dealers"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#0E2A45",
            color: "#fff",
            textDecoration: "none",
            fontSize: 16,
          }}
          aria-label="一覧に戻る"
        >
          ‹
        </Link>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#2C2C2A" }}>
          プロフィール
        </span>
        <div style={{ width: 32 }} />
      </header>

      {/* 写真（大） */}
      <div
        style={{
          width: "100%",
          height: 200,
          background: dealer.avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 500,
          color: "#2C2C2A",
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

      {/* 本文 */}
      <div style={{ padding: "16px 16px 0" }}>

        {/* 氏名 + バッジ */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#2C2C2A" }}>
            {dealer.name}
          </h1>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 20,
              background: bg,
              color,
              fontWeight: 500,
            }}
          >
            {VENUE_LABEL[dealer.venueType]}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "#888780", marginTop: 4 }}>
          完了件数 {dealer.completedJobs}件
        </p>

        {/* 紹介 */}
        <section style={{ marginTop: 20 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#888780",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            紹介
          </p>
          <p style={{ fontSize: 14, color: "#2C2C2A", lineHeight: 1.75 }}>
            {dealer.bio}
          </p>
        </section>

        {/* スペック */}
        <section style={{ marginTop: 20 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#888780",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            スペック
          </p>
          <div
            style={{
              background: "#FFFFFF",
              border: "0.5px solid #D3D1C7",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              { label: "経験年数",   value: `${dealer.experienceYears}年` },
              { label: "対応ゲーム", value: dealer.gameTypes.join(" / ") },
              { label: "対応エリア", value: dealer.areas.join(" / ") },
              { label: "対応種別",   value: VENUE_LABEL[dealer.venueType] },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 14px",
                  borderBottom: i < arr.length - 1 ? "0.5px solid #F1EFE8" : "none",
                  fontSize: 13,
                  gap: 12,
                }}
              >
                <span style={{ color: "#888780", flexShrink: 0 }}>{label}</span>
                <span style={{ color: "#2C2C2A", textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* タグ */}
        <section style={{ marginTop: 20 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#888780",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            特徴
          </p>
          <div>
            {dealer.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  padding: "2px 7px",
                  borderRadius: 20,
                  background: "#F1EFE8",
                  color: "#5F5E5A",
                  border: "0.5px solid #D3D1C7",
                  marginRight: 4,
                  marginTop: 4,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* 依頼ボタン（次のステップで /dealers/[id]/request を作る） */}
        <Link
          href={`/dealers/${dealer.id}/request`}
          style={{
            display: "block",
            marginTop: 28,
            padding: 15,
            background: "#0E2A45",
            color: "#FFFFFF",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          このディーラーに依頼する
        </Link>
      </div>
    </main>
  );
}
