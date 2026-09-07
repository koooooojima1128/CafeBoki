import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 11 — 決算整理①。
 * 現金過不足の整理（雑損・雑益）/ 貯蔵品への振替 / 売上原価の算定（しくりくりし）。
 * ※開業初年度なので期首商品棚卸高は 0。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd11e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: 'この日の現金売上は 200,000円でした。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '費用が減った' },
        { id: 'd', label: '前受金が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上です。',
      wrongFeedback: 'その場で現金を受け取ったので、現金と売上が増えます。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 200_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 200_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 200_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 200_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋20万', bs: 'BS：現金 ＋20万' },
  },

  {
    id: 'd11e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: 'オフィスへ商品 130,000円分を掛けで販売しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が増え、売上が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '未収入金が増えた' },
        { id: 'd', label: '前受金が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '商品の掛け売上。売掛金（資産）と売上（収益）が増えます。',
      wrongFeedback: '商品の代金あと払いは売掛金です。',
    },
    plainSummary: '商品を先に渡し、代金は後でもらうことにした',
    changes: [
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 130_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 130_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 130_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 130_000 },
    ],
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋13万', bs: 'BS：売掛金 ＋13万' },
  },

  {
    id: 'd11e03',
    no: 3,
    label: 'EVENT 03',
    scene: '売掛金の回収',
    narrative: '売掛金 250,000円が普通預金に振り込まれました。',
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
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 250_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -250_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 250_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 250_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋25万、売掛金 −25万' },
  },

  {
    id: 'd11e04',
    no: 4,
    label: 'EVENT 04',
    scene: '買掛金の支払い',
    narrative: '買掛金 150,000円を、小切手を振り出して支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金が減り、当座預金が減った' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '未払金が減った' },
      ],
      correctId: 'a',
      correctFeedback: '自己振出の小切手は当座預金の引き落とし。買掛金と当座預金が減ります。',
      wrongFeedback: '自己振出の小切手は当座預金の減少です。',
    },
    plainSummary: '後払いの仕入代金を、小切手で払った',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -150_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -150_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 150_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 150_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '当座預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：買掛金 −15万、当座預金 −15万' },
  },

  {
    id: 'd11e05',
    no: 5,
    label: 'EVENT 05',
    scene: '給料の支払い',
    narrative: '従業員へ給料 220,000円を現金で支払いました（天引きなし）。',
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
      wrongFeedback: '天引きがないので、給料（費用）と現金（資産）が同額です。',
    },
    plainSummary: '給料を現金で払った',
    changes: [
      { accountId: 'salary', label: '給料', category: '費用', delta: 220_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -220_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'salary', label: '給料', amount: 220_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 220_000 },
    ],
    why: ['給料が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：給料 ＋22万', bs: 'BS：現金 −22万' },
  },

  {
    id: 'd11e06',
    no: 6,
    label: 'EVENT 06',
    scene: '水道光熱費',
    narrative: '電気・ガス・水道代 20,000円を現金で支払いました。',
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
      { accountId: 'utilities', label: '水道光熱費', category: '費用', delta: 20_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -20_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'utilities', label: '水道光熱費', amount: 20_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 20_000 },
    ],
    why: ['水道光熱費が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：水道光熱費 ＋2万', bs: 'BS：現金 −2万' },
  },

  {
    id: 'd11e07',
    no: 7,
    label: 'EVENT 07',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆・食材を 100,000円分、掛けで仕入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金が増えた' },
        { id: 'b', label: '繰越商品が増えた' },
        { id: 'c', label: '現金が減った' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '期中の仕入はすべて「仕入」（費用）に記録します。売れ残りの調整は決算でやります。',
      wrongFeedback: '期中は繰越商品を動かしません。仕入（費用）と買掛金（負債）が増えます。',
    },
    plainSummary: '商品を掛けで仕入れた',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 100_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 100_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 100_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 100_000 },
    ],
    why: ['仕入が増えた → 費用の増加は借方', '買掛金が増えた → 負債の増加は貸方'],
    statementImpact: { pl: 'PL：仕入 ＋10万', bs: 'BS：買掛金 ＋10万' },
  },

  {
    id: 'd11e08',
    no: 8,
    label: 'EVENT 08',
    scene: '現金売上',
    narrative: '週末営業で現金売上が 180,000円ありました。ここから決算整理に入ります。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '繰越商品が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '最後の営業ぶんの現金売上です。この次から決算整理に入ります。',
      wrongFeedback: 'その場で現金を受け取ったので、現金と売上が増えます。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 180_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 180_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 180_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 180_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋18万', bs: 'BS：現金 ＋18万' },
  },

  {
    id: 'd11e09',
    no: 9,
    label: 'EVENT 09',
    scene: '【決算整理】現金過不足の整理',
    narrative:
      '決算日をむかえても、現金過不足 3,000円（借方残＝不足）の原因が分かりませんでした。',
    quiz: {
      question: '原因不明のまま決算をむかえた現金過不足（不足）は、どうする？',
      options: [
        { id: 'a', label: '「雑損」（費用）に振り替える' },
        { id: 'b', label: '「雑益」（収益）に振り替える' },
        { id: 'c', label: 'そのまま資産として残す' },
        { id: 'd', label: '現金を減らす' },
      ],
      correctId: 'a',
      correctFeedback:
        '不足（借方残）のまま原因不明なら「雑損」（費用）へ。もし過剰（貸方残）なら「雑益」（収益）へ振り替えます。これで現金過不足はゼロに。',
      wrongFeedback:
        '不足のまま原因不明なら「雑損」（費用）。過剰なら「雑益」（収益）です。',
    },
    plainSummary: '原因不明の現金不足を、雑損として費用にした',
    changes: [
      { accountId: 'miscLoss', label: '雑損', category: '費用', delta: 3_000 },
      { accountId: 'cashOverShort', label: '現金過不足', category: '資産', delta: -3_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'miscLoss', label: '雑損', amount: 3_000 },
      { side: 'credit', accountId: 'cashOverShort', label: '現金過不足', amount: 3_000 },
    ],
    why: [
      '雑損が増えた → 費用の増加は借方',
      '現金過不足（借方残）を貸方に入れてゼロにする',
      '過剰（貸方残）だった場合は「雑益」（収益）へ',
    ],
    statementImpact: { pl: 'PL：雑損 ＋3千', bs: 'BS：現金過不足 0 に' },
  },

  {
    id: 'd11e10',
    no: 10,
    label: 'EVENT 10',
    scene: '【決算整理】貯蔵品への振替',
    narrative:
      '決算日、未使用の郵便切手 3,000円ぶんと、収入印紙 4,000円ぶんが残っていました。',
    quiz: {
      question: '決算日に残った未使用の切手・収入印紙は、どうする？',
      options: [
        {
          id: 'a',
          label: '費用（通信費・租税公課）を減らし、「貯蔵品」（資産）に振り替える',
        },
        { id: 'b', label: 'そのまま費用にしておく' },
        { id: 'c', label: '消耗品費にする' },
        { id: 'd', label: '雑損にする' },
      ],
      correctId: 'a',
      correctFeedback:
        'まだ使っていない切手・印紙は「来期の費用」。当期の費用（通信費・租税公課）から取り消して、「貯蔵品」（資産）として繰り越します。',
      wrongFeedback:
        '未使用ぶんは当期の費用ではありません。「貯蔵品」（資産）に振り替えます。',
    },
    plainSummary: '未使用の切手・印紙を、費用から資産（貯蔵品）に振り替えた',
    changes: [
      { accountId: 'storableSupplies', label: '貯蔵品', category: '資産', delta: 7_000 },
      { accountId: 'communication', label: '通信費', category: '費用', delta: -3_000 },
      { accountId: 'taxesDues', label: '租税公課', category: '費用', delta: -4_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'storableSupplies', label: '貯蔵品', amount: 7_000 },
      { side: 'credit', accountId: 'communication', label: '通信費', amount: 3_000 },
      { side: 'credit', accountId: 'taxesDues', label: '租税公課', amount: 4_000 },
    ],
    why: [
      '貯蔵品が増えた → 資産の増加は借方',
      '通信費・租税公課が減った → 費用の減少は貸方',
      '未使用＝来期の費用なので、当期からは外す',
    ],
    statementImpact: {
      pl: 'PL：通信費 −3千、租税公課 −4千',
      bs: 'BS：貯蔵品 ＋7千',
    },
  },

  {
    id: 'd11e11',
    no: 11,
    label: 'EVENT 11',
    scene: '【決算整理】売上原価の算定',
    narrative:
      '決算日、倉庫の商品を数えたところ、期末商品棚卸高は 150,000円でした（開業初年度なので期首商品棚卸高は 0円）。',
    quiz: {
      question: '期末に売れ残った商品 150,000円は、どう処理する？',
      options: [
        { id: 'a', label: '費用（仕入）を減らし、「繰越商品」（資産）に振り替える' },
        { id: 'b', label: 'そのまま仕入（費用）にしておく' },
        { id: 'c', label: '売上を減らす' },
        { id: 'd', label: '貯蔵品にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '売れ残った商品はまだ費用ではありません。「仕入」から取り消して「繰越商品」（資産）に。差し引き後の仕入が当期の「売上原価」になります。（期首在庫があれば、まず 仕入／繰越商品 も行う）',
      wrongFeedback:
        '売れ残りは当期の費用ではなく資産（繰越商品）。仕入から外します。',
    },
    plainSummary: '売れ残った商品を、費用（仕入）から資産（繰越商品）に振り替えた',
    changes: [
      { accountId: 'mercInventory', label: '繰越商品', category: '資産', delta: 150_000 },
      { accountId: 'purchases', label: '仕入', category: '費用', delta: -150_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'mercInventory', label: '繰越商品', amount: 150_000 },
      { side: 'credit', accountId: 'purchases', label: '仕入', amount: 150_000 },
    ],
    why: [
      '繰越商品が増えた → 資産の増加は借方',
      '仕入が減った → 費用の減少は貸方',
      '売上原価 ＝ 期首商品 ＋ 当期仕入 − 期末商品（今回、期首は0）',
    ],
    statementImpact: { pl: 'PL：仕入 −15万（＝売上原価に調整）', bs: 'BS：繰越商品 ＋15万' },
  },

  {
    id: 'd11e12',
    no: 12,
    label: 'EVENT 12',
    scene: '【決算整理】消耗品の未使用分',
    narrative: '決算日、未使用の消耗品（レシート用紙など）2,000円ぶんが残っていました。',
    quiz: {
      question: '未使用の消耗品は、決算でどうする？',
      options: [
        { id: 'a', label: '消耗品費（費用）を減らし、「貯蔵品」（資産）に振り替える' },
        { id: 'b', label: 'そのまま消耗品費にしておく' },
        { id: 'c', label: '繰越商品にする' },
        { id: 'd', label: '雑損にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '切手・印紙と同じ考え方。未使用ぶんは当期の費用から外し、「貯蔵品」（資産）として繰り越します。',
      wrongFeedback:
        '未使用ぶんは来期の費用。当期の消耗品費から外して貯蔵品にします。',
    },
    plainSummary: '未使用の消耗品を、費用から資産（貯蔵品）に振り替えた',
    changes: [
      { accountId: 'storableSupplies', label: '貯蔵品', category: '資産', delta: 2_000 },
      { accountId: 'suppliesExpense', label: '消耗品費', category: '費用', delta: -2_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'storableSupplies', label: '貯蔵品', amount: 2_000 },
      { side: 'credit', accountId: 'suppliesExpense', label: '消耗品費', amount: 2_000 },
    ],
    why: [
      '貯蔵品が増えた → 資産の増加は借方',
      '消耗品費が減った → 費用の減少は貸方',
    ],
    statementImpact: { pl: 'PL：消耗品費 −2千', bs: 'BS：貯蔵品 ＋2千' },
  },
];

export const DAY11: DayDef = {
  day: 11,
  title: '決算整理①',
  subtitle: '現金過不足の整理・貯蔵品への振替・売上原価の算定（しくりくりし）。',
  focus: ['現金過不足→雑損／雑益', '貯蔵品への振替', '売上原価の算定'],
  events: EVENTS,
  recap: [
    '原因不明のまま決算をむかえた現金過不足は、不足なら雑損（費用）／過剰なら雑益（収益）',
    '未使用の切手・印紙・消耗品は、費用から「貯蔵品」（資産）に振り替えて来期に繰り越す',
    '売上原価 ＝ 期首商品 ＋ 当期仕入 − 期末商品。期末の売れ残りは「繰越商品」（資産）にする',
  ],
};
