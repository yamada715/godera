import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── 型定義 ──────────────────────────────────────────────────────────────────

export type VenueType = "home" | "amusement" | "both";
export type GameType  = "NLH" | "Omaha" | "Stud" | "Draw" | "Hi-Lo";

export interface DealerRow {
  id: string;
  name: string;
  experience_years: number;
  game_types: GameType[];
  areas: string[];
  venue_type: VenueType;
  hourly_rate: number;
  bio: string;
  tags: string[];
  status: string;
  is_active: boolean;
  photo_url?: string;
  photo_visible: boolean;
  created_at: string;
}

export const VENUE_LABEL: Record<VenueType, string> = {
  home:      "個人宅",
  amusement: "アミューズ",
  both:      "両方対応",
};

export const GAME_TYPES: GameType[] = ["NLH", "Omaha", "Stud", "Draw", "Hi-Lo"];

export const AREAS = [
  "大阪市内", "神戸市内", "京都市内", "堺市",
  "尼崎市", "西宮市", "奈良市", "和歌山市",
];
