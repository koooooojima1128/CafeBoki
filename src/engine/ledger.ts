import {
  ACCOUNTS,
  AccountType,
  accountNormalSide,
} from './accounts';
import type { BusinessEvent } from './types';

/** Natural balance per account (positive = on its normal side). */
export type Balances = Record<string, number>;

/** Fold a list of events into running balances, using their 仕訳 as the source of truth. */
export function applyEvents(events: BusinessEvent[]): Balances {
  const b: Balances = {};
  for (const ev of events) {
    for (const line of ev.journal) {
      const def = ACCOUNTS[line.accountId];
      if (!def) continue;
      const sign = line.side === accountNormalSide(def) ? 1 : -1;
      b[line.accountId] = (b[line.accountId] ?? 0) + sign * line.amount;
    }
  }
  return b;
}

export function balanceOf(b: Balances, id: string): number {
  return b[id] ?? 0;
}

export interface Row {
  id: string;
  name: string;
  /** signed for display (contra assets show negative) */
  amount: number;
}

function assetRows(b: Balances): Row[] {
  return Object.values(ACCOUNTS)
    .filter((a) => a.type === 'asset')
    .map((a) => {
      const raw = b[a.id] ?? 0;
      return { id: a.id, name: a.name, amount: a.contra ? -raw : raw };
    })
    .filter((r) => r.amount !== 0);
}

function plainRows(b: Balances, type: AccountType): Row[] {
  return Object.values(ACCOUNTS)
    .filter((a) => a.type === type)
    .map((a) => ({ id: a.id, name: a.name, amount: b[a.id] ?? 0 }))
    .filter((r) => r.amount !== 0);
}

export interface IncomeStatement {
  revenues: Row[];
  expenses: Row[];
  totalRevenue: number;
  totalExpense: number;
  profit: number;
}

export function buildIncomeStatement(b: Balances): IncomeStatement {
  const revenues = plainRows(b, 'revenue');
  const expenses = plainRows(b, 'expense');
  const totalRevenue = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpense = expenses.reduce((s, r) => s + r.amount, 0);
  return {
    revenues,
    expenses,
    totalRevenue,
    totalExpense,
    profit: totalRevenue - totalExpense,
  };
}

export interface BalanceSheet {
  assets: Row[];
  liabilities: Row[];
  equity: Row[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  profit: number;
  balanced: boolean;
}

export function buildBalanceSheet(b: Balances): BalanceSheet {
  const assets = assetRows(b);
  const liabilities = plainRows(b, 'liability');
  const equityAccounts = plainRows(b, 'equity');
  const { profit } = buildIncomeStatement(b);

  // Show the current-period profit as a synthetic 純資産 line only while the
  // books are still open (i.e. while revenue/expense accounts still hold it).
  const equity: Row[] = [...equityAccounts];
  if (profit !== 0) equity.push({ id: 'profit', name: '利益', amount: profit });

  const totalAssets = assets.reduce((s, r) => s + r.amount, 0);
  const totalLiabilities = liabilities.reduce((s, r) => s + r.amount, 0);
  const totalEquity = equity.reduce((s, r) => s + r.amount, 0);

  return {
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity,
    profit,
    balanced: totalAssets === totalLiabilities + totalEquity,
  };
}

export interface TrialBalanceRow {
  id: string;
  name: string;
  debit: number;
  credit: number;
}

export interface TrialBalance {
  rows: TrialBalanceRow[];
  totalDebit: number;
  totalCredit: number;
  balanced: boolean;
}

/** 残高試算表: every non-zero account, its balance on the debit or credit side. */
export function buildTrialBalance(b: Balances): TrialBalance {
  const rows: TrialBalanceRow[] = [];
  for (const a of Object.values(ACCOUNTS)) {
    const bal = b[a.id] ?? 0;
    if (bal === 0) continue;
    const side = accountNormalSide(a); // where a positive balance sits
    let debit = 0;
    let credit = 0;
    if (bal > 0) {
      if (side === 'debit') debit = bal;
      else credit = bal;
    } else {
      if (side === 'debit') credit = -bal;
      else debit = -bal;
    }
    rows.push({ id: a.id, name: a.name, debit, credit });
  }
  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);
  return { rows, totalDebit, totalCredit, balanced: totalDebit === totalCredit };
}

export function formatYen(n: number): string {
  const sign = n < 0 ? '−' : '';
  return `${sign}¥${Math.abs(Math.round(n)).toLocaleString('ja-JP')}`;
}

/** '＋¥50,000' / '−¥50,000' for the 会社の変化 view. */
export function signedYen(n: number): string {
  return `${n >= 0 ? '＋' : '−'}¥${Math.abs(Math.round(n)).toLocaleString('ja-JP')}`;
}
