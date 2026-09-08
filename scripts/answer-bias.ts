import { getDay, ALL_EVENTS } from '../src/data/days';
import { shuffleOptions } from '../src/engine/shuffle';

const after: Record<number, number> = {};
let total = 0;
for (const e of ALL_EVENTS as any[]) {
  const idx = shuffleOptions(e.id, e.quiz.options).findIndex(
    (o: any) => o.id === e.quiz.correctId,
  );
  after[idx] ??= 0;
  after[idx]++;
  total++;
}
console.log('AFTER shuffle — correct-answer position across', total, 'events:');
for (const k of Object.keys(after).sort())
  console.log(`  index ${k}: ${after[+k]} (${((after[+k] / total) * 100).toFixed(1)}%)`);

console.log('\nDAY 1, first 8 events:');
for (const e of getDay(1)!.events.slice(0, 8)) {
  const sh = shuffleOptions(e.id, e.quiz.options);
  const idx = sh.findIndex((o: any) => o.id === e.quiz.correctId);
  console.log(`  ${e.id}  correct@${idx}  [${sh.map((o: any) => o.label).join(' | ')}]`);
}
