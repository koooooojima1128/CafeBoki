import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 10 — 試算表と、決算の準備。
 * いろいろな取引をこなしつつ、「全部の仕訳を集めると試算表になり、借方合計＝貸方合計」を体感する。
 * 現金過不足を +3,000 だけ残して、DAY 11 の決算整理につなげる。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd10e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: 'この日の現金売上は 280,000円でした。',
    quiz: {
      question: 'この仕訳は、試算表のどこに影響する？',
      options: [
        { id: 'a', label: '借方に「現金」、貸方に「売上」が同額ふえる' },
        { id: 'b', label: '借方だけがふえる' },
        { id: 'c', label: '貸方だけがふえる' },
        { id: 'd', label: '試算表には影響しない' },
      ],
      correctId: 'a',
      correctFeedback:
        '1つの仕訳で借方と貸方に同額を書くので、試算表の借方合計と貸方合計は必ず同じだけ増えます。',
      wrongFeedback:
        '仕訳は必ず借方＝貸方。だから試算表の借方合計と貸方合計は一致します。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 280_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 280_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 280_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 280_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋28万', bs: 'BS：現金 ＋28万' },
  },

  {
    id: 'd10e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: 'オフィスへ商品 160,000円分を掛けで販売しました。',
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
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 160_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 160_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 160_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 160_000 },
    ],
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋16万', bs: 'BS：売掛金 ＋16万' },
  },

  {
    id: 'd10e03',
    no: 3,
    label: 'EVENT 03',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆・食材を 140,000円分、掛けで仕入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金が増えた' },
        { id: 'b', label: '未払金が増えた' },
        { id: 'c', label: '現金が減った' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '商品の掛け仕入。仕入（費用）と買掛金（負債）が増えます。',
      wrongFeedback: '掛けなので現金は動きません。買掛金という負債が増えます。',
    },
    plainSummary: '商品を掛けで仕入れた',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 140_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 140_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 140_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 140_000 },
    ],
    why: ['仕入が増えた → 費用の増加は借方', '買掛金が増えた → 負債の増加は貸方'],
    statementImpact: { pl: 'PL：仕入 ＋14万', bs: 'BS：買掛金 ＋14万' },
  },

  {
    id: 'd10e04',
    no: 4,
    label: 'EVENT 04',
    scene: '売掛金の回収',
    narrative: '売掛金 200,000円が当座預金に振り込まれました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '当座預金が増え、売掛金が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '現金が増えた' },
        { id: 'd', label: '買掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback: '「受け取る権利（売掛金）」が「お金（当座預金）」に変わっただけです。',
      wrongFeedback: '回収では売上は増えません。資産どうしの振替です。',
    },
    plainSummary: '売掛金が、当座預金として入金された',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 200_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -200_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 200_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 200_000 },
    ],
    why: [
      '当座預金が増えた → 資産の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：当座預金 ＋20万、売掛金 −20万' },
  },

  {
    id: 'd10e05',
    no: 5,
    label: 'EVENT 05',
    scene: '買掛金の支払い（小切手）',
    narrative: '買掛金 180,000円を、小切手を振り出して支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金が減り、当座預金が減った' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '当座借越が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '自己振出の小切手は当座預金の引き落とし。買掛金と当座預金が減ります。',
      wrongFeedback: '自己振出の小切手は当座預金の減少。現金は動きません。',
    },
    plainSummary: '後払いの仕入代金を、小切手で払った',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -180_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -180_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 180_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 180_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '当座預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：買掛金 −18万、当座預金 −18万' },
  },

  {
    id: 'd10e06',
    no: 6,
    label: 'EVENT 06',
    scene: '水道光熱費',
    narrative: '電気・ガス・水道代 22,000円を現金で支払いました。',
    quiz: {
      question: 'この費用は、試算表の借方・貸方どちらに残高が出る？',
      options: [
        { id: 'a', label: '借方（費用は借方に残高が出る）' },
        { id: 'b', label: '貸方（費用は貸方）' },
        { id: 'c', label: '両方に半分ずつ' },
        { id: 'd', label: 'どちらにも出ない' },
      ],
      correctId: 'a',
      correctFeedback:
        '費用と資産は「借方」に残高が出ます。負債・純資産・収益は「貸方」。試算表はこの残高を左右に並べたものです。',
      wrongFeedback:
        '費用・資産は借方残高、負債・純資産・収益は貸方残高。試算表はこれを並べます。',
    },
    plainSummary: '光熱費を現金で払った',
    changes: [
      { accountId: 'utilities', label: '水道光熱費', category: '費用', delta: 22_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -22_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'utilities', label: '水道光熱費', amount: 22_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 22_000 },
    ],
    why: [
      '水道光熱費が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：水道光熱費 ＋2.2万', bs: 'BS：現金 −2.2万' },
  },

  {
    id: 'd10e07',
    no: 7,
    label: 'EVENT 07',
    scene: '家賃の支払い',
    narrative: '店舗の家賃 55,000円を普通預金から支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '支払家賃（費用）が増え、普通預金が減った' },
        { id: 'b', label: '差入保証金が増えた' },
        { id: 'c', label: '前払費用が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback: '毎月の家賃は費用（支払家賃）。普通預金（資産）が減ります。',
      wrongFeedback: '家賃は使い切る費用。差入保証金（返ってくる敷金）とは違います。',
    },
    plainSummary: '今月の家賃を口座から払った',
    changes: [
      { accountId: 'rent', label: '支払家賃', category: '費用', delta: 55_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -55_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'rent', label: '支払家賃', amount: 55_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 55_000 },
    ],
    why: [
      '支払家賃が増えた → 費用の増加は借方',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：支払家賃 ＋5.5万', bs: 'BS：普通預金 −5.5万' },
  },

  {
    id: 'd10e08',
    no: 8,
    label: 'EVENT 08',
    scene: '借入金の利息',
    narrative: '借入金の利息 5,000円を普通預金から支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '支払利息（費用）が増え、普通預金が減った' },
        { id: 'b', label: '借入金が減った' },
        { id: 'c', label: '受取利息が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback: '利息だけの支払いは「支払利息」（費用）。元本（借入金）は減りません。',
      wrongFeedback: '元本を返したわけではないので借入金は減りません。利息は「支払利息」です。',
    },
    plainSummary: '借金の利息を払った',
    changes: [
      { accountId: 'interestExpense', label: '支払利息', category: '費用', delta: 5_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -5_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'interestExpense', label: '支払利息', amount: 5_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 5_000 },
    ],
    why: [
      '支払利息が増えた → 費用の増加は借方',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：支払利息 ＋5千', bs: 'BS：普通預金 −5千' },
  },

  {
    id: 'd10e09',
    no: 9,
    label: 'EVENT 09',
    scene: '電子記録債権の発生',
    narrative: '売掛金 80,000円について、電子記録債権の発生記録を行いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '電子記録債権が増え、売掛金が減った（資産の中で振替）' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '当座預金が増えた' },
        { id: 'd', label: '受取手形が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '受け取る権利を、口約束（売掛金）から電子記録に置きかえました。',
      wrongFeedback: '売上は計上済み。売掛金という資産が電子記録債権という資産に変わります。',
    },
    plainSummary: '売掛金を電子記録債権に切り替えた',
    changes: [
      { accountId: 'edReceivable', label: '電子記録債権', category: '資産', delta: 80_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'edReceivable', label: '電子記録債権', amount: 80_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 80_000 },
    ],
    why: [
      '電子記録債権が増えた → 資産の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：売掛金 −8万、電子記録債権 ＋8万' },
  },

  {
    id: 'd10e10',
    no: 10,
    label: 'EVENT 10',
    scene: '現金過不足（不足）',
    narrative:
      '現金の実査をしたところ、帳簿残高より 5,000円少なくなっていました（原因は不明）。',
    quiz: {
      question: '現金が帳簿より少なかったとき、どうする？',
      options: [
        { id: 'a', label: '帳簿を実際に合わせて減らし、差額を現金過不足に置く' },
        { id: 'b', label: '雑損（費用）をすぐ計上する' },
        { id: 'c', label: '現金を増やす' },
        { id: 'd', label: '売上を減らす' },
      ],
      correctId: 'a',
      correctFeedback:
        'まず帳簿を実際の有り高に合わせます。原因が分かるまで差額は「現金過不足」で預かっておきます（DAY 3 と同じ）。',
      wrongFeedback: '原因不明のうちは費用を確定できません。「現金過不足」で受けます。',
    },
    plainSummary: '現金が帳簿より足りなかったので、帳簿を実際に合わせた',
    changes: [
      { accountId: 'cashOverShort', label: '現金過不足', category: '資産', delta: 5_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -5_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cashOverShort', label: '現金過不足', amount: 5_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 5_000 },
    ],
    why: [
      '現金過不足（借方）＝原因不明の不足を一時的に置く',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：現金 −5千（帳簿を実際有高に修正）' },
  },

  {
    id: 'd10e11',
    no: 11,
    label: 'EVENT 11',
    scene: '現金過不足（過剰）',
    narrative:
      '別の日、現金の実査で帳簿より 2,000円多くなっていました（原因は不明）。',
    quiz: {
      question: '現金が帳簿より多かったとき、どうする？',
      options: [
        { id: 'a', label: '帳簿の現金を増やし、差額を現金過不足（貸方）に置く' },
        { id: 'b', label: '雑益（収益）をすぐ計上する' },
        { id: 'c', label: '売上を増やす' },
        { id: 'd', label: '現金を減らす' },
      ],
      correctId: 'a',
      correctFeedback:
        '実際に多かったので帳簿の現金を増やし、差額 2,000円を「現金過不足」で預かります。（過剰なので貸方）これで現金過不足の残高は 5,000 − 2,000 ＝ 3,000円（借方）になります。',
      wrongFeedback:
        '原因不明のうちは雑益にしません。「現金過不足」で受けておきます。',
    },
    plainSummary: '現金が帳簿より多かったので、帳簿を実際に合わせた',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 2_000 },
      { accountId: 'cashOverShort', label: '現金過不足', category: '資産', delta: -2_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 2_000 },
      { side: 'credit', accountId: 'cashOverShort', label: '現金過不足', amount: 2_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '現金過不足を貸方に（不足 5,000 と相殺され、残り 3,000 の借方残に）',
    ],
    statementImpact: { bs: 'BS：現金 ＋2千、現金過不足の残高は 3,000（借方）に' },
  },

  {
    id: 'd10e12',
    no: 12,
    label: 'EVENT 12',
    scene: '現金売上',
    narrative: '週末営業で現金売上が 190,000円ありました。',
    quiz: {
      question:
        'ここまでの仕訳をすべて集計して試算表を作ると、借方合計と貸方合計は？',
      options: [
        { id: 'a', label: '必ず一致する（すべての仕訳が借方＝貸方だから）' },
        { id: 'b', label: '借方の方が大きくなる' },
        { id: 'c', label: '貸方の方が大きくなる' },
        { id: 'd', label: '取引の数だけずれる' },
      ],
      correctId: 'a',
      correctFeedback:
        '1つ1つの仕訳で借方＝貸方なので、それを全部集めた試算表でも借方合計＝貸方合計。ここが合わなければ、どこかで記帳ミスがあります。',
      wrongFeedback:
        '仕訳は必ず借方＝貸方。だから試算表の左右も一致します（合わなければミスの発見に使える）。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 190_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 190_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 190_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 190_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      '試算表は「勘定ごとの残高」を左右に並べたもの。左右の合計は一致する',
    ],
    statementImpact: { pl: 'PL：売上 ＋19万', bs: 'BS：現金 ＋19万' },
  },
];

export const DAY10: DayDef = {
  day: 10,
  title: '試算表と、決算の準備',
  subtitle:
    'いろいろな取引をこなしながら「集めると試算表になる／借方合計＝貸方合計」を確かめます。',
  focus: ['試算表（合計・残高）', '借方合計＝貸方合計', '現金過不足'],
  events: EVENTS,
  recap: [
    '資産・費用は借方に残高、負債・純資産・収益は貸方に残高が出る',
    '全部の仕訳を集めた試算表は、借方合計＝貸方合計（合わなければ記帳ミスの手がかり）',
    '現金過不足は原因が分かるまでの一時的な勘定。決算までに残ったら雑損／雑益へ（DAY 11）',
  ],
};
