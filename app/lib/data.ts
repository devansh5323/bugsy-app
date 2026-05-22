export type Mood = "happy" | "waving" | "thinking" | "cheer" | "sleep" | "blink";
export type Tab = "home" | "projects" | "leaderboard" | "me";
export type UserType = "parent" | "child";

export type ClanIntent =
  | { kind: "create"; name: string; emoji: string }
  | { kind: "join-link"; code: string; clan: Clan }
  | { kind: "join-open"; clan: Clan }
  | { kind: "let-child-explore" }; // parent-flow option only

export type ProjectCategory = "educational" | "creative" | "physical";
export type ProjectKind = "game" | "project";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  kind: ProjectKind;
  blurb: string;
  points: number;
  mins: number;
  emoji: string;
  proof?: "photo" | "text" | "tap"; // how completion is recorded
};

export type Clan = {
  id: string;
  name: string;
  emoji: string;
  members: number;
  points: number;
  isOpen: boolean;
};

export type LeaderboardChild = {
  rank: number;
  name: string;
  clan: string;
  points: number;
  projects: number;
  isYou?: boolean;
};

export type Hat = {
  key: string;
  name: string;
  unlockAt: number; // # projects completed to unlock
};

export const TINT = 220; // sky-blue cat
export const ACCENT_HUE = 295; // violet
export const ACCENT_CHROMA = 0.16;
// Baseline clan points (other members' contributions). User's points add on top.
export const CLAN_BASE = 12450;

export const CATEGORIES: { key: ProjectCategory; label: string; color: string; icon: string }[] = [
  { key: "educational", label: "Educational", color: "oklch(72% 0.15 235)", icon: "🧠" },
  { key: "creative",    label: "Creative",    color: "oklch(72% 0.17 30)",  icon: "🎨" },
  { key: "physical",    label: "Physical",    color: "oklch(72% 0.15 145)", icon: "💪" },
];

export const AGE_MIN = 8;
export const AGE_MAX = 15;

// ── Today's projects ──────────────────────────────────────────
export const PROJECTS: Project[] = [
  { id: "p1", title: "Tower of Cards",  category: "physical",    kind: "project", blurb: "Build the tallest tower you can from a deck of cards. Snap a photo when it stands tall.", points: 60, mins: 20, emoji: "🃏", proof: "photo" },
  { id: "p2", title: "Number Spark",    category: "educational", kind: "game",    blurb: "Beat the working-memory puzzle. 10 quick rounds.", points: 40, mins: 5,  emoji: "🔢", proof: "tap" },
  { id: "p3", title: "Doodle a Beast",  category: "creative",    kind: "project", blurb: "Sketch a creature that doesn't exist. Anything goes.", points: 50, mins: 15, emoji: "🐲", proof: "photo" },
  { id: "p4", title: "Plank Challenge", category: "physical",    kind: "game",    blurb: "Hold a plank for 60 seconds. Time yourself, then mark done.", points: 30, mins: 2,  emoji: "🏋️", proof: "tap" },
  { id: "p5", title: "Word Detective",  category: "educational", kind: "game",    blurb: "Find the hidden pattern in 8 word puzzles.", points: 45, mins: 10, emoji: "🔎", proof: "tap" },
  { id: "p6", title: "Two-Line Story",  category: "creative",    kind: "project", blurb: "Write a story in exactly two lines. Surprise yourself.", points: 35, mins: 5,  emoji: "✍️", proof: "text" },
  { id: "p7", title: "Star Jumps x50",  category: "physical",    kind: "game",    blurb: "50 star jumps. Catch your breath. Tap done.", points: 25, mins: 3,  emoji: "⭐", proof: "tap" },
  { id: "p8", title: "Logic Loop",      category: "educational", kind: "game",    blurb: "Crack 5 logic puzzles in a row.", points: 55, mins: 12, emoji: "🧩", proof: "tap" },
];

// ── Hats (Bugsy customization) ────────────────────────────────
export const HATS: Hat[] = [
  { key: "acorn",     name: "Acorn cap",      unlockAt: 1 },
  { key: "crown",     name: "Crown",          unlockAt: 3 },
  { key: "wizard",    name: "Wizard hat",     unlockAt: 5 },
  { key: "graduate",  name: "Graduate cap",   unlockAt: 8 },
  { key: "party",     name: "Party hat",      unlockAt: 12 },
  { key: "star",      name: "Star headband",  unlockAt: 18 },
];

// ── Open clans you can join ───────────────────────────────────
export const OPEN_CLANS: Clan[] = [
  { id: "c1", name: "Moonlight Foxes",   emoji: "🦊", members: 18, points: 12450, isOpen: true },
  { id: "c2", name: "Quantum Otters",    emoji: "🦦", members: 22, points: 11820, isOpen: true },
  { id: "c3", name: "Volcano Penguins",  emoji: "🐧", members: 14, points: 10560, isOpen: true },
  { id: "c4", name: "Aurora Bears",      emoji: "🐻", members: 9,  points:  8930, isOpen: true },
  { id: "c5", name: "Pixel Pandas",      emoji: "🐼", members: 27, points:  8450, isOpen: true },
];

// ── Leaderboards (sample data) ────────────────────────────────
export const INDIVIDUAL_BOARD: LeaderboardChild[] = [
  { rank: 1, name: "Riya M.",      clan: "Moonlight Foxes", points: 2840, projects: 64 },
  { rank: 2, name: "Theo K.",      clan: "Quantum Otters",  points: 2710, projects: 60 },
  { rank: 3, name: "Anika P.",     clan: "Pixel Pandas",    points: 2580, projects: 58 },
  { rank: 4, name: "Marco B.",     clan: "Aurora Bears",    points: 2420, projects: 55 },
  { rank: 5, name: "Sage L.",      clan: "Volcano Penguins", points: 2290, projects: 51 },
  { rank: 6, name: "Jin H.",       clan: "Moonlight Foxes", points: 2110, projects: 48 },
  { rank: 7, name: "Eli R.",       clan: "Quantum Otters",  points: 1980, projects: 45 },
];

export const CLAN_BOARD: { rank: number; clan: Clan; trend: "up" | "down" | "flat" }[] = [
  { rank: 1, clan: OPEN_CLANS[0], trend: "up" },
  { rank: 2, clan: OPEN_CLANS[1], trend: "up" },
  { rank: 3, clan: OPEN_CLANS[2], trend: "flat" },
  { rank: 4, clan: OPEN_CLANS[3], trend: "down" },
  { rank: 5, clan: OPEN_CLANS[4], trend: "up" },
];

// ── Bugsy personality ─────────────────────────────────────────
export type BugsyLine = { mood: Mood; text: string };

export function bugsyLines(opts: {
  name: string;
  clanName: string;
  clanRank: number;
  totalClans: number;
  completedToday: number;
  streak: number;
}): BugsyLine[] {
  const { name, clanName, clanRank, totalClans, completedToday, streak } = opts;
  const friend = name?.trim() || "friend";

  const hour = typeof window !== "undefined" ? new Date().getHours() : 10;
  const tod = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
  const greet = tod === "morning" ? "Morning" : tod === "night" ? "Up late" : "Hey";

  const lines: BugsyLine[] = [];

  // Opening line — personalised
  lines.push({
    mood: "waving",
    text:
      completedToday > 0
        ? `${greet}, ${friend}! Proud of you today.`
        : `${greet}, ${friend}! Let's earn some points.`,
  });

  // Streak / consistency
  lines.push(
    streak >= 7
      ? { mood: "cheer", text: `${streak} days in a row! You're on fire 🔥` }
      : streak >= 3
      ? { mood: "happy", text: `${streak}-day streak. Don't break the chain.` }
      : { mood: "happy", text: `Pssst — daily streaks unlock bonus points.` }
  );

  // Clan context
  lines.push(
    clanRank <= 3
      ? { mood: "cheer", text: `${clanName} is at #${clanRank}! Let's hold the lead.` }
      : clanRank <= 10
      ? { mood: "thinking", text: `${clanName} is #${clanRank}/${totalClans}. One push and we climb.` }
      : { mood: "thinking", text: `We're falling behind. One project from you helps the whole clan.` }
  );

  // Encouragement / pet vibe
  lines.push({ mood: "happy", text: "Tap me anytime — I love hanging out." });
  lines.push({ mood: "cheer", text: "Watch me grow — each project gives me a new look." });
  lines.push(
    tod === "morning"
      ? { mood: "happy", text: "Easy way to start the day: pick a quick game." }
      : tod === "night"
      ? { mood: "sleep", text: "Almost bedtime. One game and we rest." }
      : { mood: "happy", text: "Got 5 minutes? Quick game?" }
  );

  return lines;
}

export function nextHatToUnlock(completedCount: number): Hat | null {
  return HATS.find((h) => h.unlockAt > completedCount) ?? null;
}
