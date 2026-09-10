import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ログイン
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data } = await supabase
    .from("dealer_applications")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) {
    return NextResponse.json({ success: false, message: "メールアドレスまたはパスワードが違います" }, { status: 401 });
  }

  if (data.status !== "approved") {
    return NextResponse.json({ success: false, message: "まだ承認されていません" }, { status: 403 });
  }

  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) {
    return NextResponse.json({ success: false, message: "メールアドレスまたはパスワードが違います" }, { status: 401 });
  }

  return NextResponse.json({ success: true, id: data.id, name: data.name });
}

// 登録（パスワードハッシュ化）
export async function PUT(req: NextRequest) {
  const { email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);
  return NextResponse.json({ hash });
}