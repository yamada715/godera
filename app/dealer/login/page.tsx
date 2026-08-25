"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";
const GRAY3 = "#999999";

export default function DealerLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    if (!email || !password) { setError("メールアドレスとパスワードを入力してください"); return; }
    setLoading(true);
    setError("");

    const { data, error: err } = await supabase
      .from("dealer_applications")
      .select("*")
      .eq("email", email)
      .eq("password_hash", password)
      .single();

    setLoading(false);

    if (err || !data) {
      setError("メールアドレスまたはパスワードが違います");
      return;
    }

    if (data.status !== "approved") {
      setError("まだ承認されていません。管理者の承認をお待ちください。");
      return;
    }

    // セッションをlocalStorageに保存
    localStorage.setItem("dealer_id", data.id);
    localStorage.setItem("dealer_name", data.name);
    router.push("/dealer/profile");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", fontSize: 14,
    borderRadius: 2, border: "0.5px solid #E8E8E8",
    background: "#fff", color: BLACK, outline: "none",
  };

  return (
    <main style={{ minHeight: "100dvh", background: BLACK, display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "28px 20px 16px" }}>
        <div style={{ fontSize: 22, fontWeight: 300, color: WHITE, letterSpacing: 6, textTransform: "uppercase" }}>GODILLA</div>
        <div style={{ fontSize: 10, color: GRAY3, marginTop: 3, letterSpacing: 3 }}>ディーラーログイン</div>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px 40px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ background: "#111", border: "0.5px solid #2A2A2A", borderRadius: 2, padding: "28px 24px" }}>
            <h1 style={{ fontSize: 16, fontWeight: 400, color: WHITE, marginBottom: 24, letterSpacing: 2 }}>ログイン</h1>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, color: GRAY3, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>メールアドレス</label>
              <input type="email" placeholder="example@gmail.com" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={inputStyle} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 10, color: GRAY3, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>パスワード</label>
              <input type="password" placeholder="パスワード" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: "#1A0000", border: "0.5px solid #5A0000", borderRadius: 2, padding: "10px 12px", marginBottom: 16, fontSize: 13, color: "#FF6B6B" }}>
                {error}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading} style={{
              width: "100%", padding: 14, background: loading ? "#333" : WHITE,
              color: BLACK, border: "none", borderRadius: 2,
              fontSize: 13, cursor: loading ? "not-allowed" : "pointer", letterSpacing: 1,
            }}>
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link href="/apply" style={{ fontSize: 12, color: GRAY3, textDecoration: "none", letterSpacing: 1 }}>
              まだ登録していない方はこちら →
            </Link>
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Link href="/" style={{ fontSize: 12, color: "#444", textDecoration: "none", letterSpacing: 1 }}>
              ← トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
