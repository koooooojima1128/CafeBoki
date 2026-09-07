import type { Side } from './accounts';

/**
 * The "簿記翻訳エンジン" data shape.
 *
 *   商売イベント (BusinessEvent)
 *     ├─ quiz            … 「何が起きた？」 selection question
 *     ├─ plainSummary    … one-line plain-language description of the economic effect
 *     ├─ changes         … how the company changed (SCREEN 03「会社の変化」)
 *     ├─ journal         … the resulting 仕訳 (SCREEN 04「簿記に翻訳すると」)
 *     ├─ why             … why the entry looks like this
 *     └─ statementImpact … effect on PL / BS
 *
 * Same event can later be re-rendered for 3級 / 2級 / 会計士 by adding fields;
 * the shared spine (changes + journal) stays stable.
 */

export interface QuizOption {
  id: string;
  label: string;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  correctId: string;
  /** Shown after a correct answer. */
  correctFeedback: string;
  /** Shown after a wrong answer — a nudge, not the full explanation. */
  wrongFeedback: string;
}

export interface EconomicChange {
  accountId: string;
  label: string;
  /** 資産 / 負債 / 純資産 / 収益 / 費用 */
  category: string;
  /** Signed yen, in the account's natural-increase direction. */
  delta: number;
}

export interface JournalLine {
  side: Side;
  accountId: string;
  label: string;
  amount: number;
}

export interface BusinessEvent {
  id: string;
  /** 1-based position in the day. */
  no: number;
  /** e.g. 'EVENT 01' */
  label: string;
  /** short scene tag, e.g. '開業' */
  scene: string;
  narrative: string;
  quiz: Quiz;
  plainSummary: string;
  changes: EconomicChange[];
  journal: JournalLine[];
  why: string[];
  statementImpact: { pl?: string; bs?: string };
}
