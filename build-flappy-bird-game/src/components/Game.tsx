import { useCallback, useEffect, useRef, useState } from "react";
import {
  BIRD_HEIGHT,
  BIRD_WIDTH,
  BIRD_X,
  FLAP_FORCE,
  GRAVITY,
  GROUND_HEIGHT,
  PIPE_GAP,
  PIPE_INTERVAL,
  PIPE_SPEED,
  PIPE_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../constants";
import { SunAndClouds } from "./SunAndClouds";
import { Bird } from "./Bird";

type Phase = "ready" | "running" | "over";

type Pipe = {
  id: number;
  x: number;
  gapY: number;
  passed: boolean;
};

type State = {
  phase: Phase;
  birdY: number;
  birdVelocity: number;
  pipes: Pipe[];
  score: number;
  spawnTimer: number;
};

type GameProps = {
  bestScore: number;
  onExit: () => void;
  onScore: (score: number) => void;
};

const initialBirdY = WORLD_HEIGHT * 0.42;

const PIPE_BODY_BG =
  "linear-gradient(90deg,#14532d 0%,#22c55e 20%,#4ade80 52%,#16a34a 78%,#14532d 100%),repeating-linear-gradient(0deg,rgba(255,255,255,0.2) 0 8px,rgba(0,0,0,0.08) 8px 16px)";
const PIPE_CAP_BG =
  "linear-gradient(90deg,#166534,#4ade80 48%,#166534),repeating-linear-gradient(90deg,rgba(255,255,255,0.22) 0 10px,rgba(0,0,0,0.1) 10px 20px)";

const createPipe = (id: number, x: number): Pipe => {
  const topMargin = 90;
  const bottomMargin = GROUND_HEIGHT + 90;
  const gapHalf = PIPE_GAP / 2;
  const minGapY = topMargin + gapHalf;
  const maxGapY = WORLD_HEIGHT - bottomMargin - gapHalf;

  return {
    id,
    x,
    gapY: minGapY + Math.random() * (maxGapY - minGapY),
    passed: false,
  };
};

export function Game({ bestScore, onExit, onScore }: GameProps) {
  const [state, setState] = useState<State>(() => ({
    phase: "ready",
    birdY: initialBirdY,
    birdVelocity: 0,
    pipes: [createPipe(1, 9999)],
    score: 0,
    spawnTimer: 0,
  }));

  const stateRef = useRef(state);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const pipeIdRef = useRef(2);
  const onScoreRef = useRef(onScore);
  const onExitRef = useRef(onExit);
  const scoredRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    onScoreRef.current = onScore;
  }, [onScore]);

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  const resetRound = useCallback((phase: Phase) => {
    scoredRef.current = false;
    const next: State = {
      ...stateRef.current,
      phase,
      birdY: initialBirdY,
      birdVelocity: 0,
      pipes: [createPipe(pipeIdRef.current++, 9999)],
      score: 0,
      spawnTimer: 0,
    };
    stateRef.current = next;
    setState(next);
  }, []);

  const endRound = useCallback(() => {
    const current = stateRef.current;
    if (current.phase === "over") {
      return;
    }

    const next: State = { ...current, phase: "over" };
    stateRef.current = next;
    setState(next);

    if (!scoredRef.current) {
      scoredRef.current = true;
      onScoreRef.current(current.score);
    }
  }, []);

  const flap = useCallback(() => {
    const current = stateRef.current;

    if (current.phase === "over" || current.phase === "ready") {
      resetRound("running");
      const next: State = { ...stateRef.current, birdVelocity: FLAP_FORCE };
      stateRef.current = next;
      setState(next);
      return;
    }

    const next: State = { ...current, birdVelocity: FLAP_FORCE };
    stateRef.current = next;
    setState(next);
  }, [resetRound]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        flap();
      } else if (event.code === "Enter" && stateRef.current.phase !== "running") {
        event.preventDefault();
        resetRound("running");
      } else if (event.code === "Escape") {
        event.preventDefault();
        onExitRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flap, resetRound]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      const previousTime = previousTimeRef.current ?? timestamp;
      let dt = (timestamp - previousTime) / 1000;
      previousTimeRef.current = timestamp;
      dt = Math.min(dt, 0.033);

      const current = stateRef.current;

      if (current.phase === "running") {
        const pipes = current.pipes
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED * dt }))
          .filter((pipe) => pipe.x + PIPE_WIDTH > -4);

        let spawnTimer = current.spawnTimer + dt;
        if (spawnTimer >= PIPE_INTERVAL) {
          spawnTimer -= PIPE_INTERVAL;
          pipes.push(createPipe(pipeIdRef.current++, WORLD_WIDTH + 20));
        }

        const birdVelocity = current.birdVelocity + GRAVITY * dt;
        const birdY = current.birdY + birdVelocity * dt;
        let score = current.score;

        for (const pipe of pipes) {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.passed = true;
            score += 1;
          }
        }

        const birdBottom = birdY + BIRD_HEIGHT;
        const hitGround = birdBottom >= WORLD_HEIGHT - GROUND_HEIGHT;
        const hitCeiling = birdY <= 0;

        let hitPipe = false;
        for (const pipe of pipes) {
          const overlapsX =
            BIRD_X + BIRD_WIDTH > pipe.x && BIRD_X < pipe.x + PIPE_WIDTH;
          if (!overlapsX) {
            continue;
          }

          const gapTop = pipe.gapY - PIPE_GAP / 2;
          const gapBottom = pipe.gapY + PIPE_GAP / 2;
          const inGap = birdY >= gapTop && birdBottom <= gapBottom;
          if (!inGap) {
            hitPipe = true;
            break;
          }
        }

        const next: State = {
          ...current,
          birdY,
          birdVelocity,
          pipes,
          score,
          spawnTimer,
        };

        stateRef.current = next;
        setState(next);

        if (hitGround || hitCeiling || hitPipe) {
          endRound();
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endRound]);

  const rotation = Math.max(-1, Math.min(1, state.birdVelocity / 500)) * 26;
  const shownBest = Math.max(bestScore, state.score);

  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={flap}
      aria-label="Flappy Bird game"
      className="relative mx-auto h-[640px] w-full max-w-[420px] touch-none overflow-hidden rounded-2xl border-4 border-sky-950 bg-gradient-to-b from-cyan-300 via-sky-300 to-blue-200 shadow-2xl shadow-sky-900/40 outline-none"
    >
      <SunAndClouds />

      {/* Top HUD */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between p-2">
        <button
          onPointerDown={(event) => {
            event.stopPropagation();
            onExit();
          }}
          className="rounded-lg border-2 border-sky-950 bg-white/85 px-3 py-1 text-xs font-bold text-sky-900 shadow transition hover:bg-white active:translate-y-0.5"
        >
          ← Menu
        </button>
        <div className="rounded-lg border-2 border-sky-950 bg-white/85 px-3 py-1 text-xs font-bold text-sky-900 shadow">
          Best {shownBest}
        </div>
      </div>

      {/* Pipes */}
      {state.pipes.map((pipe) => {
        const gapTop = pipe.gapY - PIPE_GAP / 2;
        const gapBottom = pipe.gapY + PIPE_GAP / 2;
        return (
          <div key={pipe.id}>
            <div
              className="absolute border-2 border-emerald-950"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: gapTop,
                backgroundImage: PIPE_BODY_BG,
              }}
            />
            <div
              className="absolute border-2 border-emerald-950"
              style={{
                left: pipe.x - 6,
                top: gapTop - 18,
                width: PIPE_WIDTH + 12,
                height: 18,
                backgroundImage: PIPE_CAP_BG,
              }}
            />
            <div
              className="absolute border-2 border-emerald-950"
              style={{
                left: pipe.x,
                top: gapBottom,
                width: PIPE_WIDTH,
                height: WORLD_HEIGHT - GROUND_HEIGHT - gapBottom,
                backgroundImage: PIPE_BODY_BG,
              }}
            />
            <div
              className="absolute border-2 border-emerald-950"
              style={{
                left: pipe.x - 6,
                top: gapBottom,
                width: PIPE_WIDTH + 12,
                height: 18,
                backgroundImage: PIPE_CAP_BG,
              }}
            />
          </div>
        );
      })}

      {/* Score */}
      <div className="absolute left-0 right-0 top-12 z-20 text-center text-6xl font-black text-white [text-shadow:0_3px_0_#0c4a6e,0_0_18px_rgba(12,74,110,0.5)]">
        {state.score}
      </div>

      {/* Bird */}
      <div
        className="absolute z-10"
        style={{
          left: BIRD_X,
          top: state.birdY,
          width: BIRD_WIDTH,
          height: BIRD_HEIGHT,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
        }}
      >
        <div className={state.phase === "ready" ? "animate-floaty" : ""}>
          <Bird
            width={BIRD_WIDTH}
            height={BIRD_HEIGHT}
            slow={state.phase !== "running"}
          />
        </div>
      </div>

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t-4 border-lime-900 bg-lime-500"
        style={{
          height: GROUND_HEIGHT,
          backgroundImage:
            "repeating-linear-gradient(90deg,#84cc16 0 26px,#65a30d 26px 52px)",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-700/90" />
      </div>

      {/* Ready overlay */}
      {state.phase === "ready" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-sky-950/10 text-center">
          <p className="text-4xl font-black text-white [text-shadow:0_3px_0_#0c4a6e]">
            Get Ready
          </p>
          <p className="rounded-full bg-white/85 px-4 py-1 text-sm font-bold text-sky-900">
            Tap, click, or press Space
          </p>
        </div>
      )}

      {/* Game over overlay */}
      {state.phase === "over" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-sky-950/40 px-6 text-center">
          <div className="animate-pop rounded-2xl border-4 border-amber-900 bg-amber-50/95 px-8 py-5 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
              Game Over
            </p>
            <p className="mt-1 text-6xl font-black leading-none text-amber-600">
              {state.score}
            </p>
            <p className="mt-2 text-sm font-bold text-amber-800/80">
              Best {shownBest}
            </p>
          </div>
          <div className="flex w-full max-w-[260px] flex-col gap-2">
            <button
              onPointerDown={(event) => {
                event.stopPropagation();
                flap();
              }}
              className="rounded-xl border-b-4 border-amber-800 bg-amber-400 px-6 py-3 text-lg font-black text-amber-950 shadow transition hover:bg-amber-300 active:translate-y-1"
            >
              Play Again
            </button>
            <button
              onPointerDown={(event) => {
                event.stopPropagation();
                onExit();
              }}
              className="rounded-xl border-2 border-sky-950 bg-white/90 px-6 py-2 text-sm font-bold text-sky-900 shadow transition hover:bg-white active:translate-y-0.5"
            >
              Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
