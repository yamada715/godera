// lib/dealers.ts

export type VenueType = "home" | "amusement" | "both";
export type GameType = "NLH" | "Omaha" | "Stud" | "Draw" | "Hi-Lo";

export interface Dealer {
  id: string;
  name: string;
  avatarInitial: string;
  avatarColor: string;
  experienceYears: number;
  gameTypes: GameType[];
  areas: string[];
  venueType: VenueType;
  tags: string[];
  bio: string;
  completedJobs: number;
  photoUrl?: string;
  isActive: boolean;
}

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

export const GAME_TYPES: GameType[] = ["NLH", "Omaha", "Stud", "Draw", "Hi-Lo"];

const AREAS = ["大阪市内", "神戸市内", "京都市内", "堺市", "尼崎市", "西宮市", "奈良市", "和歌山市"];
const VENUE_TYPES: VenueType[] = ["home", "amusement", "both"];
const COLORS = ["#B5D4F4","#CECBF6","#F5C4B3","#F4C0D1","#B5E8D4","#F5E6B3","#D4B5F4","#B5F4E8","#F4D4B5","#E8B5F4"];
const TAG_POOL = ["個人宅歓迎","英語可","深夜対応","初心者歓迎","土日対応","平日対応","関西全域","短期OK","長期歓迎","経験豊富","丁寧な進行","明るい雰囲気","女性歓迎","初回割引","アミューズ経験あり"];
const BIO_POOL = [
  "ポーカーディーラー歴{exp}年。丁寧な進行と明るい雰囲気作りが得意です。",
  "アミューズメント施設での経験{exp}年。どんなゲームも柔軟に対応します。",
  "個人宅ゲームを中心に活動。初心者の方へのサポートも丁寧に行います。",
  "ポーカー大会でのディーリング経験多数。スピーディで正確な進行が強みです。",
  "関西を中心に活動中。お客様に楽しんでいただけるよう全力でサポートします。",
  "経験{exp}年のベテランディーラー。あらゆるゲーム形式に対応可能です。",
  "ゲームの進行だけでなく、場の雰囲気作りも大切にしています。",
  "初心者から上級者まで、それぞれのレベルに合わせた対応が得意です。",
];

const FIRST_NAMES = ["颯太","彩","大輝","花","健太","美咲","翔","さくら","拓也","あかね","雄介","なな","直樹","ゆい","慎一","まい","康平","りな","浩二","えみ","達也","みく","正樹","あい","俊介","ひな","和也","もも","義則","ゆか","博之","れな","光雄","さき","剛志","まな","誠一","ちか","隆司","のぞみ"];
const LAST_NAMES = ["田中","山本","鈴木","中村","佐藤","高橋","伊藤","渡辺","加藤","小林","吉田","山田","松本","井上","木村","林","斎藤","清水","山口","阿部","池田","橋本","石川","前田","藤原","藤田","岡田","後藤","長谷川","石井","村上","近藤","坂本","遠藤","青木","藤井","西村","福田","岡本","三浦"];
const INITIALS = ["田","山","鈴","中","佐","高","伊","渡","加","小","吉","山","松","井","木","林","斎","清","山","阿","池","橋","石","前","藤","藤","岡","後","長","石","村","近","坂","遠","青","藤","西","福","岡","三"];

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export const DEALERS: Dealer[] = Array.from({ length: 40 }, (_, i) => {
  const exp = Math.floor(Math.random() * 8) + 1;
  const gameCount = Math.floor(Math.random() * 3) + 1;
  const games = pickRandom(GAME_TYPES, gameCount) as GameType[];
  const areaCount = Math.floor(Math.random() * 3) + 1;
  const areas = pickRandom(AREAS, areaCount);
  const venue = VENUE_TYPES[i % 3];
  const tagCount = Math.floor(Math.random() * 3) + 2;
  const tags = pickRandom(TAG_POOL, tagCount);
  const bioTemplate = BIO_POOL[i % BIO_POOL.length];
  const bio = bioTemplate.replace("{exp}", String(exp));

  return {
    id: String(i + 1),
    name: `${LAST_NAMES[i]} ${FIRST_NAMES[i]}`,
    avatarInitial: INITIALS[i],
    avatarColor: COLORS[i % COLORS.length],
    experienceYears: exp,
    gameTypes: games,
    areas,
    venueType: venue,
    tags,
    bio,
    completedJobs: Math.floor(Math.random() * 80) + 5,
    isActive: true,
  };
});
