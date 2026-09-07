import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, space } from '@/theme';
import {
  Balances,
  buildBalanceSheet,
  buildIncomeStatement,
  buildTrialBalance,
  formatYen,
  Row,
} from '@/engine/ledger';
import { Card } from './ui';

/** contra rows come through negative — show them as △ */
function fmtAsset(n: number): string {
  return n < 0 ? `△${formatYen(-n)}` : formatYen(n);
}

function LineRow({
  name,
  amount,
  strong,
}: {
  name: string;
  amount: number;
  strong?: boolean;
}) {
  return (
    <View style={styles.line}>
      <Text style={[styles.name, strong && styles.strong]}>{name}</Text>
      <Text style={[styles.amount, strong && styles.strong]}>
        {formatYen(amount)}
      </Text>
    </View>
  );
}

function Group({
  title,
  rows,
  asset,
}: {
  title: string;
  rows: Row[];
  asset?: boolean;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {rows.length ? (
        rows.map((r) => (
          <View style={styles.line} key={r.id}>
            <Text style={styles.name}>{r.name}</Text>
            <Text style={styles.amount}>
              {asset ? fmtAsset(r.amount) : formatYen(r.amount)}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyNote}>（まだありません）</Text>
      )}
    </View>
  );
}

/* --------------------------------------------------------- 損益計算書 (PL) */

export function IncomeStatementView({ b }: { b: Balances }) {
  const pl = buildIncomeStatement(b);
  return (
    <Card>
      <Text style={styles.title}>損益計算書（PL）</Text>
      <Text style={styles.caption}>もうけ ＝ 売上 −（仕入 ＋ 経費）</Text>
      <Group title="収益" rows={pl.revenues} />
      <View style={styles.rule} />
      <Group title="費用" rows={pl.expenses} />
      <View style={styles.ruleStrong} />
      <LineRow name="利益" amount={pl.profit} strong />
    </Card>
  );
}

/* --------------------------------------------------------- 貸借対照表 (BS) */

export function BalanceSheetView({ b }: { b: Balances }) {
  const bs = buildBalanceSheet(b);
  return (
    <Card>
      <Text style={styles.title}>貸借対照表（BS）</Text>
      <Text style={styles.caption}>資産 ＝ 負債 ＋ 純資産</Text>
      <Group title="資産" rows={bs.assets} asset />
      <LineRow name="資産 合計" amount={bs.totalAssets} strong />
      <View style={styles.rule} />
      <Group title="負債" rows={bs.liabilities} />
      <View style={styles.rule} />
      <Group title="純資産" rows={bs.equity} />
      <LineRow
        name="負債＋純資産 合計"
        amount={bs.totalLiabilities + bs.totalEquity}
        strong
      />
      <View
        style={[
          styles.balanceTag,
          { backgroundColor: bs.balanced ? colors.correctBg : colors.wrongBg },
        ]}
      >
        <Text style={styles.balanceTagText}>
          {bs.balanced
            ? '左右がぴったり一致しています'
            : '左右が一致していません'}
        </Text>
      </View>
    </Card>
  );
}

/* ------------------------------------------------------------- 試算表 (TB) */

export function TrialBalanceView({ b }: { b: Balances }) {
  const tb = buildTrialBalance(b);
  return (
    <Card>
      <Text style={styles.title}>残高試算表</Text>
      <Text style={styles.caption}>
        すべての勘定の残高を左右に。借方合計＝貸方合計になる
      </Text>
      <View style={styles.tbHead}>
        <Text style={[styles.tbHeadCell, { textAlign: 'right' }]}>借方</Text>
        <Text style={styles.tbHeadName}>勘定科目</Text>
        <Text style={[styles.tbHeadCell, { textAlign: 'right' }]}>貸方</Text>
      </View>
      {tb.rows.map((r) => (
        <View style={styles.tbRow} key={r.id}>
          <Text style={styles.tbNum}>{r.debit ? formatYen(r.debit) : ''}</Text>
          <Text style={styles.tbName}>{r.name}</Text>
          <Text style={styles.tbNum}>{r.credit ? formatYen(r.credit) : ''}</Text>
        </View>
      ))}
      <View style={styles.ruleStrong} />
      <View style={styles.tbRow}>
        <Text style={[styles.tbNum, styles.strong]}>
          {formatYen(tb.totalDebit)}
        </Text>
        <Text style={[styles.tbName, styles.strong]}>合計</Text>
        <Text style={[styles.tbNum, styles.strong]}>
          {formatYen(tb.totalCredit)}
        </Text>
      </View>
      <View
        style={[
          styles.balanceTag,
          { backgroundColor: tb.balanced ? colors.correctBg : colors.wrongBg },
        ]}
      >
        <Text style={styles.balanceTagText}>
          {tb.balanced ? '借方合計 ＝ 貸方合計' : '借方と貸方が一致していません'}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  caption: { fontSize: font.small, color: colors.textMuted },
  group: { gap: space(1.5), marginTop: space(1) },
  groupTitle: {
    fontSize: font.small,
    fontWeight: '800',
    color: colors.textMuted,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: font.body, color: colors.text },
  amount: {
    fontSize: font.body,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  strong: { fontWeight: '800' },
  emptyNote: { fontSize: font.small, color: colors.textFaint },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: space(1) },
  ruleStrong: {
    height: 2,
    backgroundColor: colors.borderStrong,
    marginVertical: space(1.5),
  },
  balanceTag: {
    marginTop: space(2),
    paddingVertical: space(2),
    paddingHorizontal: space(3),
    borderRadius: 10,
    alignItems: 'center',
  },
  balanceTagText: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  tbHead: {
    flexDirection: 'row',
    marginTop: space(1),
    paddingBottom: space(1),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tbHeadCell: { flex: 1, fontSize: font.tiny, fontWeight: '800', color: colors.textMuted },
  tbHeadName: {
    flex: 1.4,
    fontSize: font.tiny,
    fontWeight: '800',
    color: colors.textMuted,
    textAlign: 'center',
  },
  tbRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 2 },
  tbNum: {
    flex: 1,
    fontSize: font.small,
    color: colors.text,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  tbName: {
    flex: 1.4,
    fontSize: font.small,
    color: colors.text,
    textAlign: 'center',
  },
});
