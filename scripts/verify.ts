/* Throwaway: check every DAY's 仕訳 balances and the cumulative BS stays balanced. */
import { DAYS, eventsThrough } from '../src/data/days';
import { ACCOUNTS, accountNormalSide } from '../src/engine/accounts';
import {
  applyEvents,
  buildBalanceSheet,
  buildIncomeStatement,
} from '../src/engine/ledger';

let bad = 0;

for (const d of DAYS) {
  // 1. every journal entry: debit total === credit total
  for (const ev of d.events) {
    const dr = ev.journal
      .filter((l) => l.side === 'debit')
      .reduce((s, l) => s + l.amount, 0);
    const cr = ev.journal
      .filter((l) => l.side === 'credit')
      .reduce((s, l) => s + l.amount, 0);
    if (dr !== cr) {
      bad++;
      console.log(`  ✗ ${ev.id} unbalanced entry: dr ${dr} / cr ${cr}`);
    }
    // referenced accounts exist
    for (const l of ev.journal) {
      if (!ACCOUNTS[l.accountId]) {
        bad++;
        console.log(`  ✗ ${ev.id} unknown account: ${l.accountId}`);
      }
    }
    // changes vs journal consistency (sign check on natural side)
  }

  // 2. cumulative BS through this day
  const b = applyEvents(eventsThrough(d.day));
  const bs = buildBalanceSheet(b);
  const is = buildIncomeStatement(applyEvents(d.events));
  const negCash = ['cash', 'ordinaryDeposit', 'checkingDeposit', 'pettyCash']
    .filter((id) => (b[id] ?? 0) < 0)
    .map((id) => `${ACCOUNTS[id].name} ${b[id]}`);
  console.log(
    `DAY ${d.day}  day-profit ${is.profit.toLocaleString()}  ` +
      `assets ${bs.totalAssets.toLocaleString()}  L+E ${(
        bs.totalLiabilities + bs.totalEquity
      ).toLocaleString()}  ${bs.balanced ? 'OK' : '✗ NOT BALANCED'}` +
      (negCash.length ? `  ⚠ negative: ${negCash.join(', ')}` : ''),
  );
  if (!bs.balanced) bad++;
}

// final account dump
const finalB = applyEvents(eventsThrough(DAYS[DAYS.length - 1].day));
console.log('\nFinal non-zero balances:');
for (const a of Object.values(ACCOUNTS)) {
  const v = finalB[a.id] ?? 0;
  if (v !== 0)
    console.log(
      `  ${a.name.padEnd(12)} ${v.toLocaleString().padStart(12)} (${a.type}${
        a.contra ? ' contra' : ''
      }, normal ${accountNormalSide(a)})`,
    );
}

console.log(bad === 0 ? '\n✅ all checks passed' : `\n❌ ${bad} problem(s)`);
process.exit(bad === 0 ? 0 : 1);
