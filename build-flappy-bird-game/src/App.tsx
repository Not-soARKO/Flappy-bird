import { useCallback, useState } from "react";
import { loadScores, saveScore, type ScoreEntry } from "./scores";
import { MainMenu } from "./components/MainMenu";
import { Game } from "./components/Game";
import { ExitScreen } from "./components/ExitScreen";

type View = "menu" | "game" | "exit";

export default function App() {
  const [view, setView] = useState<View>("menu");
  const [scores, setScores] = useState<ScoreEntry[]>(() => loadScores());

  const bestScore = scores.length ? scores[0].score : 0;

  const handleScore = useCallback((score: number) => {
    if (score > 0) {
      setScores(saveScore(score));
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cyan-200 via-sky-300 to-indigo-400 p-4">
      <div className="w-full max-w-[420px]">
        {view === "menu" && (
          <MainMenu
            scores={scores}
            onPlay={() => setView("game")}
            onLeave={() => setView("exit")}
          />
        )}

        {view === "game" && (
          <Game
            bestScore={bestScore}
            onExit={() => setView("menu")}
            onScore={handleScore}
          />
        )}

        {view === "exit" && (
          <ExitScreen scores={scores} onReturn={() => setView("menu")} />
        )}
      </div>
    </main>
  );
}
