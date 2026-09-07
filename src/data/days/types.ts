import type { BusinessEvent } from '@/engine/types';

/** One in-game "day": a themed batch of 商売イベント. */
export interface DayDef {
  day: number;
  /** short headline, e.g. "お金の置き場所と、貸し借り" */
  title: string;
  /** one-line description shown on the day card */
  subtitle: string;
  /** concept chips, e.g. ["普通預金", "手形", "前払金・前受金"] */
  focus: string[];
  events: BusinessEvent[];
  /** bullets for the CLEAR screen「今日わかったこと」 */
  recap: string[];
  /** the book-closing day: settlement shows the final BS only, no per-day PL. */
  closing?: boolean;
}
