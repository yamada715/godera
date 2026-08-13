// ─── 型定義 ──────────────────────────────────────────────────────────────────

export type VenueType = "home" | "amusement" | "both";

export interface Dealer {
  id: string;
  name: string;
  avatarInitial: string;
  avatarColor: string;
  experienceYears: number;
  gameTypes: string[];
  areas: string[];
  venueType: VenueType;
  tags: string[];
  bio: string;
  completedJobs: number;
  photoUrl?: string; // Supabase Storage の URL が入る予定
  isActive: boolean;
}

// ─── 定数 ────────────────────────────────────────────────────────────────────

export const VENUE_LABEL: Record<VenueType, string> = {
  home:      "個人宅",
  amusement: "アミューズ",
  both:      "両方対応",
};

export const VENUE_STYLE: Record<VenueType, { bg: string; color: string }> = {
  home:      { bg: "#FBEAF0", color: "#72243E" },
  amusement: { bg: "#FAEEDA", color: "#633806" },
  both:      { bg: "#E6F1FB", color: "#0C447C" },
};

// ─── ディーラーデータ（管理者が手動で追加していく） ─────────────────────────
// 本番: Supabase から取得
// import { createClient } from "@/lib/supabase/server";
// const { data } = await createClient()
//   .from("dealer_profiles")
//   .select("*")
//   .eq("is_active", true);

export const DEALERS: Dealer[] = [
  {
    id: "1",
    name: "田中 颯太",
    avatarInitial: "田",
    avatarColor: "#B5D4F4",
    experienceYears: 5,
    gameTypes: ["Texas Hold'em", "Omaha"],
    areas: ["大阪市内", "神戸市内"],
    venueType: "both",
    tags: ["個人宅歓迎", "英語可", "深夜対応"],
    bio: "アミューズメント施設での経験5年。Texas Hold'em・Omahaどちらも対応可能です。丁寧な進行と明るい雰囲気作りが得意です。",
    completedJobs: 42,
    isActive: true,
  },
  {
    id: "2",
    name: "山本 彩",
    avatarInitial: "山",
    avatarColor: "#CECBF6",
    experienceYears: 3,
    gameTypes: ["Texas Hold'em"],
    areas: ["大阪市内", "京都市内"],
    venueType: "home",
    tags: ["個人宅専門", "初心者歓迎", "土日対応"],
    bio: "個人宅ゲームを中心に活動。初心者の方へのルール説明から丁寧に対応します。",
    completedJobs: 24,
    isActive: true,
  },
  {
    id: "3",
    name: "鈴木 大輝",
    avatarInitial: "鈴",
    avatarColor: "#F5C4B3",
    experienceYears: 2,
    gameTypes: ["Texas Hold'em", "PLO"],
    areas: ["大阪市内"],
    venueType: "amusement",
    tags: ["アミューズ経験あり", "平日対応", "PLO対応"],
    bio: "アミューズメント施設でのディーリング経験2年。PLOも対応可能です。",
    completedJobs: 15,
    isActive: true,
  },
  {
    id: "4",
    name: "中村 花",
    avatarInitial: "中",
    avatarColor: "#F4C0D1",
    experienceYears: 4,
    gameTypes: ["Texas Hold'em", "Short Deck"],
    areas: ["大阪市内", "神戸市内", "京都市内"],
    venueType: "both",
    tags: ["Short Deck対応", "関西全域", "個人宅歓迎"],
    bio: "Short Deckに強みがあります。関西全域対応可能。",
    completedJobs: 31,
    isActive: true,
  },
];
