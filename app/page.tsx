"use client";

import { useState } from "react";
import {
  CLAN_BASE,
  HATS,
  PROJECTS,
  TINT,
  type ClanIntent,
  type Tab,
} from "./lib/data";
import {
  PARENT_STEPS,
  ParentAccount,
  ParentChildAge,
  ParentChildName,
  ParentClan,
  ParentDone,
  ParentIntro,
  ParentName,
} from "./components/onboarding/ParentFlow";
import { Welcome } from "./components/onboarding/Welcome";
import {
  ChildHelloKnown,
  DailyMap,
  FirstAction,
  PinkyPromise,
} from "./components/onboarding/Handover";
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
  | { kind: "parent"; step: number }
  | { kind: "handover"; step: number }
  | { kind: "app"; tab: Tab }
  | { kind: "project"; projectId: string }
  | { kind: "reward"; projectId: string; unlockedHatKey: string | null };

const HANDOVER_STEPS = 4; // 0: helloKnown, 1: pinky, 2: dailyMap, 3: firstAction

export default function Home() {
  const [stage, setStage] = useState<Stage>({ kind: "welcome" });
  const [prevStep, setPrevStep] = useState(0);

  // Onboarding state
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState<number | null>(null);
  const [clanIntent, setClanIntent] = useState<ClanIntent | null>(null);

  // App state
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [equippedHat, setEquippedHat] = useState<string | null>(null);

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
    setParentName("");
    setChildName("");
    setChildAge(null);
    setClanIntent(null);
    setCompletedIds([]);
    setTotalPoints(0);
    setEquippedHat(null);
    setPrevStep(0);
    setStage({ kind: "welcome" });
  };

  const logout = () => {
    if (typeof window !== "undefined" && !window.confirm("Log out and reset your progress?")) {
      return;
    }
    restart();
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

  const advanceParent = () => {
    if (stage.kind !== "parent") return;
    setPrevStep(stage.step);
    const next = stage.step + 1;
    if (next >= PARENT_STEPS) {
      // Parent flow ends → hand the phone to the child (handover step 0)
      setStage({ kind: "handover", step: 0 });
    } else {
      setStage({ kind: "parent", step: next });
    }
  };
  const backParent = () => {
    if (stage.kind !== "parent") return;
    setPrevStep(stage.step);
    const prev = Math.max(0, stage.step - 1);
    setStage({ kind: "parent", step: prev });
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
    (stage.kind === "handover" && stage.step < prevStep)
      ? "screen-wrap-back"
      : "screen-wrap";

  const renderStage = () => {
    if (stage.kind === "welcome") {
      return (
        <Welcome
          tint={TINT}
          onGetStarted={() => setStage({ kind: "parent", step: 0 })}
          // "I already have an account" → jump straight to the account/sign-in step
          onHaveAccount={() => setStage({ kind: "parent", step: 2 })}
        />
      );
    }

    if (stage.kind === "parent") {
      // Step 0 has no "back" target — onBack is undefined so the chevron hides
      const back = stage.step === 0 ? undefined : backParent;
      switch (stage.step) {
        case 0:
          return (
            <ParentName
              tint={TINT}
              parentName={parentName}
              setParentName={setParentName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 1:
          return (
            <ParentIntro
              tint={TINT}
              parentName={parentName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 2:
          return <ParentAccount tint={TINT} onNext={advanceParent} onBack={back} />;
        case 3:
          return (
            <ParentChildName
              tint={TINT}
              childName={childName}
              setChildName={setChildName}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 4:
          return (
            <ParentChildAge
              tint={TINT}
              childName={childName}
              childAge={childAge}
              setChildAge={setChildAge}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 5:
          return (
            <ParentClan
              tint={TINT}
              childName={childName}
              intent={clanIntent}
              setIntent={setClanIntent}
              onNext={advanceParent}
              onBack={back}
            />
          );
        case 6:
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

    if (stage.kind === "handover") {
      const friend = childName || "friend";
      switch (stage.step) {
        case 0:
          return (
            <ChildHelloKnown
              tint={TINT}
              childName={friend}
              parentName={parentName}
              onNext={advanceHandover}
            />
          );
        case 1:
          return <PinkyPromise tint={TINT} childName={friend} onNext={advanceHandover} />;
        case 2:
          return <DailyMap tint={TINT} onNext={advanceHandover} />;
        case 3:
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

      // completedIds already includes this project (set in completeProject)
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
          onContinue={() => setStage({ kind: "app", tab: "home" })}
        />
      );
    }

    if (stage.kind !== "app") return null;

    const tab = stage.tab;
    const completedCount = completedIds.length;

    if (tab === "home") {
      return (
        <ScreenHome
          tint={TINT}
          name={childName || parentName}
          clan={clan}
          clanRank={42}
          completedProjects={completedCount}
          totalPoints={totalPoints}
          streak={completedCount > 0 ? Math.min(completedCount, 30) : 0}
          equippedHat={equippedHat}
          tab={tab}
          setTab={setTab}
          onOpenProject={(id) => setStage({ kind: "project", projectId: id })}
          onSeeAllProjects={() => setTab("projects")}
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
        />
      );
    }
    return null;
  };

  // unique key for screen-transition animation
  const key =
    stage.kind === "welcome"
      ? "welcome"
      : stage.kind === "parent"
      ? `parent-${stage.step}`
      : stage.kind === "handover"
      ? `handover-${stage.step}`
      : stage.kind === "app"
      ? `app-${stage.tab}`
      : stage.kind === "project"
      ? `project-${stage.projectId}`
      : `reward-${stage.projectId}`;

  return (
    <div className="app-frame">
      <div
        key={key}
        className={direction}
        style={{ width: "100%", height: "100dvh", position: "relative" }}
      >
        {renderStage()}
      </div>
    </div>
  );
}
