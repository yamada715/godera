// app/dealers/page.tsx  ← ディーラー一覧（2×2グリッド）
// ─────────────────────────────────────────────────────────────────────────────
// - 2列グリッド、縦スクロールで全ディーラーを閲覧
// - 各カード: 上に写真 / 下に名前・経験・ゲーム・種別バッジ
// - タップで /dealers/[id] へ遷移
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { DEALERS } from "@/lib/dealers";
import { DealerCard } from "@/components/DealerCard";

// 本番: Supabase から取得に差し替え
// import { createClient } from "@/lib/supabase/server";
// async function getDealers() {
//   const { data } = await createClient()
//     .from("dealer_profiles")
//     .select("*")
//     .eq("is_active", true);
//   return data ?? [];
// }

export default async function DealersPage() {
  const dealers = DEALERS.filter((d) => d.isActive);

  return (
    <main style={{ minHeight: "100dvh", background: "#F1EFE8", paddingBottom: 32 }}>

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
          href="/"
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
          aria-label="トップに戻る"
        >
          ‹
        </Link>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: "#2C2C2A" }}>
            ディーラーを選ぶ
          </div>
          <div style={{ fontSize: 11, color: "#888780" }}>{dealers.length}名在籍中</div>
        </div>
        {/* 右側スペーサー（中央揃え用） */}
        <div style={{ width: 32 }} />
      </header>

      {/* 2×2 グリッド */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          padding: "12px 12px 0",
        }}
      >
        {dealers.map((dealer) => (
          <DealerCard key={dealer.id} dealer={dealer} />
        ))}
      </div>
    </main>
  );
}
