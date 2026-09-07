import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 14 — 帳簿を締める。
 * 決算振替仕訳（収益・費用 → 損益 → 繰越利益剰余金）/ 剰余金の配当・処分 /
 * 税金の納付 / 繰越試算表。
 *
 * 金額は DAY 13 までの累計残高に一致させてある（損益勘定がぴったり 0 になる）。
 */
const REVENUE_TOTAL = 5_574_000;
const EXPENSE_TOTAL = 3_093_200;
const NET_INCOME = REVENUE_TOTAL - EXPENSE_TOTAL; // 2,480,800

const EVENTS: BusinessEvent[] = [
  {
    id: 'd14e01',
    no: 1,
    label: 'EVENT 01',
    scene: '【締め①】収益を損益へ',
    narrative:
      '決算振替仕訳の1つめ。すべての収益の勘定（売上・受取利息・受取手数料・固定資産売却益・償却債権取立益）を、「損益」勘定に集めます。',
    quiz: {
      question: '収益の各勘定を「損益」勘定に振り替えると、収益の残高はどうなる？',
      options: [
        { id: 'a', label: '収益の各勘定はゼロになり、損益勘定に貸方でまとまる' },
        { id: 'b', label: '収益はそのまま来期に繰り越される' },
        { id: 'c', label: '収益が費用に変わる' },
        { id: 'd', label: '損益勘定の借方にまとまる' },
      ],
      correctId: 'a',
      correctFeedback:
        '収益・費用は「その期だけ」の勘定なので、期末にいったんゼロにします。収益は借方に振り替えて消し、相手科目「損益」の貸方に合計 5,574,000円が集まります。',
      wrongFeedback:
        '収益・費用の勘定は来期に繰り越しません。損益勘定に集めてゼロにします。',
    },
    plainSummary: 'すべての収益を、損益勘定に集めた',
    changes: [
      { accountId: 'sales', label: '各収益（5勘定）', category: '収益', delta: -REVENUE_TOTAL },
      { accountId: 'incomeSummary', label: '損益', category: '純資産', delta: REVENUE_TOTAL },
    ],
    journal: [
      { side: 'debit', accountId: 'sales', label: '売上', amount: 5_525_000 },
      { side: 'debit', accountId: 'interestIncome', label: '受取利息', amount: 10_000 },
      { side: 'debit', accountId: 'feeIncome', label: '受取手数料', amount: 16_000 },
      { side: 'debit', accountId: 'gainOnSaleFA', label: '固定資産売却益', amount: 15_000 },
      { side: 'debit', accountId: 'recoveredBadDebt', label: '償却債権取立益', amount: 8_000 },
      { side: 'credit', accountId: 'incomeSummary', label: '損益', amount: REVENUE_TOTAL },
    ],
    why: [
      '収益の各勘定を借方に入れてゼロにする（収益の減少は借方）',
      '相手科目「損益」の貸方に合計が集まる',
      '損益は決算だけに使う集計用の勘定',
    ],
    statementImpact: { pl: 'PL：収益をすべて損益へ集約（合計 5,574,000）' },
  },

  {
    id: 'd14e02',
    no: 2,
    label: 'EVENT 02',
    scene: '【締め②】費用を損益へ',
    narrative:
      '決算振替仕訳の2つめ。すべての費用の勘定（仕入・給料・減価償却費…全24勘定）を、「損益」勘定に集めます。',
    quiz: {
      question: '費用の各勘定を「損益」勘定に振り替えると？',
      options: [
        { id: 'a', label: '費用の各勘定はゼロになり、損益勘定の借方にまとまる' },
        { id: 'b', label: '費用はそのまま来期に繰り越される' },
        { id: 'c', label: '損益勘定の貸方にまとまる' },
        { id: 'd', label: '費用が資産に変わる' },
      ],
      correctId: 'a',
      correctFeedback:
        '費用は貸方に振り替えて消し、相手科目「損益」の借方に合計 3,093,200円が集まります。これで損益勘定は「貸方 5,574,000 − 借方 3,093,200 ＝ 貸方残 2,480,800」＝当期純利益になります。',
      wrongFeedback:
        '費用の勘定も来期に繰り越しません。損益勘定に集めてゼロにします。',
    },
    plainSummary: 'すべての費用を、損益勘定に集めた',
    changes: [
      { accountId: 'incomeSummary', label: '損益', category: '純資産', delta: -EXPENSE_TOTAL },
      { accountId: 'purchases', label: '各費用（24勘定）', category: '費用', delta: -EXPENSE_TOTAL },
    ],
    journal: [
      { side: 'debit', accountId: 'incomeSummary', label: '損益', amount: EXPENSE_TOTAL },
      { side: 'credit', accountId: 'purchases', label: '仕入', amount: 1_348_000 },
      { side: 'credit', accountId: 'rent', label: '支払家賃', amount: 105_000 },
      { side: 'credit', accountId: 'salary', label: '給料', amount: 950_000 },
      { side: 'credit', accountId: 'legalWelfare', label: '法定福利費', amount: 24_000 },
      { side: 'credit', accountId: 'utilities', label: '水道光熱費', amount: 70_000 },
      { side: 'credit', accountId: 'suppliesExpense', label: '消耗品費', amount: 12_000 },
      { side: 'credit', accountId: 'communication', label: '通信費', amount: 12_000 },
      { side: 'credit', accountId: 'travel', label: '旅費交通費', amount: 36_000 },
      { side: 'credit', accountId: 'advertising', label: '広告宣伝費', amount: 25_000 },
      { side: 'credit', accountId: 'freightExpense', label: '発送費', amount: 2_000 },
      { side: 'credit', accountId: 'feeExpense', label: '支払手数料', amount: 3_200 },
      { side: 'credit', accountId: 'repairExpense', label: '修繕費', amount: 26_000 },
      { side: 'credit', accountId: 'insuranceExpense', label: '保険料', amount: 27_000 },
      { side: 'credit', accountId: 'welfareExpense', label: '福利厚生費', amount: 20_000 },
      { side: 'credit', accountId: 'duesExpense', label: '諸会費', amount: 12_000 },
      { side: 'credit', accountId: 'taxesDues', label: '租税公課', amount: 49_000 },
      { side: 'credit', accountId: 'depExpense', label: '減価償却費', amount: 180_000 },
      { side: 'credit', accountId: 'badDebtProvision', label: '貸倒引当金繰入', amount: 10_000 },
      { side: 'credit', accountId: 'badDebtLoss', label: '貸倒損失', amount: 40_000 },
      { side: 'credit', accountId: 'lossOnSaleFA', label: '固定資産売却損', amount: 15_000 },
      { side: 'credit', accountId: 'interestExpense', label: '支払利息', amount: 22_000 },
      { side: 'credit', accountId: 'incomeTaxExpense', label: '法人税等', amount: 100_000 },
      { side: 'credit', accountId: 'miscExpense', label: '雑費', amount: 2_000 },
      { side: 'credit', accountId: 'miscLoss', label: '雑損', amount: 3_000 },
    ],
    why: [
      '費用の各勘定を貸方に入れてゼロにする（費用の減少は貸方）',
      '相手科目「損益」の借方に合計が集まる',
      'これで損益勘定の残高＝当期純利益（貸方残 2,480,800）',
    ],
    statementImpact: { pl: 'PL：費用をすべて損益へ集約（合計 3,093,200）' },
  },

  {
    id: 'd14e03',
    no: 3,
    label: 'EVENT 03',
    scene: '【締め③】当期純利益を繰越利益剰余金へ',
    narrative:
      '決算振替仕訳の3つめ。損益勘定の残高（当期純利益 2,480,800円）を、「繰越利益剰余金」に振り替えます。',
    quiz: {
      question: '損益勘定に残った当期純利益は、どこへ振り替える？',
      options: [
        { id: 'a', label: '繰越利益剰余金（純資産）' },
        { id: 'b', label: '資本金（純資産）' },
        { id: 'c', label: '現金（資産）' },
        { id: 'd', label: '利益準備金（純資産）' },
      ],
      correctId: 'a',
      correctFeedback:
        '当期のもうけは「繰越利益剰余金」（純資産）に積み上げます。損益勘定はこれでゼロになり、帳簿から消えます。翌期はまた新しい損益勘定を使います。',
      wrongFeedback:
        '当期純利益は資本金ではなく「繰越利益剰余金」（過去からのもうけの積み立て）に振り替えます。',
    },
    plainSummary: '当期のもうけを、繰越利益剰余金に積み上げた',
    changes: [
      { accountId: 'incomeSummary', label: '損益', category: '純資産', delta: -NET_INCOME },
      { accountId: 'retainedEarnings', label: '繰越利益剰余金', category: '純資産', delta: NET_INCOME },
    ],
    journal: [
      { side: 'debit', accountId: 'incomeSummary', label: '損益', amount: NET_INCOME },
      { side: 'credit', accountId: 'retainedEarnings', label: '繰越利益剰余金', amount: NET_INCOME },
    ],
    why: [
      '損益（貸方残）を借方に入れてゼロにする',
      '繰越利益剰余金が増えた → 純資産の増加は貸方',
      '「利益は現金ではなく、純資産の増加として残る」',
    ],
    statementImpact: {
      pl: 'PL：当期純利益 2,480,800',
      bs: 'BS：繰越利益剰余金 ＋2,480,800',
    },
  },

  {
    id: 'd14e04',
    no: 4,
    label: 'EVENT 04',
    scene: '剰余金の配当（株主総会）',
    narrative:
      '株主総会で、繰越利益剰余金から株主への配当 200,000円と、利益準備金の積立 20,000円が決まりました（まだ支払っていません）。',
    quiz: {
      question: '配当が決まったとき（支払いはまだ）、どう処理する？',
      options: [
        {
          id: 'a',
          label: '繰越利益剰余金を減らし、「未払配当金」（負債）と「利益準備金」（純資産）を計上する',
        },
        { id: 'b', label: 'すぐに現金で払う' },
        { id: 'c', label: '資本金を減らす' },
        { id: 'd', label: '費用（配当金）を計上する' },
      ],
      correctId: 'a',
      correctFeedback:
        '配当は費用ではなく「もうけの分配」。繰越利益剰余金を 220,000円減らし、株主に払う義務を「未払配当金」（負債）、会社に残す積立を「利益準備金」（純資産）にします。',
      wrongFeedback:
        '配当は費用ではありません。繰越利益剰余金を取り崩して、未払配当金（負債）と利益準備金（純資産）へ振り分けます。',
    },
    plainSummary: 'もうけの一部を、株主への配当と社内の積立に振り分けた',
    changes: [
      { accountId: 'retainedEarnings', label: '繰越利益剰余金', category: '純資産', delta: -220_000 },
      { accountId: 'dividendsPayable', label: '未払配当金', category: '負債', delta: 200_000 },
      { accountId: 'legalReserve', label: '利益準備金', category: '純資産', delta: 20_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'retainedEarnings', label: '繰越利益剰余金', amount: 220_000 },
      { side: 'credit', accountId: 'dividendsPayable', label: '未払配当金', amount: 200_000 },
      { side: 'credit', accountId: 'legalReserve', label: '利益準備金', amount: 20_000 },
    ],
    why: [
      '繰越利益剰余金が減った → 純資産の減少は借方',
      '未払配当金が増えた → 負債の増加は貸方（株主に払う義務）',
      '利益準備金が増えた → 純資産の増加は貸方（法律で積立が必要）',
    ],
    statementImpact: {
      bs: 'BS：繰越利益剰余金 −22万、未払配当金 ＋20万、利益準備金 ＋2万',
    },
  },

  {
    id: 'd14e05',
    no: 5,
    label: 'EVENT 05',
    scene: '配当金の支払い',
    narrative: '株主への配当金 200,000円を普通預金から支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '未払配当金（払う義務）が減り、普通預金が減った' },
        { id: 'b', label: '繰越利益剰余金がまた減った' },
        { id: 'c', label: '費用（配当金）が増えた' },
        { id: 'd', label: '資本金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '配当の金額は総会で決まったときに処理済み。支払いでは「未払配当金」（負債）と普通預金（資産）が減ります。',
      wrongFeedback:
        '繰越利益剰余金は総会のときに減らし済み。支払時は未払配当金（負債）を減らします。',
    },
    plainSummary: '決まっていた配当金を、株主に支払った',
    changes: [
      { accountId: 'dividendsPayable', label: '未払配当金', category: '負債', delta: -200_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -200_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'dividendsPayable', label: '未払配当金', amount: 200_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 200_000 },
    ],
    why: [
      '未払配当金が減った → 負債の減少は借方',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：未払配当金 −20万、普通預金 −20万' },
  },

  {
    id: 'd14e06',
    no: 6,
    label: 'EVENT 06',
    scene: '未払法人税等の納付／帳簿の締め切り',
    narrative:
      '決算で確定していた未払法人税等 40,000円を現金で納付しました。これで当期のすべての手続きが終わり、資産・負債・純資産の各勘定を「次期繰越」として締め切ります。',
    quiz: {
      question: '帳簿を締め切ったあと、来期に繰り越されるのは？',
      options: [
        { id: 'a', label: '資産・負債・純資産の各勘定（繰越試算表に載る）' },
        { id: 'b', label: '収益・費用の各勘定' },
        { id: 'c', label: '損益勘定' },
        { id: 'd', label: '何も繰り越されない' },
      ],
      correctId: 'a',
      correctFeedback:
        '収益・費用・損益は締めでゼロになり繰り越しません。来期に引き継ぐのは資産・負債・純資産の残高で、これを並べたものが「繰越試算表」です。ここで DAY 1 の「現金 100万円 / 資本金 100万円」から始まった帳簿が、1年ぶん締まりました。',
      wrongFeedback:
        '繰り越すのは資産・負債・純資産だけ。収益・費用・損益は締めでゼロになります。',
    },
    plainSummary: '税金を納め、資産・負債・純資産を来期へ繰り越して帳簿を締めた',
    changes: [
      { accountId: 'incomeTaxPayable', label: '未払法人税等', category: '負債', delta: -40_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -40_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'incomeTaxPayable', label: '未払法人税等', amount: 40_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 40_000 },
    ],
    why: [
      '未払法人税等が減った → 負債の減少は借方',
      '現金が減った → 資産の減少は貸方',
      '資産・負債・純資産の残高だけが「繰越試算表」で来期へ引き継がれる',
    ],
    statementImpact: { bs: 'BS：未払法人税等 −4万、現金 −4万。以降、帳簿は締め切り' },
  },
];

export const DAY14: DayDef = {
  day: 14,
  title: '帳簿を締める',
  subtitle: '決算振替仕訳・剰余金の配当・税金の納付・繰越試算表。1年ぶんの帳簿を締め切ります。',
  focus: ['決算振替仕訳（損益勘定）', '当期純利益→繰越利益剰余金', '剰余金の配当', '繰越試算表'],
  events: EVENTS,
  closing: true,
  recap: [
    '決算振替：収益・費用をすべて「損益」勘定に集め、その残高（当期純利益）を「繰越利益剰余金」へ',
    '配当は費用ではなく、もうけの分配。繰越利益剰余金を減らし、未払配当金（負債）と利益準備金（純資産）へ',
    '締め切りで繰り越すのは資産・負債・純資産だけ（＝繰越試算表）。収益・費用・損益はゼロになる',
    'DAY 1 の「現金 100万 / 資本金 100万」から、1年でここまで会社が動いた ― これが簿記です',
  ],
};
