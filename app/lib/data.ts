export type Mood =
  | "happy"
  | "waving"
  | "thinking"
  | "cheer"
  | "sleep"
  | "blink"
  // ── emotional / care states ──
  | "sad"      // hasn't seen the kid in a while
  | "sleepy"   // half-asleep, waiting
  | "excited"  // big payoff moments
  | "worried"  // mildly anxious
  | "hungry"   // wants attention / food
  | "angry";   // furious — messy fur, steam, red tint
export type Tab = "home" | "projects" | "leaderboard" | "me";
export type UserType = "parent" | "child";
export type Relationship = "mom" | "dad" | "guardian";

export const RELATIONSHIP_OPTIONS: { key: Relationship; label: string; icon: string }[] = [
  { key: "mom", label: "Mom", icon: "/relationships/mom.svg" },
  { key: "dad", label: "Dad", icon: "/relationships/dad.svg" },
  { key: "guardian", label: "Guardian", icon: "/relationships/guardian.svg" },
];

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

// ── Parent screening: behavioural concerns ──────────────────
// Short list of patterns parents commonly notice. Multi-select.
// Drives which projects we'll lean toward later.
export type NoticingOption = {
  key: string;
  icon: string;
  title: string;
  sub: string;
};
export const NOTICING_OPTIONS: NoticingOption[] = [
  { key: "focus",      icon: "/noticing/loses_focus.svg",          title: "Loses focus",         sub: "drifts off mid-task" },
  { key: "interrupt",  icon: "/noticing/talks_over_others.svg",    title: "Talks over others",   sub: "hard to wait turn" },
  { key: "reading",    icon: "/noticing/loses_reading_thread.svg", title: "Loses reading thread",sub: "re-reads pages" },
  { key: "screens",    icon: "/noticing/glued_to_screen.svg",      title: "Glued to screens",    sub: '"5 more minutes"' },
  { key: "newthings",  icon: "/noticing/avoid.svg",                title: "Avoids new things",   sub: "sticks to safe" },
  { key: "giveup",     icon: "/noticing/gives_up.svg",             title: "Gives up fast",       sub: "stops when hard" },
];

// Number of completed projects before the Clan tab unlocks.
// Mirrors Duolingo's leaderboard gate — the habit loop must
// land first; clan competition is a reward, not a starting point.
export const CLAN_UNLOCK_THRESHOLD = 3;

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
  // Bird Spike — Bugsy-flavoured Flappy-style reaction game.
  // Mins is intentionally 1 so it sorts to the very top of the
  // "fastest games" picker the onboarding uses.
  { id: "p9", title: "Bird Spike",      category: "educational", kind: "game",    blurb: "Tap to flap Bugsy through the spikes. We use your reactions to track focus.", points: 50, mins: 1,  emoji: "🐦", proof: "tap" },
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
// Bond-first messaging. No clan/team references — Bugsy as the
// child's pet, not a team-mate. Each line carries a mood so the
// mascot's face matches the words.
export type BugsyLine = { mood: Mood; text: string };

export function bugsyLines(opts: {
  name: string;
  completedToday: number;
  streak: number;
}): BugsyLine[] {
  const { name, completedToday, streak } = opts;
  const friend = name?.trim() || "friend";

  const hour = typeof window !== "undefined" ? new Date().getHours() : 10;
  const tod =
    hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
  const greet =
    tod === "morning" ? "Morning" : tod === "night" ? "Up late" : "Hey";

  const lines: BugsyLine[] = [];

  // Opening line — personalised
  lines.push({
    mood: "excited",
    text:
      completedToday > 0
        ? `${greet}, ${friend}! Proud of you today.`
        : `${greet}, ${friend}! I missed you.`,
  });

  // Streak / consistency
  lines.push(
    streak >= 7
      ? { mood: "cheer", text: `${streak} days in a row! On fire 🔥` }
      : streak >= 3
      ? { mood: "happy", text: `${streak}-day streak. Don't break the chain.` }
      : { mood: "happy", text: "Just you and me. That's all I need." }
  );

  // Pet-vibe lines
  lines.push({ mood: "happy", text: "Tap me anytime — I love hanging out." });
  lines.push({ mood: "cheer", text: "I grow a little every day with you." });
  lines.push({ mood: "thinking", text: `What should we do today, ${friend}?` });
  lines.push(
    tod === "morning"
      ? { mood: "happy", text: "Easy start: pick a quick game." }
      : tod === "night"
      ? { mood: "sleepy", text: "Almost bedtime. One game and we rest." }
      : { mood: "happy", text: "Got 5 minutes? Quick game?" }
  );

  return lines;
}

export function nextHatToUnlock(completedCount: number): Hat | null {
  return HATS.find((h) => h.unlockAt > completedCount) ?? null;
}
