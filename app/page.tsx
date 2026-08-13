// app/page.tsx  ← トップ検索画面（ごでら）
// ─────────────────────────────────────────────────────────────────────────────
// 画面構成:
//   - ヘッダー（ロゴ）
//   - 条件指定フォーム（エリア・日時・種別・ゲーム・キーワード）
//   - 「ディーラーを検索」ボタン → /dealers へ遷移
//   - 「今すぐ呼べるディーラー」ボタン → /dealers へ遷移
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

const NAVY   = "#0E2A45";
const PANEL  = "#163B5E";
const BORDER = "#1E5280";
const MUTED  = "#6FA3C8";
const ICON   = "#1A4A72";
const ACCENT = "#F5A623";

export default function TopPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: NAVY,
        paddingBottom: 40,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          padding: "18px 16px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: 500, color: "#fff", letterSpacing: -0.5 }}>
            ごでら
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
            ポーカーディーラー予約
          </div>
        </div>
      </header>

      {/* バナー */}
      <div
        style={{
          margin: "0 12px 16px",
          borderRadius: 12,
          background: "#1A4A72",
          padding: "14px 16px",
          border: `0.5px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 18,
          }}
        >
          🃏
        </div>
        <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.5 }}>
          <span style={{ color: ACCENT, fontWeight: 500 }}>4名のディーラー</span>
          が在籍中。今すぐ予約できます。
        </div>
      </div>

      {/* 検索フォームカード */}
      <div
        style={{
          margin: "0 12px",
          background: PANEL,
          borderRadius: 16,
          border: `0.5px solid ${BORDER}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#A8C8E0",
            padding: "14px 14px 4px",
          }}
        >
          条件を指定して検索
        </div>

        {/* 各行 */}
        {[
          { icon: "📍", label: "エリア",     placeholder: "大阪市内" },
          { icon: "📅", label: "日時",       placeholder: "日付・時間を選ぶ" },
          { icon: "🏠", label: "種別",       placeholder: "すべての種別" },
          { icon: "🃏", label: "ゲーム",     placeholder: "すべてのゲーム" },
          { icon: "🔍", label: "キーワード", placeholder: "名前・特徴で検索" },
        ].map(({ icon, label, placeholder }, i, arr) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 14px",
              borderBottom: i < arr.length - 1 ? `0.5px solid #1A4A72` : "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: ICON,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 15,
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 1 }}>{label}</div>
              <div style={{ fontSize: 14, color: "#4A7A9B" }}>{placeholder}</div>
            </div>
            <span style={{ fontSize: 14, color: "#2E6A9A" }}>›</span>
          </div>
        ))}

        {/* 検索ボタン */}
        <Link
          href="/dealers"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            margin: "14px",
            padding: "13px",
            background: ACCENT,
            color: NAVY,
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          🔍 ディーラーを検索
        </Link>
      </div>

      {/* 今すぐ呼ぶボタン */}
      <Link
        href="/dealers"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "16px",
          fontSize: 14,
          color: ACCENT,
          textDecoration: "none",
        }}
      >
        ⚡ 今すぐ呼べるディーラーはこちら
      </Link>
    </main>
  );
}
