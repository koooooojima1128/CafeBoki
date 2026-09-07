import { Platform } from 'react-native';
import { APP_URL } from '@/config';

/** Everything needed to render someone's 修了証 from a URL alone. */
export interface CertPayload {
  name: string;
  score: number; // 0-100
  done: number; // completed days
  total: number; // total days
  rankId: string;
  date: string; // YYYY-MM-DD
  rate: number; // 0-1 first-try rate
}

const SEP = '~';

export function encodeCert(p: CertPayload): string {
  const name = p.name.replace(/[~|\n]/g, ' ').trim().slice(0, 24) || 'あなた';
  const raw = [
    name,
    p.score,
    p.done,
    p.total,
    p.rankId,
    p.date,
    Math.round(p.rate * 100),
  ].join(SEP);
  return encodeURIComponent(raw);
}

export function decodeCert(d: string): CertPayload | null {
  try {
    const parts = decodeURIComponent(d).split(SEP);
    if (parts.length < 7) return null;
    const [name, score, done, total, rankId, date, rate] = parts;
    return {
      name,
      score: Number(score) || 0,
      done: Number(done) || 0,
      total: Number(total) || 0,
      rankId,
      date,
      rate: (Number(rate) || 0) / 100,
    };
  } catch {
    return null;
  }
}

/** Absolute base URL for share links. */
export function appBase(): string {
  if (Platform.OS === 'web' && typeof location !== 'undefined') {
    return location.origin;
  }
  return APP_URL;
}

export function certLink(p: CertPayload): string {
  return `${appBase()}/cert?d=${encodeCert(p)}`;
}

export function shareMessage(p: CertPayload, rankName: string): string {
  const head =
    p.done >= p.total && p.total > 0
      ? `「カフェ簿記」DAY ${p.total} を完走！ 🧾`
      : `「カフェ簿記」DAY ${p.done}/${p.total} まで到達。`;
  return `${head} 称号「${rankName}」／スコア ${p.score}点・一発正答率 ${Math.round(
    p.rate * 100,
  )}%`;
}
