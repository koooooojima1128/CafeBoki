import type { QuizOption } from './types';

/** FNV-1a string hash → uint32. */
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A stable per-event shuffle of the quiz options.
 *
 * The source data always lists the correct option first; without this every
 * answer would sit at the top. Seeding by the event id keeps the order fixed
 * for a given question (question screen, reveal, revisits, review) while
 * spreading the correct answer across positions.
 */
export function shuffleOptions(
  eventId: string,
  options: QuizOption[],
): QuizOption[] {
  const rnd = mulberry32(hashStr(eventId));
  const a = options.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
