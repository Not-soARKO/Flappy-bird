import { useEffect } from "react";
import { GameFrame } from "./GameFrame";
import { Bird } from "./Bird";
import { formatDate, type ScoreEntry } from "../scores";

type ExitScreenProps = {
  scores: ScoreEntry[];
  onReturn: () => void;
};

export function ExitScreen({ scores, onReturn }: ExitScreenProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        onReturn();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onReturn]);

  const best = scores[0];

  return (
    <GameFrame>
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="animate-floaty mb-4">
          <Bird width={92} height={78} slow />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-sky-950 [text-shadow:0_3px_0_#7dd3fc]">
          You left the game
        </h2>
        <p className="mt-2 max-w-[290px] text-sm font-semibold text-sky-900/80">
          Thanks for playing! Your little bird will rest its wings until you
          return.
        </p>

        {best && (
          <div className="mt-5 rounded-2xl border-4 border-amber-900 bg-amber-50/95 px-8 py-3 shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-700">
              Your High Score
            </p>
            <p className="text-5xl font-black leading-none text-amber-600">
              {best.score}
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-800/80">
              {formatDate(best.date)}
            </p>
          </div>
        )}

        <button
          onClick={onReturn}
          className="mt-7 rounded-xl border-b-4 border-emerald-800 bg-emerald-400 px-8 py-3 text-lg font-black uppercase tracking-wide text-emerald-950 shadow-lg transition hover:bg-emerald-300 active:translate-y-1"
        >
          Return to Menu
        </button>
      </div>
    </GameFrame>
  );
}
