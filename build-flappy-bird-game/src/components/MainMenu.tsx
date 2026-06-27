import { useEffect } from "react";
import { GameFrame } from "./GameFrame";
import { Bird } from "./Bird";
import { formatDate, type ScoreEntry } from "../scores";

type MainMenuProps = {
  scores: ScoreEntry[];
  onPlay: () => void;
  onLeave: () => void;
};

export function MainMenu({ scores, onPlay, onLeave }: MainMenuProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        onPlay();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPlay]);

  const best = scores[0];
  const top = scores.slice(0, 4);

  return (
    <GameFrame>
      <div className="relative z-10 flex h-full flex-col items-center px-6 py-7 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-sky-900/70">
          Arcade Classic
        </p>
        <h1 className="mt-1 text-5xl font-black tracking-tight text-sky-950 [text-shadow:0_3px_0_#7dd3fc]">
          Flappy Bird
        </h1>

        <div className="animate-floaty my-1">
          <Bird width={76} height={64} slow />
        </div>

        {/* High score card */}
        <div className="w-full rounded-2xl border-4 border-amber-900 bg-amber-50/95 px-5 py-3 shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700">
            High Score
          </p>
          <p className="text-5xl font-black leading-none text-amber-600">
            {best ? best.score : 0}
          </p>
          <p className="mt-1 text-xs font-semibold text-amber-800/80">
            {best ? `Set on ${formatDate(best.date)}` : "Play to set a record"}
          </p>
        </div>

        {/* Leaderboard */}
        {top.length > 0 && (
          <div className="mt-3 w-full rounded-xl border-2 border-sky-900/25 bg-white/45 px-4 py-2">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-900/70">
              Top Scores
            </p>
            <ul className="space-y-0.5">
              {top.map((entry, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-sm font-bold text-sky-950"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-900 text-[11px] text-white">
                      {index + 1}
                    </span>
                    {entry.score}
                  </span>
                  <span className="text-[11px] font-semibold text-sky-900/60">
                    {formatDate(entry.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto w-full space-y-2.5 pt-4">
          <button
            onClick={onPlay}
            className="animate-pulse-glow w-full rounded-xl bg-amber-400 px-6 py-3 text-xl font-black uppercase tracking-wide text-amber-950 transition active:translate-y-1"
          >
            ▶ Play
          </button>
          <button
            onClick={onLeave}
            className="w-full rounded-xl border-2 border-rose-700 bg-white/70 px-6 py-2 text-sm font-bold uppercase tracking-wide text-rose-700 transition hover:bg-white active:translate-y-0.5"
          >
            Leave Game
          </button>
        </div>
      </div>
    </GameFrame>
  );
}
