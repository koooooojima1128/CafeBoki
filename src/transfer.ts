import type { PersistedState } from '@/state/GameContext';

/**
 * Encode / decode the whole progress as a copy-pasteable code.
 * Not encryption — just base64 of the JSON so it survives a text field.
 */

// btoa / atob exist in Hermes (RN 0.74+) and every browser.
function b64encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

function b64decode(s: string): string {
  return decodeURIComponent(escape(atob(s)));
}

const PREFIX = 'BOKI1:';

export function encodeProgress(state: PersistedState): string {
  return PREFIX + b64encode(JSON.stringify(state));
}

export function decodeProgress(code: string): Partial<PersistedState> | null {
  try {
    const raw = code.trim();
    const body = raw.startsWith(PREFIX) ? raw.slice(PREFIX.length) : raw;
    const obj = JSON.parse(b64decode(body));
    if (!obj || typeof obj !== 'object') return null;
    // keep only known fields
    const out: Partial<PersistedState> = {};
    if (typeof obj.currentDay === 'number') out.currentDay = obj.currentDay;
    if (obj.dayProgress && typeof obj.dayProgress === 'object')
      out.dayProgress = obj.dayProgress;
    if (obj.answers && typeof obj.answers === 'object') out.answers = obj.answers;
    if (Array.isArray(obj.completedDays)) out.completedDays = obj.completedDays;
    if (obj.completedAt && typeof obj.completedAt === 'object')
      out.completedAt = obj.completedAt;
    if (typeof obj.lastPlayedAt === 'string' || obj.lastPlayedAt === null)
      out.lastPlayedAt = obj.lastPlayedAt;
    if (typeof obj.name === 'string') out.name = obj.name;
    return out;
  } catch {
    return null;
  }
}
