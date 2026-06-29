"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CLAN_BASE,
  CLAN_UNLOCK_THRESHOLD,
  DEFAULT_CARE_METERS,
  HATS,
  PROJECTS,
  TINT,
  lowestMeter,
  type CareMeterKey,
  type CareMeters,
  type ClanIntent,
  type Relationship,
  type Tab,
  type UserType,
} from "./lib/data";
import {
  PARENT_STEPS,
  ParentChildSetup,
  ParentDone,
  ParentGoals,
  ParentLogin,
  ParentName,
  ParentNoticing,
  ParentWelcome,
  WhoIsBugsy,
} from "./components/onboarding/ParentFlow";
import {
  CHILD_STEPS,
  ChildAdultLogin,
  ChildParentDetails,
} from "./components/onboarding/ChildFlow";
import { LoginScreen } from "./components/onboarding/LoginScreen";
import { WhoAreYou } from "./components/onboarding/WhoAreYou";
import { ParentIntro } from "./components/onboarding/ParentIntro";
import { ParentJourney } from "./components/onboarding/ParentJourney";
import { ParentUnderstand } from "./components/onboarding/ParentUnderstand";
import { TellMeAboutChild } from "./components/onboarding/TellMeAboutChild";
import { QuestionnaireScreen } from "./components/onboarding/QuestionnaireScreen";
import { AssessmentCompleteScreen } from "./components/onboarding/AssessmentCompleteScreen";
import { JourneyCreatedScreen } from "./components/onboarding/JourneyCreatedScreen";
import { BondWithBugsy } from "./components/onboarding/BondWithBugsy";
import { Splash, Welcome } from "./components/onboarding/Welcome";
import {
  ChildAlmostDone,
  ChildBedtime,
  ChildCalmBugsy,
  ChildDailyGoal,
  ChildAgeQuestion,
  ChildDoorway,
  ChildHideSeek,
  ChildKitchen,
  ChildPetMeet,
  ChildPromise,
} from "./components/onboarding/ChildMeet";
import { BirdSpikeGame } from "./components/BirdSpikeGame";
import { SnackCatchGame } from "./components/SnackCatchGame";
import { TourOverlay, type TourStep } from "./components/TourOverlay";
import { ProgressContext } from "./components/onboarding/ConvoUI";
import { VoiceProvider } from "./lib/voice";
import {
  ScreenLeaderboard,
  ScreenProfile,
  ScreenProjectDetail,
  ScreenProjects,
  ScreenReward,
} from "./components/AppScreens";
import { ScreenHomeCare, ScreenCatometer } from "./components/CareScreens";

type Stage =
  | { kind: "splash" }
  | { kind: "welcome" }
  | { kind: "who" }
  | { kind: "login" } // "I already have an account" path from welcome
  | { kind: "parent"; step: number }
  | { kind: "child"; step: number }
  | { kind: "handover"; step: number }
  | { kind: "app"; tab: Tab }
  | { kind: "catometer" }
  | { kind: "project"; projectId: string }
  | { kind: "reward"; projectId: string; unlockedHatKey: string | null };

// Handover (parent → child) — once the grown-up finishes setup they
// pass the phone over and the child runs the SAME interactive
// onboarding as the direct "child" path, just without the steps the
// parent already completed (name, age, parent details, login,
// noticing/achieve). 0: doorway, 1: hide-and-seek (Bugsy already knows
// their name), 2: meet + pet Bugsy, 3: kitchen, 4: first mission
// (Snack Catch + bomb quiz), 5: dark force + calm-Bugsy storm,
// 6: the plan (train me, earn XP, rewards), 7: meet the clan,
// 8: pinky promise → app.
const HANDOVER_STEPS = 8;

// Stored in localStorage so users can resume their place across
// sessions — important when a parent does half the setup, exits,
// and comes back later, or when a kid closes mid-handover.
const STORAGE_KEY = "bugsy-state-v1";

// Post-first-project tour. Walks the kid through each tab so they
// understand what's where (and what's still locked). Fires once.
const TOUR_STEPS: TourStep[] = [
  { tab: "home",        mood: "excited",  text: "This is home. We hang out here every day." },
  { tab: "projects",    mood: "happy",    text: "Today's projects live here. Just pick one." },
  { tab: "leaderboard", mood: "thinking", text: "Clan is locked for now — it opens after 3 visits." },
  { tab: "me",          mood: "happy",    text: "Your profile and my wardrobe live here." },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>({ kind: "splash" });
  const [prevStep, setPrevStep] = useState(0);

  // When the kid plays a real quest mid-onboarding (either inside
  // the child flow's ChildPlantQuest or inside the handover flow's
  // version of the same), this records which flow + which step to
  // drop them back on once the reward screen finishes. `null` =
  // no resume pending, so the reward routes to app home as normal.
  const [onboardingResume, setOnboardingResume] = useState<
    { kind: "child" | "handover"; step: number } | null
  >(null);

  // Onboarding state
  const [userType, setUserType] = useState<UserType | null>(null);
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<number | null>(null);
  const [clanIntent, setClanIntent] = useState<ClanIntent | null>(null);
  const [noticing, setNoticing] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);

  // App state
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [equippedHat, setEquippedHat] = useState<string | null>(null);
  // Catometer: Bugsy's five care meters (0..100). Their average is the
  // health score. Caring (missions / care actions) raises them.
  const [careMeters, setCareMeters] = useState<CareMeters>(DEFAULT_CARE_METERS);
  // Tour seen flag — drives the one-time guided tour overlay
  const [seenHomeTour, setSeenHomeTour] = useState(false);
  // Current tour step (null = no tour running)
  const [tourStep, setTourStep] = useState<number | null>(null);

  // ── Persistence: hydrate from localStorage on mount ──
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.stage?.kind) setStage(data.stage);
        if (typeof data.userType === "string" || data.userType === null) setUserType(data.userType);
        if (typeof data.parentName === "string") setParentName(data.parentName);
        if (
          data.relationship === "mom" ||
          data.relationship === "dad" ||
          data.relationship === "guardian" ||
          data.relationship === null
        ) {
          setRelationship(data.relationship);
        }
        if (typeof data.childName === "string") setChildName(data.childName);
        if (typeof data.childAge === "number" || data.childAge === null) setChildAge(data.childAge);
        if (Array.isArray(data.noticing)) setNoticing(data.noticing);
        if (Array.isArray(data.goals)) setGoals(data.goals);
        if (typeof data.dailyGoal === "number" || data.dailyGoal === null) setDailyGoal(data.dailyGoal);
        if (data.clanIntent !== undefined) setClanIntent(data.clanIntent);
        if (Array.isArray(data.completedIds)) setCompletedIds(data.completedIds);
        if (typeof data.totalPoints === "number") setTotalPoints(data.totalPoints);
        if (typeof data.equippedHat === "string" || data.equippedHat === null) {
          setEquippedHat(data.equippedHat);
        }
        if (data.careMeters && typeof data.careMeters === "object") {
          setCareMeters({ ...DEFAULT_CARE_METERS, ...data.careMeters });
        }
        if (typeof data.seenHomeTour === "boolean") setSeenHomeTour(data.seenHomeTour);
        if (
          data.onboardingResume === null ||
          (data.onboardingResume &&
            (data.onboardingResume.kind === "child" ||
              data.onboardingResume.kind === "handover") &&
            typeof data.onboardingResume.step === "number")
        ) {
          setOnboardingResume(data.onboardingResume);
        }
      }
    } catch {
      // ignore corrupt state — fall back to defaults
    }
    setHydrated(true);
  }, []);

  // Persist on any meaningful change. Skipped until after initial
  // hydration so we don't immediately overwrite stored state with
  // the default welcome stage on first render.
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    try {
      const payload = {
        stage,
        userType,
        parentName,
        relationship,
        childName,
        childAge,
        noticing,
        goals,
        dailyGoal,
        clanIntent,
        completedIds,
        totalPoints,
        equippedHat,
        careMeters,
        seenHomeTour,
        onboardingResume,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // localStorage full / disabled — quietly skip
    }
  }, [
    hydrated,
    stage,
    userType,
    parentName,
    relationship,
    childName,
    childAge,
    noticing,
    goals,
    dailyGoal,
    clanIntent,
    completedIds,
    totalPoints,
    equippedHat,
    careMeters,
    seenHomeTour,
    onboardingResume,
  ]);

  const clan = (() => {
    if (!clanIntent) return { name: "—", emoji: "★" };
    if (clanIntent.kind === "create") return { name: clanIntent.name, emoji: clanIntent.emoji };
    if (clanIntent.kind === "join-link" || clanIntent.kind === "join-open") {
      return { name: clanIntent.clan.name, emoji: clanIntent.clan.emoji };
    }
    return { name: "—", emoji: "★" };
  })();

  const setTab = (t: Tab) => setStage({ kind: "app", tab: t });

  const restart = () => {
    setUserType(null);
    setParentName("");
    setRelationship(null);
    setChildName("");
    setChildAge(null);
    setClanIntent(null);
    setNoticing([]);
    setGoals([]);
    setDailyGoal(null);
    setCompletedIds([]);
    setTotalPoints(0);
    setEquippedHat(null);
    setSeenHomeTour(false);
    setOnboardingResume(null);
    setPrevStep(0);
    setStage({ kind: "splash" });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  };

  const logout = () => {
    if (typeof window !== "undefined" && !window.confirm("Log out and reset your progress?")) {
      return;
    }
    restart();
  };

  // ── Guided tour ──
  // Auto-start the tour the first time the kid lands on Home
  // *after* their first project — that's when the bond beat hits
  // hardest and they're emotionally ready to be shown around.
  useEffect(() => {
    if (!hydrated) return;
    if (stage.kind !== "app" || stage.tab !== "home") return;
    if (completedIds.length === 0) return;
    if (seenHomeTour) return;
    if (tourStep !== null) return;
    setTourStep(0);
  }, [hydrated, stage, completedIds, seenHomeTour, tourStep]);

  const advanceTour = () => {
    if (tourStep === null) return;
    const next = tourStep + 1;
    if (next >= TOUR_STEPS.length) {
      setSeenHomeTour(true);
      setTourStep(null);
      setStage({ kind: "app", tab: "home" });
      return;
    }
    setTourStep(next);
    setStage({ kind: "app", tab: TOUR_STEPS[next].tab });
  };

  const skipTour = () => {
    setSeenHomeTour(true);
    setTourStep(null);
    setStage({ kind: "app", tab: "home" });
  };

  // Caring for Bugsy raises a meter (capped at 100). Used both by the
  // catometer's per-behaviour "Go" and as a side-effect of missions.
  const careFor = (key: CareMeterKey, amount: number) => {
    setCareMeters((m) => ({ ...m, [key]: Math.min(100, m[key] + amount) }));
  };

  const completeProject = (projectId: string) => {
    if (completedIds.includes(projectId)) return;
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return;
    const newCount = completedIds.length + 1;
    setCompletedIds([...completedIds, projectId]);
    setTotalPoints(totalPoints + project.points);
    // A completed mission gives Bugsy attention — top up whatever meter
    // needs it most, so care + health climb alongside coins.
    careFor(lowestMeter(careMeters).key, 16);
    const unlocked = HATS.find((h) => h.unlockAt === newCount) ?? null;
    if (unlocked && !equippedHat) setEquippedHat(unlocked.key);
    setStage({ kind: "reward", projectId, unlockedHatKey: unlocked?.key ?? null });
  };

  // Add XP to the running balance without the full project-completion flow.
  // Used by the onboarding first mission so the snack-catch quiz can credit
  // real XP (mission + bomb-quiz bonus) toward the child's total.
  const awardXp = (amount: number) => {
    if (amount <= 0) return;
    setTotalPoints((p) => p + amount);
  };

  // Per-behaviour care action from the catometer: fill that meter and
  // earn a few coins for showing up.
  const careAction = (key: CareMeterKey) => {
    careFor(key, 18);
    setTotalPoints((p) => p + 5);
  };

  // Spend coins on a "special snack" → fills the Feeding meter.
  const buySnack = () => {
    if (totalPoints < 30) return;
    setTotalPoints((p) => p - 30);
    setCareMeters((m) => ({ ...m, feeding: 100 }));
  };

  // ── Next clan fight countdown (next Saturday 18:00). Computed after
  // mount so server/client render match (uses the live clock). ──
  const [nextFightLabel, setNextFightLabel] = useState("Coming soon");
  useEffect(() => {
    const now = new Date();
    const target = new Date(now);
    const daysToSat = (6 - now.getDay() + 7) % 7;
    target.setDate(now.getDate() + daysToSat);
    target.setHours(18, 0, 0, 0);
    if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 7);
    const diffH = Math.round((target.getTime() - now.getTime()) / 3_600_000);
    const d = Math.floor(diffH / 24);
    const h = diffH % 24;
    setNextFightLabel(
      `Saturday 6 PM · in ${d > 0 ? `${d}d ` : ""}${h}h`,
    );
  }, []);

  // ── Onboarding navigation ──
  const advanceParent = () => {
    if (stage.kind !== "parent") return;
    setPrevStep(stage.step);
    const next = stage.step + 1;
    if (next >= PARENT_STEPS) {
      setStage({ kind: "handover", step: 0 });
    } else {
      setStage({ kind: "parent", step: next });
    }
  };
  const backParent = () => {
    if (stage.kind !== "parent") return;
    setPrevStep(stage.step);
    const prev = stage.step - 1;
    if (prev < 0) setStage({ kind: "who" });
    else setStage({ kind: "parent", step: prev });
  };

  const advanceChild = () => {
    if (stage.kind !== "child") return;
    setPrevStep(stage.step);
    const next = stage.step + 1;
    if (next >= CHILD_STEPS) {
      // Child completed their flow → straight to home, no handover
      // (handover was the parent's "meet your kid" moment)
      setStage({ kind: "app", tab: "home" });
    } else {
      setStage({ kind: "child", step: next });
    }
  };
  const backChild = () => {
    if (stage.kind !== "child") return;
    setPrevStep(stage.step);
    const prev = stage.step - 1;
    if (prev < 0) setStage({ kind: "who" });
    else setStage({ kind: "child", step: prev });
  };

  const advanceHandover = () => {
    if (stage.kind !== "handover") return;
    setPrevStep(stage.step);
    const next = stage.step + 1;
    if (next >= HANDOVER_STEPS) {
      setStage({ kind: "app", tab: "home" });
    } else {
      setStage({ kind: "handover", step: next });
    }
  };

  const direction = (() => {
    // Happy bounce when the grown-up first enters the parent flow from WhoAreYou
    if (stage.kind === "parent" && stage.step === 0 && prevStep === 0) {
      return "screen-happy-wrap";
    }
    // Cinematic portal entrance into the journey overview
    if (stage.kind === "parent" && stage.step === 1 && prevStep === 0) {
      return "screen-adventure-wrap";
    }
    if (
      (stage.kind === "parent"  && stage.step < prevStep) ||
      (stage.kind === "child"   && stage.step < prevStep) ||
      (stage.kind === "handover"&& stage.step < prevStep)
    ) {
      return "screen-wrap-back";
    }
    return "screen-wrap";
  })();

  // Per-flow progress for the top progress bar. Each flow has its
  // own arc — parent fills 0→100% across their setup, then resets
  // for the kid's handover (different actor, different chapter).
  const progress = useMemo<number | null>(() => {
    if (stage.kind === "parent") return (stage.step + 1) / PARENT_STEPS;
    if (stage.kind === "child") return (stage.step + 1) / CHILD_STEPS;
    if (stage.kind === "handover") return (stage.step + 1) / HANDOVER_STEPS;
    return null;
  }, [stage]);

  const renderStage = () => {
    if (stage.kind === "splash") {
      return <Splash onEnter={() => setStage({ kind: "welcome" })} />;
    }

    if (stage.kind === "welcome") {
      return (
        <Welcome
          tint={TINT}
          onGetStarted={() => setStage({ kind: "who" })}
          onHaveAccount={() => setStage({ kind: "login" })}
        />
      );
    }

    if (stage.kind === "login") {
      return (
        <LoginScreen
          tint={TINT}
          mood="waving"
          bubbleText="Welcome back! Let's get you signed in."
          ctaLabel="Pick how to sign in"
          onContinue={() => setStage({ kind: "app", tab: "home" })}
          onBack={() => setStage({ kind: "welcome" })}
        />
      );
    }

    if (stage.kind === "who") {
      return (
        <WhoAreYou
          tint={TINT}
          onPick={(t) => {
            setUserType(t);
            setPrevStep(0);
            setStage(t === "parent" ? { kind: "parent", step: 0 } : { kind: "child", step: 0 });
          }}
        />
      );
    }

    if (stage.kind === "parent") {
      const back = stage.step === 0 ? () => setStage({ kind: "who" }) : backParent;
      switch (stage.step) {
        // ── Meet Bugsy: greeting + pet, then who he is ──
        case 0:
          return (
            <ParentIntro
              tint={TINT}
              parentName={parentName}
              setParentName={setParentName}
              relationship={relationship}
              setRelationship={setRelationship}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 1:
          return (
            <ParentJourney
              tint={TINT}
              childName={childName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 2:
          return (
            <ParentUnderstand
              tint={TINT}
              childName={childName}
              parentName={parentName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 3:
          return (
            <TellMeAboutChild
              tint={TINT}
              childName={childName}
              setChildName={setChildName}
              childAge={childAge}
              setChildAge={setChildAge}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 4:
          return (
            <QuestionnaireScreen
              childName={childName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 5:
          return (
            <AssessmentCompleteScreen
              childName={childName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 6:
          return (
            <JourneyCreatedScreen
              childName={childName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 7:
          return <WhoIsBugsy tint={TINT} onNext={advanceParent} onBack={back} />;
        // ── Collect: parent identity, child, concerns, goals ──
        case 8:
          return (
            <ParentName
              tint={TINT}
              parentName={parentName}
              setParentName={setParentName}
              relationship={relationship}
              setRelationship={setRelationship}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 9:
          return (
            <ParentChildSetup
              tint={TINT}
              parentName={parentName}
              childName={childName}
              setChildName={setChildName}
              childAge={childAge}
              setChildAge={setChildAge}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 10:
          return (
            <ParentNoticing
              tint={TINT}
              childName={childName}
              noticing={noticing}
              setNoticing={setNoticing}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 11:
          return (
            <ParentGoals
              tint={TINT}
              childName={childName}
              goals={goals}
              setGoals={setGoals}
              onNext={advanceParent}
              onBack={back}
            />
          );
        // ── Sign in, then hand over to the child ──
        case 12:
          return (
            <ParentLogin
              tint={TINT}
              childName={childName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 13:
          return (
            <ParentDone
              tint={TINT}
              parentName={parentName}
              childName={childName}
              onHandOver={advanceParent}
              onBack={back}
            />
          );
      }
      return null;
    }

    if (stage.kind === "child") {
      const friend = childName.trim() || "friend";
      switch (stage.step) {
        // ── Bond with Bugsy: collect name + birthday ──
        case 0:
          return (
            <BondWithBugsy
              childName={childName}
              setChildName={setChildName}
              childAge={childAge}
              setChildAge={setChildAge}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        // ── Meet Bugsy in his room: he asks the child's name, then
        // they play hide-and-seek to find him. ──
        case 1:
          return <ChildDoorway tint={TINT} childName={friend} onNext={advanceChild} onBack={backChild} />;
        case 2:
          return (
            <ChildHideSeek
              tint={TINT}
              childName={childName}
              setChildName={setChildName}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        case 3:
          // Cuddle Bugsy → age → "play one more game with me?" invite.
          return (
            <ChildPetMeet
              tint={TINT}
              childName={childName}
              childAge={childAge}
              setChildAge={setChildAge}
              gameNext
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        // ── Age question on the football park (no football) ──
        case 4:
          return (
            <ChildAgeQuestion
              tint={TINT}
              childName={childName}
              childAge={childAge}
              setChildAge={setChildAge}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        // ── First mission location — the kitchen ──
        case 5:
          return (
            <ChildKitchen
              tint={TINT}
              childName={childName}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        // ── First mission: Snack Catch (drag the cat, catch good food) ──
        case 6:
          return <SnackCatchGame tint={TINT} onExit={advanceChild} onEarnXp={awardXp} />;
        // ── Dark force arrives → calm Bugsy through the storm ──
        case 7:
          return <ChildCalmBugsy tint={TINT} childName={childName} onNext={advanceChild} onBack={backChild} />;
        // ── It's getting late: when will you come back tomorrow? ──
        case 8:
          return <ChildPromise tint={TINT} childName={childName} onNext={advanceChild} onBack={backChild} />;
        // ── A little about them ──
        case 9:
          return (
            <ChildDailyGoal
              tint={TINT}
              childName={childName}
              goal={dailyGoal}
              setGoal={setDailyGoal}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        // ── Night falls: goodnight, see you tomorrow → Bugsy sleeps ──
        case 10:
          return <ChildBedtime tint={TINT} childName={childName} onNext={advanceChild} onBack={backChild} />;
        case 11:
          return (
            <ChildAlmostDone
              tint={TINT}
              childName={friend}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        case 12:
          return (
            <ChildAdultLogin
              tint={TINT}
              childName={friend}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        case 13:
          return (
            <ChildParentDetails
              tint={TINT}
              childName={friend}
              parentName={parentName}
              setParentName={setParentName}
              relationship={relationship}
              setRelationship={setRelationship}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
        // ── Grown-up shares what they're noticing, then Bugsy's
        // response (same beats as the parent flow) ──
        case 14:
          return (
            <ParentNoticing
              tint={TINT}
              childName={childName}
              noticing={noticing}
              setNoticing={setNoticing}
              onNext={advanceChild}
              onBack={backChild}
            />
          );
      }
      return null;
    }

    if (stage.kind === "handover") {
      const friend = childName || "friend";
      // The child runs the same interactive flow as the direct "child"
      // path, minus the data-collection beats the parent already did
      // (name / age / parent details / login / noticing / achieve).
      switch (stage.step) {
        // ── Meet Bugsy in his room ──
        case 0:
          return <ChildDoorway tint={TINT} childName={friend} onNext={advanceHandover} />;
        case 1:
          // No setChildName → Bugsy already knows them (parent set the
          // name), so hide-and-seek skips the name-asking phase.
          return <ChildHideSeek tint={TINT} childName={friend} onNext={advanceHandover} />;
        case 2:
          return (
            <ChildPetMeet
              tint={TINT}
              childName={friend}
              onNext={advanceHandover}
            />
          );
        // ── First mission: the kitchen, then Snack Catch + bomb quiz ──
        case 3:
          return (
            <ChildKitchen
              tint={TINT}
              childName={friend}
              onNext={advanceHandover}
            />
          );
        case 4:
          return <SnackCatchGame tint={TINT} onExit={advanceHandover} onEarnXp={awardXp} />;
        // ── Dark force arrives → calm Bugsy through the storm ──
        case 5:
          return <ChildCalmBugsy tint={TINT} childName={friend} onNext={advanceHandover} />;
        // ── It's getting late: when will you come back tomorrow? ──
        case 6:
          return <ChildPromise tint={TINT} childName={friend} onNext={advanceHandover} />;
        // ── Night falls: goodnight, see you tomorrow → app home ──
        case 7:
          return <ChildBedtime tint={TINT} childName={friend} onNext={advanceHandover} />;
      }
      return null;
    }

    if (stage.kind === "project") {
      const project = PROJECTS.find((p) => p.id === stage.projectId);
      if (!project) {
        setStage({ kind: "app", tab: "projects" });
        return null;
      }
      // Bird Spike has its own canvas game UI — exit "completes"
      // the project and flows into the standard reward screen.
      if (project.id === "p9") {
        return (
          <BirdSpikeGame
            tint={TINT}
            onExit={() => completeProject(project.id)}
          />
        );
      }
      return (
        <ScreenProjectDetail
          tint={TINT}
          project={project}
          onBack={() => setStage({ kind: "app", tab: "projects" })}
          onComplete={() => completeProject(stage.projectId)}
        />
      );
    }

    if (stage.kind === "reward") {
      const project = PROJECTS.find((p) => p.id === stage.projectId);
      if (!project) {
        setStage({ kind: "app", tab: "projects" });
        return null;
      }
      const unlockedHat = stage.unlockedHatKey
        ? HATS.find((h) => h.key === stage.unlockedHatKey) ?? null
        : null;

      const completedCount = completedIds.length;
      const previousCount = Math.max(0, completedCount - 1);
      const previousPoints = Math.max(0, totalPoints - project.points);

      const hasClan =
        clanIntent !== null && clanIntent.kind !== "let-child-explore";

      return (
        <ScreenReward
          tint={TINT}
          project={project}
          childName={childName || parentName}
          unlockedHat={unlockedHat}
          equippedHat={equippedHat}
          streakBefore={Math.min(previousCount, 30)}
          streakAfter={Math.min(completedCount, 30)}
          personalBefore={previousPoints}
          personalAfter={totalPoints}
          clanBefore={CLAN_BASE + previousPoints}
          clanAfter={CLAN_BASE + totalPoints}
          clanName={hasClan ? clan.name : null}
          onContinue={() => {
            // If this completion came from the onboarding quest
            // picker (either the child flow's or the handover's
            // version of it), drop the kid back into the rest of
            // that onboarding flow instead of the app home.
            if (onboardingResume !== null) {
              const resume = onboardingResume;
              setOnboardingResume(null);
              setStage({ kind: resume.kind, step: resume.step });
            } else {
              setStage({ kind: "app", tab: "home" });
            }
          }}
        />
      );
    }

    if (stage.kind === "catometer") {
      return (
        <ScreenCatometer
          tint={TINT}
          coins={totalPoints}
          meters={careMeters}
          equippedHat={equippedHat}
          nextFightLabel={nextFightLabel}
          onBack={() => setStage({ kind: "app", tab: "home" })}
          onCare={careAction}
        />
      );
    }

    if (stage.kind !== "app") return null;

    const tab = stage.tab;
    const completedCount = completedIds.length;

    const clanUnlocked = completedCount >= CLAN_UNLOCK_THRESHOLD;
    const lockedTabs: Tab[] = clanUnlocked ? [] : ["leaderboard"];

    if (tab === "home") {
      const missionsOfDay = (() => {
        const open = PROJECTS.filter((p) => !completedIds.includes(p.id));
        return (open.length >= 2 ? open : PROJECTS).slice(0, 2);
      })();
      return (
        <ScreenHomeCare
          tint={TINT}
          name={childName || parentName}
          coins={totalPoints}
          meters={careMeters}
          streak={completedCount > 0 ? Math.min(completedCount, 30) : 0}
          equippedHat={equippedHat}
          missions={missionsOfDay}
          tab={tab}
          setTab={setTab}
          onOpenProject={(id) => setStage({ kind: "project", projectId: id })}
          onOpenCatometer={() => setStage({ kind: "catometer" })}
          onSpendSnack={buySnack}
          nextFightLabel={nextFightLabel}
          lockedTabs={lockedTabs}
        />
      );
    }
    if (tab === "projects") {
      return (
        <ScreenProjects
          tint={TINT}
          tab={tab}
          setTab={setTab}
          completedIds={completedIds}
          equippedHat={equippedHat}
          onOpenProject={(id) => setStage({ kind: "project", projectId: id })}
          lockedTabs={lockedTabs}
        />
      );
    }
    if (tab === "leaderboard") {
      const hasClan =
        clanIntent !== null && clanIntent.kind !== "let-child-explore";
      return (
        <ScreenLeaderboard
          tint={TINT}
          tab={tab}
          setTab={setTab}
          name={childName || parentName}
          clan={clan}
          clanScore={CLAN_BASE + totalPoints}
          hasClan={hasClan}
          totalPoints={totalPoints}
          completedProjects={completedCount}
          equippedHat={equippedHat}
          unlocked={clanUnlocked}
          unlockThreshold={CLAN_UNLOCK_THRESHOLD}
          lockedTabs={lockedTabs}
        />
      );
    }
    if (tab === "me") {
      return (
        <ScreenProfile
          tint={TINT}
          name={childName || parentName}
          age={childAge}
          clan={clan}
          totalPoints={totalPoints}
          completedProjects={completedCount}
          streak={completedCount > 0 ? Math.min(completedCount, 30) : 0}
          equippedHat={equippedHat}
          setEquippedHat={setEquippedHat}
          tab={tab}
          setTab={setTab}
          onLogout={logout}
          lockedTabs={lockedTabs}
        />
      );
    }
    return null;
  };

  const key =
    stage.kind === "splash"
      ? "splash"
      : stage.kind === "welcome"
      ? "welcome"
      : stage.kind === "who"
      ? "who"
      : stage.kind === "login"
      ? "login"
      : stage.kind === "parent"
      ? `parent-${stage.step}`
      : stage.kind === "child"
      ? `child-${stage.step}`
      : stage.kind === "handover"
      ? `handover-${stage.step}`
      : stage.kind === "app"
      ? `app-${stage.tab}`
      : stage.kind === "catometer"
      ? "catometer"
      : stage.kind === "project"
      ? `project-${stage.projectId}`
      : `reward-${stage.projectId}`;

  // suppress unused-var warning
  void userType;

  return (
    <VoiceProvider>
      <ProgressContext.Provider value={progress}>
        <div className="app-frame">
          <div
            key={key}
            className={direction}
            style={{ width: "100%", height: "100dvh", position: "relative" }}
          >
            {renderStage()}
          </div>
          {tourStep !== null && (
            <TourOverlay
              step={tourStep}
              steps={TOUR_STEPS}
              tint={TINT}
              onNext={advanceTour}
              onSkip={skipTour}
            />
          )}
        </div>
      </ProgressContext.Provider>
    </VoiceProvider>
  );
}
