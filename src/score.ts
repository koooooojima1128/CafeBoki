import { ALL_EVENT_IDS, DAYS, TOTAL_EVENTS, type DayDef } from '@/data/days';

/* --------------------------------------------------------------- review */

/** Event ids the player got wrong on the first try. */
export function wrongEventIds(answers: Record<string, boolean>): string[] {
  return Object.keys(answers).filter((id) => answers[id] === false);
}

/* --------------------------------------------------------------- streak */

const dayMs = 24 * 60 * 60 * 1000;

function isoToUTC(d: string): number {
  const [y, m, day] = d.split('-').map(Number);
  return Date.UTC(y, m - 1, day);
}

/**
 * Consecutive-calendar-day learning streak, counting back from today.
 * Uses the set of distinct dates in completedAt plus lastPlayedAt.
 */
export function streakDays(
  completedAt: Record<number, string>,
  lastPlayedAt: string | null,
): number {
  const dates = new Set<string>(Object.values(completedAt));
  if (lastPlayedAt) dates.add(lastPlayedAt);
  if (dates.size === 0) return 0;

  const todayUTC = isoToUTC(new Date().toISOString().slice(0, 10));
  const has = (t: number) =>
    dates.has(new Date(t).toISOString().slice(0, 10));

  // streak is only "alive" if the player did something today or yesterday
  let cursor = todayUTC;
  if (!has(cursor)) {
    cursor -= dayMs;
    if (!has(cursor)) return 0;
  }
  let n = 0;
  while (has(cursor)) {
    n += 1;
    cursor -= dayMs;
  }
  return n;
}

/* ----------------------------------------------------------------- stats */

export interface Stats {
  answered: number;
  correct: number;
  /** first-try correct ÷ answered */
  rate: number;
  /** first-try correct ÷ every event that exists, as 0–100 */
  score: number;
  completedDays: number;
  totalDays: number;
}

export function overallStats(
  answers: Record<string, boolean>,
  completedDays: number[],
): Stats {
  const answered = ALL_EVENT_IDS.filter((id) => id in answers).length;
  const correct = ALL_EVENT_IDS.filter((id) => answers[id]).length;
  return {
    answered,
    correct,
    rate: answered ? correct / answered : 0,
    score: TOTAL_EVENTS ? Math.round((correct / TOTAL_EVENTS) * 100) : 0,
    completedDays: completedDays.length,
    totalDays: DAYS.length,
  };
}

/** 0 (not attempted) or 1–3 stars for a day, from first-try correctness. */
export function dayStars(day: DayDef, answers: Record<string, boolean>): number {
  const ids = day.events.map((e) => e.id);
  const answered = ids.filter((id) => id in answers).length;
  if (!answered) return 0;
  const correct = ids.filter((id) => answers[id]).length;
  const r = correct / ids.length;
  if (r >= 0.9) return 3;
  if (r >= 0.7) return 2;
  return 1;
}

/* ----------------------------------------------------------------- ranks */

export interface Rank {
  id: string;
  name: string;
  note: string;
  /** unlocked once (first-try correct ÷ all events) ≥ this */
  minFrac: number;
}

/** 和風の呼び名。ラベルはここだけ変えれば全画面に反映される。 */
export const RANKS: Rank[] = [
  { id: 'minarai', name: '見習い', note: 'まずは一歩', minFrac: 0 },
  { id: 'decchi', name: '丁稚', note: '基本の仕訳がわかってきた', minFrac: 0.15 },
  { id: 'tedai', name: '手代', note: '掛け・手形もこわくない', minFrac: 0.4 },
  { id: 'bantou', name: '番頭', note: '決算の入口まで到達', minFrac: 0.65 },
  { id: 'shihainin', name: '支配人', note: '帳簿を締められる', minFrac: 0.85 },
  { id: 'oodanna', name: '大旦那', note: '簿記3級をほぼ完璧に一周', minFrac: 0.97 },
];

export function rankForCorrect(correct: number): Rank {
  const frac = TOTAL_EVENTS ? correct / TOTAL_EVENTS : 0;
  let r = RANKS[0];
  for (const cand of RANKS) if (frac >= cand.minFrac) r = cand;
  return r;
}

export function rankById(id: string): Rank {
  return RANKS.find((r) => r.id === id) ?? RANKS[0];
}

/* ---------------------------------------------------------------- badges */

export interface Badge {
  id: string;
  name: string;
  desc: string;
  got: boolean;
}

export function badgesFor(
  answers: Record<string, boolean>,
  completedDays: number[],
): Badge[] {
  const out: Badge[] = DAYS.map((d) => ({
    id: `day${d.day}`,
    name: `DAY ${d.day}`,
    desc: d.title,
    got: completedDays.includes(d.day),
  }));

  const perfectDay = DAYS.some((d) => {
    if (!completedDays.includes(d.day)) return false;
    return d.events.every((e) => answers[e.id]);
  });
  out.push({
    id: 'perfectDay',
    name: '満点DAY',
    desc: 'どこかの DAY を一発で全問正解',
    got: perfectDay,
  });

  out.push({
    id: 'complete',
    name: '完走',
    desc: 'すべての DAY をクリア',
    got: DAYS.length > 0 && DAYS.every((d) => completedDays.includes(d.day)),
  });

  return out;
}
