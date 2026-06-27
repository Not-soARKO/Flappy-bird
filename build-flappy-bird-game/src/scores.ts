export type ScoreEntry = { score: number; date: string };

const KEY = "flappy-scores-v1";

export function loadScores(): ScoreEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (entry) =>
          entry &&
          typeof entry.score === "number" &&
          typeof entry.date === "string"
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export function saveScore(score: number): ScoreEntry[] {
  const list = loadScores();
  list.push({ score, date: new Date().toISOString() });
  list.sort((a, b) => b.score - a.score);
  const top = list.slice(0, 8);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(top));
  }

  return top;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
