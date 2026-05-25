"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CLAN_BASE,
  CLAN_UNLOCK_THRESHOLD,
  HATS,
  PROJECTS,
  TINT,
  type ClanIntent,
  type Relationship,
  type Tab,
  type UserType,
} from "./lib/data";
import {
  PARENT_STEPS,
  ParentAchieve,
  ParentBondAbsence,
  ParentBondGrowth,
  ParentBondLoop,
  ParentBondTasks,
  ParentChildSetup,
  ParentDone,
  ParentIntro2,
  ParentLogin,
  ParentName,
  ParentNoticing,
} from "./components/onboarding/ParentFlow";
import {
  CHILD_STEPS,
  ChildAdultLogin,
  ChildAge,
  ChildAlmostDone,
  ChildDailyGoal,
  ChildFeedBugsy,
  ChildIntro,
  ChildName,
  ChildParentDetails,
  ChildPlantQuest,
  ChildPowerSecret,
  ChildPromise,
  ChildSendoff,
  ChildSootheBugsy,
} from "./components/onboarding/ChildFlow";
import { LoginScreen } from "./components/onboarding/LoginScreen";
import { WhoAreYou } from "./components/onboarding/WhoAreYou";
import { Welcome } from "./components/onboarding/Welcome";
import {
  ChildHelloKnown,
  DailyMap,
  FirstAction,
  HandoverPrompt,
  PinkyPromise,
} from "./components/onboarding/Handover";
import { BirdSpikeGame } from "./components/BirdSpikeGame";
import { TourOverlay, type TourStep } from "./components/TourOverlay";
import { ProgressContext } from "./components/onboarding/ConvoUI";
import { VoiceProvider } from "./lib/voice";
import {
  ScreenHome,
  ScreenLeaderboard,
  ScreenProfile,
  ScreenProjectDetail,
  ScreenProjects,
  ScreenReward,
} from "./components/AppScreens";

type Stage =
  | { kind: "welcome" }
  | { kind: "who" }
  | { kind: "login" } // "I already have an account" path from welcome
  | { kind: "parent"; step: number }
  | { kind: "child"; step: number }
  | { kind: "handover"; step: number }
  | { kind: "app"; tab: Tab }
  | { kind: "project"; projectId: string }
  | { kind: "reward"; projectId: string; unlockedHatKey: string | null };

const HANDOVER_STEPS = 5; // 0: pass-phone prompt, 1-4: helloKnown/pinky/dailyMap/firstAction

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
  const [stage, setStage] = useState<Stage>({ kind: "welcome" });
  const [prevStep, setPrevStep] = useState(0);

  // When the child plays a real quest mid-onboarding (step 3
  // picker), this records which child step to drop them back on
  // after the reward screen. null = no resume pending (so the
  // reward routes to app home as normal).
  const [onboardingResumeStep, setOnboardingResumeStep] = useState<number | null>(null);

  // Onboarding state
  const [userType, setUserType] = useState<UserType | null>(null);
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<number | null>(null);
  const [clanIntent, setClanIntent] = useState<ClanIntent | null>(null);
  const [noticing, setNoticing] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);

  // App state
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [equippedHat, setEquippedHat] = useState<string | null>(null);
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
        if (typeof data.dailyGoal === "number" || data.dailyGoal === null) setDailyGoal(data.dailyGoal);
        if (data.clanIntent !== undefined) setClanIntent(data.clanIntent);
        if (Array.isArray(data.completedIds)) setCompletedIds(data.completedIds);
        if (typeof data.totalPoints === "number") setTotalPoints(data.totalPoints);
        if (typeof data.equippedHat === "string" || data.equippedHat === null) {
          setEquippedHat(data.equippedHat);
        }
        if (typeof data.seenHomeTour === "boolean") setSeenHomeTour(data.seenHomeTour);
        if (typeof data.onboardingResumeStep === "number" || data.onboardingResumeStep === null) {
          setOnboardingResumeStep(data.onboardingResumeStep);
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
        dailyGoal,
        clanIntent,
        completedIds,
        totalPoints,
        equippedHat,
        seenHomeTour,
        onboardingResumeStep,
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
    dailyGoal,
    clanIntent,
    completedIds,
    totalPoints,
    equippedHat,
    seenHomeTour,
    onboardingResumeStep,
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
    setDailyGoal(null);
    setCompletedIds([]);
    setTotalPoints(0);
    setEquippedHat(null);
    setSeenHomeTour(false);
    setOnboardingResumeStep(null);
    setPrevStep(0);
    setStage({ kind: "welcome" });
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

  const completeProject = (projectId: string) => {
    if (completedIds.includes(projectId)) return;
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return;
    const newCount = completedIds.length + 1;
    setCompletedIds([...completedIds, projectId]);
    setTotalPoints(totalPoints + project.points);
    const unlocked = HATS.find((h) => h.unlockAt === newCount) ?? null;
    if (unlocked && !equippedHat) setEquippedHat(unlocked.key);
    setStage({ kind: "reward", projectId, unlockedHatKey: unlocked?.key ?? null });
  };

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

  const direction =
    (stage.kind === "parent" && stage.step < prevStep) ||
    (stage.kind === "child" && stage.step < prevStep) ||
    (stage.kind === "handover" && stage.step < prevStep)
      ? "screen-wrap-back"
      : "screen-wrap";

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
        // ── Meet Bugsy + bond loop first — explain the mascot's
        // role before asking the parent for anything ──
        case 0:
          return <ParentIntro2 tint={TINT} onNext={advanceParent} onBack={back} />;
        case 1:
          return <ParentBondGrowth tint={TINT} onNext={advanceParent} onBack={back} />;
        case 2:
          return <ParentBondAbsence tint={TINT} onNext={advanceParent} onBack={back} />;
        case 3:
          return <ParentBondTasks tint={TINT} onNext={advanceParent} onBack={back} />;
        case 4:
          return <ParentBondLoop tint={TINT} onNext={advanceParent} onBack={back} />;
        // ── Now collect info: parent identity, child, what they're noticing ──
        case 5:
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
        case 6:
          return (
            <ParentChildSetup
              tint={TINT}
              childName={childName}
              setChildName={setChildName}
              childAge={childAge}
              setChildAge={setChildAge}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 7:
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
        // ── Bugsy's answer — what your child will achieve ──
        case 8:
          return <ParentAchieve tint={TINT} onNext={advanceParent} onBack={back} />;
        case 9:
          return (
            <ParentLogin
              tint={TINT}
              childName={childName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 10:
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
        // ── Meet Bugsy + gesture bond beats first ──
        case 0:
          return <ChildIntro tint={TINT} onNext={advanceChild} />;
        case 1:
          return <ChildSootheBugsy tint={TINT} onNext={advanceChild} />;
        case 2:
          return <ChildFeedBugsy tint={TINT} onNext={advanceChild} />;
        // ── The narrative bridge: real-world tasks power Bugsy
        // up more than snacks. Sets up *why* the next screen
        // (quest picker) matters. ──
        case 3:
          return <ChildPowerSecret tint={TINT} onNext={advanceChild} />;
        // ── Teach the core loop: pick a real quest and play it.
        // The kid taps "Play this quest" → ScreenProjectDetail →
        // ScreenReward (with points flying into the clan rank) →
        // and lands back here on the next child step. ──
        case 4:
          return (
            <ChildPlantQuest
              tint={TINT}
              childName={friend}
              onPlay={(id) => {
                setOnboardingResumeStep(stage.step + 1);
                setStage({ kind: "project", projectId: id });
              }}
              onSkip={advanceChild}
            />
          );
        // ── Now collect: name, age, daily goal ──
        case 5:
          return (
            <ChildName
              tint={TINT}
              childName={childName}
              setChildName={setChildName}
              onNext={advanceChild}
            />
          );
        case 6:
          return (
            <ChildAge
              tint={TINT}
              childName={friend}
              childAge={childAge}
              setChildAge={setChildAge}
              onNext={advanceChild}
            />
          );
        case 7:
          return (
            <ChildDailyGoal
              tint={TINT}
              goal={dailyGoal}
              setGoal={setDailyGoal}
              onNext={advanceChild}
            />
          );
        // ── Promise, sendoff, grown-up handoff ──
        case 8:
          return <ChildPromise tint={TINT} onNext={advanceChild} />;
        case 9:
          return (
            <ChildSendoff
              tint={TINT}
              childName={friend}
              equippedHat={equippedHat}
              onEnter={advanceChild}
            />
          );
        case 10:
          return (
            <ChildAlmostDone
              tint={TINT}
              childName={friend}
              onNext={advanceChild}
            />
          );
        case 11:
          return (
            <ChildAdultLogin
              tint={TINT}
              childName={friend}
              onNext={advanceChild}
            />
          );
        case 12:
          return (
            <ChildParentDetails
              tint={TINT}
              childName={friend}
              parentName={parentName}
              setParentName={setParentName}
              relationship={relationship}
              setRelationship={setRelationship}
              onNext={advanceChild}
            />
          );
        // ── Grown-up shares what they're noticing, then sees
        // Bugsy's response (same beats as the parent flow) ──
        case 13:
          return (
            <ParentNoticing
              tint={TINT}
              childName={childName}
              noticing={noticing}
              setNoticing={setNoticing}
              onNext={advanceChild}
            />
          );
        case 14:
          return <ParentAchieve tint={TINT} onNext={advanceChild} />;
      }
      return null;
    }

    if (stage.kind === "handover") {
      const friend = childName || "friend";
      switch (stage.step) {
        case 0:
          return (
            <HandoverPrompt
              tint={TINT}
              childName={friend}
              onNext={advanceHandover}
            />
          );
        case 1:
          return (
            <ChildHelloKnown
              tint={TINT}
              childName={friend}
              parentName={parentName}
              relationship={relationship}
              onNext={advanceHandover}
            />
          );
        case 2:
          return <PinkyPromise tint={TINT} childName={friend} onNext={advanceHandover} />;
        case 3:
          return <DailyMap tint={TINT} onNext={advanceHandover} />;
        case 4:
          return (
            <FirstAction
              tint={TINT}
              childName={friend}
              onOpenProject={(id) => setStage({ kind: "project", projectId: id })}
              onSkip={() => setStage({ kind: "app", tab: "home" })}
            />
          );
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
            // picker, drop the kid back into the rest of the
            // onboarding flow instead of the app home.
            if (onboardingResumeStep !== null) {
              const resume = onboardingResumeStep;
              setOnboardingResumeStep(null);
              setStage({ kind: "child", step: resume });
            } else {
              setStage({ kind: "app", tab: "home" });
            }
          }}
        />
      );
    }

    if (stage.kind !== "app") return null;

    const tab = stage.tab;
    const completedCount = completedIds.length;

    const clanUnlocked = completedCount >= CLAN_UNLOCK_THRESHOLD;
    const lockedTabs: Tab[] = clanUnlocked ? [] : ["leaderboard"];

    if (tab === "home") {
      return (
        <ScreenHome
          tint={TINT}
          name={childName || parentName}
          completedProjects={completedCount}
          totalPoints={totalPoints}
          streak={completedCount > 0 ? Math.min(completedCount, 30) : 0}
          equippedHat={equippedHat}
          tab={tab}
          setTab={setTab}
          onOpenProject={(id) => setStage({ kind: "project", projectId: id })}
          onSeeAllProjects={() => setTab("projects")}
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
    stage.kind === "welcome"
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
