import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 13 — 精算表と財務諸表。
 * 最後の営業をこなしつつ、「試算表 → 決算整理 → 損益計算書・貸借対照表」の流れを確認する。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd13e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: 'この日の現金売上は 240,000円でした。',
    quiz: {
      question: '「売上」は、精算表のどの欄に金額が移っていく？',
      options: [
        { id: 'a', label: '損益計算書（P/L）の貸方' },
        { id: 'b', label: '貸借対照表（B/S）の借方' },
        { id: 'c', label: '貸借対照表（B/S）の貸方' },
        { id: 'd', label: 'どこにも移らない' },
      ],
      correctId: 'a',
      correctFeedback:
        '収益（売上・受取利息など）は損益計算書へ。精算表では、試算表の金額を P/L 欄の貸方に写します。',
      wrongFeedback:
        '収益は損益計算書（P/L）の項目。資産・負債・純資産が貸借対照表（B/S）です。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 240_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 240_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 240_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 240_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋24万', bs: 'BS：現金 ＋24万' },
  },

  {
    id: 'd13e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: 'オフィスへ商品 180,000円分を掛けで販売しました。',
    quiz: {
      question: '「売掛金」は、精算表のどの欄に移っていく？',
      options: [
        { id: 'a', label: '貸借対照表（B/S）の借方' },
        { id: 'b', label: '損益計算書（P/L）の借方' },
        { id: 'c', label: '損益計算書（P/L）の貸方' },
        { id: 'd', label: 'どこにも移らない' },
      ],
      correctId: 'a',
      correctFeedback:
        '資産（売掛金・現金・備品など）は貸借対照表へ。精算表では B/S 欄の借方に写します。',
      wrongFeedback:
        '資産は貸借対照表（B/S）の項目。P/L は収益と費用です。',
    },
    plainSummary: '商品を先に渡し、代金は後でもらうことにした',
    changes: [
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 180_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 180_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 180_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 180_000 },
    ],
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋18万', bs: 'BS：売掛金 ＋18万' },
  },

  {
    id: 'd13e03',
    no: 3,
    label: 'EVENT 03',
    scene: '売掛金の回収',
    narrative: '売掛金 300,000円が普通預金に振り込まれました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、売掛金が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '現金が増えた' },
        { id: 'd', label: '前受金が減った' },
      ],
      correctId: 'a',
      correctFeedback: '「受け取る権利」が「お金」に変わっただけです。',
      wrongFeedback: '回収では売上は増えません。資産どうしの振替です。',
    },
    plainSummary: '売掛金が、普通預金として入金された',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 300_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -300_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 300_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 300_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋30万、売掛金 −30万' },
  },

  {
    id: 'd13e04',
    no: 4,
    label: 'EVENT 04',
    scene: '買掛金の支払い',
    narrative: '買掛金 250,000円を普通預金から支払いました。',
    quiz: {
      question: '「買掛金」は、精算表のどの欄に移っていく？',
      options: [
        { id: 'a', label: '貸借対照表（B/S）の貸方' },
        { id: 'b', label: '損益計算書（P/L）の借方' },
        { id: 'c', label: '貸借対照表（B/S）の借方' },
        { id: 'd', label: '損益計算書（P/L）の貸方' },
      ],
      correctId: 'a',
      correctFeedback:
        '負債（買掛金・借入金など）は貸借対照表へ。精算表では B/S 欄の貸方に写します。',
      wrongFeedback: '負債・純資産は貸借対照表（B/S）の貸方です。',
    },
    plainSummary: '後払いの仕入代金を、口座から払った',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -250_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -250_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 250_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 250_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：買掛金 −25万、普通預金 −25万' },
  },

  {
    id: 'd13e05',
    no: 5,
    label: 'EVENT 05',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆・食材を 120,000円分、掛けで仕入れました。',
    quiz: {
      question: '「仕入」は、精算表のどの欄に移っていく？',
      options: [
        { id: 'a', label: '損益計算書（P/L）の借方' },
        { id: 'b', label: '貸借対照表（B/S）の借方' },
        { id: 'c', label: '損益計算書（P/L）の貸方' },
        { id: 'd', label: 'どこにも移らない' },
      ],
      correctId: 'a',
      correctFeedback:
        '費用（仕入・給料・水道光熱費など）は損益計算書へ。精算表では P/L 欄の借方に写します。',
      wrongFeedback: '費用は損益計算書（P/L）の借方です。',
    },
    plainSummary: '商品を掛けで仕入れた',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 120_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 120_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 120_000 },
    ],
    why: ['仕入が増えた → 費用の増加は借方', '買掛金が増えた → 負債の増加は貸方'],
    statementImpact: { pl: 'PL：仕入 ＋12万', bs: 'BS：買掛金 ＋12万' },
  },

  {
    id: 'd13e06',
    no: 6,
    label: 'EVENT 06',
    scene: '水道光熱費',
    narrative: '電気・ガス・水道代 18,000円を現金で支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '水道光熱費（費用）が増え、現金が減った' },
        { id: 'b', label: '通信費が増えた' },
        { id: 'c', label: '貯蔵品が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback: '光熱費は「水道光熱費」（費用）。現金が減ります。',
      wrongFeedback: '電気・ガス・水道代は「水道光熱費」という費用です。',
    },
    plainSummary: '光熱費を現金で払った',
    changes: [
      { accountId: 'utilities', label: '水道光熱費', category: '費用', delta: 18_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -18_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'utilities', label: '水道光熱費', amount: 18_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 18_000 },
    ],
    why: ['水道光熱費が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：水道光熱費 ＋1.8万', bs: 'BS：現金 −1.8万' },
  },

  {
    id: 'd13e07',
    no: 7,
    label: 'EVENT 07',
    scene: '給料の支払い',
    narrative: '従業員へ給料 200,000円を現金で支払いました（天引きなし）。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '給料（費用）が増え、現金が減った' },
        { id: 'b', label: '預り金が増えた' },
        { id: 'c', label: '法定福利費が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback: '天引きがなければ、給料（費用）と現金（資産）が同額動きます。',
      wrongFeedback: '天引きなしなので、給料（費用）と現金（資産）が同額です。',
    },
    plainSummary: '給料を現金で払った',
    changes: [
      { accountId: 'salary', label: '給料', category: '費用', delta: 200_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -200_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'salary', label: '給料', amount: 200_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 200_000 },
    ],
    why: ['給料が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：給料 ＋20万', bs: 'BS：現金 −20万' },
  },

  {
    id: 'd13e08',
    no: 8,
    label: 'EVENT 08',
    scene: '借入金の返済＋利息',
    narrative:
      '借入金 200,000円を、利息 6,000円とあわせて普通預金から返済しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '借入金が減り、支払利息（費用）が発生し、普通預金が減った' },
        { id: 'b', label: '借入金だけが減った' },
        { id: 'c', label: '受取利息が増えた' },
        { id: 'd', label: '仕入が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '元本 200,000円は借入金（負債）の減少、利息 6,000円は支払利息（費用）。合計 206,000円が出ます。',
      wrongFeedback:
        '返済額のうち元本は負債の減少、利息は費用（支払利息）です。',
    },
    plainSummary: '借金を、利息をつけて返した',
    changes: [
      { accountId: 'loan', label: '借入金', category: '負債', delta: -200_000 },
      { accountId: 'interestExpense', label: '支払利息', category: '費用', delta: 6_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -206_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'loan', label: '借入金', amount: 200_000 },
      { side: 'debit', accountId: 'interestExpense', label: '支払利息', amount: 6_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 206_000 },
    ],
    why: [
      '借入金が減った → 負債の減少は借方',
      '支払利息が増えた → 費用の増加は借方',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：支払利息 ＋6千', bs: 'BS：借入金 −20万、普通預金 −20.6万' },
  },

  {
    id: 'd13e09',
    no: 9,
    label: 'EVENT 09',
    scene: '現金売上',
    narrative: 'この日の追加の現金売上は 160,000円でした。',
    quiz: {
      question:
        '精算表の「当期純利益」は、どことどこに同じ金額が出る？',
      options: [
        {
          id: 'a',
          label: 'P/L では借方（費用側）に、B/S では貸方（純資産側）に出て、金額は一致する',
        },
        { id: 'b', label: 'P/L の貸方と B/S の借方' },
        { id: 'c', label: 'P/L にだけ出る' },
        { id: 'd', label: 'B/S にだけ出る' },
      ],
      correctId: 'a',
      correctFeedback:
        '当期純利益は、P/L では「収益 − 費用」の差額として借方（費用の下）に、B/S では純資産の増加として貸方に出ます。同じ金額が両方に出て、精算表の左右が締まります。',
      wrongFeedback:
        '当期純利益は P/L の借方（費用側の差額）と、B/S の貸方（純資産側）に、同じ金額で出ます。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 160_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 160_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 160_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 160_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      '当期純利益は P/L と B/S の両方に、同じ金額で現れる',
    ],
    statementImpact: { pl: 'PL：売上 ＋16万', bs: 'BS：現金 ＋16万' },
  },

  {
    id: 'd13e10',
    no: 10,
    label: 'EVENT 10',
    scene: '掛け売上',
    narrative: 'もう1件、オフィスへ商品 90,000円分を掛けで販売しました。',
    quiz: {
      question: '損益計算書（P/L）で計算するのは？',
      options: [
        { id: 'a', label: '収益 − 費用 ＝ 当期純利益（もうけ）' },
        { id: 'b', label: '資産 − 負債 ＝ 純資産' },
        { id: 'c', label: '借方合計 ＝ 貸方合計 の確認だけ' },
        { id: 'd', label: '現金の増減' },
      ],
      correctId: 'a',
      correctFeedback:
        'P/L は「1年間でいくらもうけたか」を、収益と費用の差で示します。B/S は「決算日の財産の状態」を、資産・負債・純資産で示します。',
      wrongFeedback:
        'P/L ＝ 収益 − 費用 ＝ 当期純利益。B/S ＝ 資産 ＝ 負債 ＋ 純資産、です。',
    },
    plainSummary: '商品を先に渡し、代金は後でもらうことにした',
    changes: [
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 90_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 90_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 90_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 90_000 },
    ],
    why: [
      '売掛金が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      'P/L＝収益−費用、B/S＝資産＝負債＋純資産',
    ],
    statementImpact: { pl: 'PL：売上 ＋9万', bs: 'BS：売掛金 ＋9万' },
  },

  {
    id: 'd13e11',
    no: 11,
    label: 'EVENT 11',
    scene: '現金売上',
    narrative: '本日ラストの現金売上は 120,000円でした。いよいよ次は帳簿の締めです。',
    quiz: {
      question: '決算整理まで終えた「残高」から、次に作るものは？',
      options: [
        { id: 'a', label: '損益計算書（P/L）と貸借対照表（B/S）' },
        { id: 'b', label: 'もう一度、期首の仕訳' },
        { id: 'c', label: '現金出納帳だけ' },
        { id: 'd', label: '何も作らない' },
      ],
      correctId: 'a',
      correctFeedback:
        '決算整理後の残高（＝精算表の修正後試算表）から、収益・費用を集めて P/L、資産・負債・純資産を集めて B/S を作ります。このあと帳簿を締め切ります（DAY 14）。',
      wrongFeedback:
        '決算整理のあとは、P/L と B/S を作り、帳簿を締め切ります。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 120_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 120_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 120_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      '決算整理後残高 → P/L・B/S → 帳簿の締め切り',
    ],
    statementImpact: { pl: 'PL：売上 ＋12万', bs: 'BS：現金 ＋12万' },
  },
];

export const DAY13: DayDef = {
  day: 13,
  title: '精算表と財務諸表',
  subtitle: '試算表 → 決算整理 → 損益計算書・貸借対照表 の流れを確認します。',
  focus: ['精算表の流れ', '収益・費用は P/L／資産・負債・純資産は B/S', '当期純利益は両方に出る'],
  events: EVENTS,
  recap: [
    '精算表：試算表 →（決算整理の）修正記入 → 損益計算書 → 貸借対照表 と、金額を横に流していく表',
    '収益・費用は損益計算書へ、資産・負債・純資産は貸借対照表へ',
    '当期純利益は P/L（収益−費用）と B/S（純資産の増加）の両方に、同じ金額で現れる',
  ],
};
