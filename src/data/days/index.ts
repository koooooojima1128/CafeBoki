import type { BusinessEvent } from '@/engine/types';
import {
  applyEvents,
  buildIncomeStatement,
  type Balances,
} from '@/engine/ledger';
import type { DayDef } from './types';
import { DAY1 } from './day1';
import { DAY2 } from './day2';
import { DAY3 } from './day3';
import { DAY4 } from './day4';
import { DAY5 } from './day5';
import { DAY6 } from './day6';
import { DAY7 } from './day7';
import { DAY8 } from './day8';
import { DAY9 } from './day9';
import { DAY10 } from './day10';
import { DAY11 } from './day11';
import { DAY12 } from './day12';
import { DAY13 } from './day13';
import { DAY14 } from './day14';

export type { DayDef } from './types';

/** All days, in order. Add the next day here and everything else picks it up. */
export const DAYS: DayDef[] = [
  DAY1,
  DAY2,
  DAY3,
  DAY4,
  DAY5,
  DAY6,
  DAY7,
  DAY8,
  DAY9,
  DAY10,
  DAY11,
  DAY12,
  DAY13,
  DAY14,
];

export const FIRST_DAY = DAYS[0].day;
export const LAST_DAY = DAYS[DAYS.length - 1].day;

export function getDay(day: number): DayDef | undefined {
  return DAYS.find((d) => d.day === day);
}

export function nextDay(day: number): DayDef | undefined {
  return getDay(day + 1);
}

/** Every event from day 1 up to and including `day`. */
export function eventsThrough(day: number): BusinessEvent[] {
  return DAYS.filter((d) => d.day <= day).flatMap((d) => d.events);
}

/** Every event strictly before `day`. */
export function eventsBefore(day: number): BusinessEvent[] {
  return DAYS.filter((d) => d.day < day).flatMap((d) => d.events);
}

/** Cumulative balances at the end of `day`. */
export function balancesThrough(day: number): Balances {
  return applyEvents(eventsThrough(day));
}

/** Profit earned on `day` alone (its own revenue − its own expense). */
export function dayProfit(day: number): number {
  const d = getDay(day);
  if (!d) return 0;
  return buildIncomeStatement(applyEvents(d.events)).profit;
}

export const TOTAL_EVENTS = DAYS.reduce((sum, d) => sum + d.events.length, 0);

export const ALL_EVENT_IDS: string[] = DAYS.flatMap((d) =>
  d.events.map((e) => e.id),
);

export const ALL_EVENTS: BusinessEvent[] = DAYS.flatMap((d) => d.events);

const EVENT_BY_ID: Record<string, BusinessEvent> = Object.fromEntries(
  ALL_EVENTS.map((e) => [e.id, e]),
);

export function getEvent(id: string): BusinessEvent | undefined {
  return EVENT_BY_ID[id];
}

/** which day an event belongs to (from its id, e.g. "d12e03" -> 12). */
export function dayOfEvent(id: string): number {
  const m = /^d(\d+)e/.exec(id);
  return m ? Number(m[1]) : 0;
}

/**
 * Events the player has actually reached: every event of a completed day,
 * plus the events of the current day up to their progress.
 */
export function reachedEvents(
  completedDays: number[],
  dayProgress: Record<number, number>,
): BusinessEvent[] {
  const out: BusinessEvent[] = [];
  for (const d of DAYS) {
    if (completedDays.includes(d.day)) {
      out.push(...d.events);
    } else {
      const n = dayProgress[d.day] ?? 0;
      if (n > 0) out.push(...d.events.slice(0, n));
    }
  }
  return out;
}
