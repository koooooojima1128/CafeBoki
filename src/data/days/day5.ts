import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 5 — 現金・預金をきちんと管理する。
 * 当座預金 / 小切手（自己振出・他人振出）/ 小口現金（インプレストシステム）/
 * 当座借越 / 電子記録債権・債務。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd5e01',
    no: 1,
    label: 'EVENT 01',
    scene: '当座預金へ資金移動',
    narrative: '小切手取引を始めるため、普通預金から当座預金へ 250,000円を移しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '当座預金が増え、普通預金が減った（資産内の振替）' },
        { id: 'b', label: '費用が増えた' },
        { id: 'c', label: '当座借越が増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '当座預金も普通預金も「会社のお金」。口座を移しただけで、資産の中の振替です。',
      wrongFeedback: 'お金の置き場所を移しただけ。損得は発生していません。',
    },
    plainSummary: '普通預金から当座預金へお金を移した',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 250_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -250_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 250_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 250_000 },
    ],
    why: [
      '当座預金が増えた → 資産の増加は借方',
      '普通預金が減った → 資産の減少は貸方',
      '当座預金は「小切手で出し入れする預金」',
    ],
    statementImpact: { bs: 'BS：普通預金 −25万、当座預金 ＋25万' },
  },

  {
    id: 'd5e02',
    no: 2,
    label: 'EVENT 02',
    scene: '小口現金の前渡し',
    narrative:
      '細かい支払い用に、小口現金係へ小切手を振り出して 30,000円を前渡ししました（インプレストシステム）。',
    quiz: {
      question: '小口現金係にお金を前渡ししたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '小口現金が増え、当座預金が減った' },
        { id: 'b', label: '費用が増えた' },
        { id: 'c', label: '現金が増えた' },
        { id: 'd', label: '立替金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '小口現金は「細かい支払い用に係が持っておくお金」＝資産。小切手を振り出したので当座預金が減ります。',
      wrongFeedback:
        'まだ何も使っていないので費用は発生しません。当座預金が小口現金という資産に変わっただけです。',
    },
    plainSummary: '細かい支払い用のお金を、小口現金係に渡した',
    changes: [
      { accountId: 'pettyCash', label: '小口現金', category: '資産', delta: 30_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'pettyCash', label: '小口現金', amount: 30_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 30_000 },
    ],
    why: [
      '小口現金が増えた → 資産の増加は借方',
      '当座預金が減った → 資産の減少は貸方（小切手を振り出した）',
      'インプレストシステム＝小口現金をいつも一定額（ここでは 30,000）にしておく方式',
    ],
    statementImpact: { bs: 'BS：当座預金 −3万、小口現金 ＋3万' },
  },

  {
    id: 'd5e03',
    no: 3,
    label: 'EVENT 03',
    scene: '小口現金の使用報告',
    narrative:
      '小口現金係から、旅費交通費 4,000円・通信費 3,000円・雑費 2,000円（計 9,000円）を支払ったと報告がありました。',
    quiz: {
      question: '小口現金からの支払報告を受けたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '各費用が増え、小口現金が 9,000円減った' },
        { id: 'b', label: '当座預金が減った' },
        { id: 'c', label: '仮払金が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '報告のあった内訳をそれぞれの費用にし、使った分だけ小口現金（資産）を減らします。',
      wrongFeedback:
        'お金は小口現金から出ています。当座預金ではなく小口現金を 9,000円減らします。',
    },
    plainSummary: '小口現金で払った細かい経費の内訳が確定した',
    changes: [
      { accountId: 'travel', label: '旅費交通費', category: '費用', delta: 4_000 },
      { accountId: 'communication', label: '通信費', category: '費用', delta: 3_000 },
      { accountId: 'miscExpense', label: '雑費', category: '費用', delta: 2_000 },
      { accountId: 'pettyCash', label: '小口現金', category: '資産', delta: -9_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'travel', label: '旅費交通費', amount: 4_000 },
      { side: 'debit', accountId: 'communication', label: '通信費', amount: 3_000 },
      { side: 'debit', accountId: 'miscExpense', label: '雑費', amount: 2_000 },
      { side: 'credit', accountId: 'pettyCash', label: '小口現金', amount: 9_000 },
    ],
    why: [
      '各費用が増えた → 費用の増加は借方',
      '小口現金が減った → 資産の減少は貸方',
      '借方の合計 9,000 ＝ 貸方 9,000',
    ],
    statementImpact: { pl: 'PL：旅費交通費・通信費・雑費 計 ＋9千', bs: 'BS：小口現金 −9千' },
  },

  {
    id: 'd5e04',
    no: 4,
    label: 'EVENT 04',
    scene: '小口現金の補給',
    narrative:
      '小口現金係へ、使った分 9,000円を小切手を振り出して補給しました（残高を定額 30,000円に戻す）。',
    quiz: {
      question: '小口現金を補給したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '小口現金が 9,000円増え、当座預金が 9,000円減った' },
        { id: 'b', label: '費用がまた増えた' },
        { id: 'c', label: '小口現金が 30,000円増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '費用は使用報告のときに計上済み。補給では「使った額 9,000円」だけを小口現金に足して、定額 30,000円に戻します。',
      wrongFeedback:
        '補給で費用は増えません。使った 9,000円ぶんだけ当座預金から小口現金へ移します。',
    },
    plainSummary: '使った分だけ小口現金に補充して、定額に戻した',
    changes: [
      { accountId: 'pettyCash', label: '小口現金', category: '資産', delta: 9_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -9_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'pettyCash', label: '小口現金', amount: 9_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 9_000 },
    ],
    why: [
      '小口現金が増えた → 資産の増加は借方',
      '当座預金が減った → 資産の減少は貸方',
      'インプレストシステムでは「使った額＝補給額」',
    ],
    statementImpact: { bs: 'BS：当座預金 −9千、小口現金 ＋9千' },
  },

  {
    id: 'd5e05',
    no: 5,
    label: 'EVENT 05',
    scene: '現金売上',
    narrative: '週末営業で現金売上が 180,000円ありました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '当座預金が増えた' },
        { id: 'c', label: '売掛金が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上。現金（資産）と売上（収益）が同額増えます。',
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
    id: 'd5e06',
    no: 6,
    label: 'EVENT 06',
    scene: '他人振出の小切手を受取',
    narrative: '商品 90,000円を売り上げ、代金は得意先が振り出した小切手で受け取りました。',
    quiz: {
      question: '得意先振出の小切手で代金を受け取ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた（他人振出の小切手は現金扱い）' },
        { id: 'b', label: '当座預金が増えた' },
        { id: 'c', label: '受取手形が増えた' },
        { id: 'd', label: '売掛金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '他人が振り出した小切手は、銀行ですぐ換金できるので「現金」として扱います（通貨代用証券）。',
      wrongFeedback:
        '受け取った小切手（他人振出）は現金扱い。自分の当座預金が増えるわけではありません。',
    },
    plainSummary: '売上代金を、他人振出の小切手（＝現金あつかい）で受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 90_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 90_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 90_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 90_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      '他人振出小切手＝通貨代用証券なので「現金」',
    ],
    statementImpact: { pl: 'PL：売上 ＋9万', bs: 'BS：現金 ＋9万' },
  },

  {
    id: 'd5e07',
    no: 7,
    label: 'EVENT 07',
    scene: '小切手を当座預金へ預入',
    narrative: 'さきほど受け取った小切手 90,000円を、ただちに当座預金に預け入れました。',
    quiz: {
      question: '受け取った小切手を当座預金に預け入れたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '当座預金が増え、現金が減った' },
        { id: 'b', label: '売上がまた増えた' },
        { id: 'c', label: '当座借越が減った' },
        { id: 'd', label: '受取手形が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '「現金（＝小切手）」を当座預金口座に入れました。資産どうしの振替で、売上は増えません。',
      wrongFeedback: '売上は前の取引で計上済み。現金が当座預金に変わっただけです。',
    },
    plainSummary: '現金あつかいの小切手を、当座預金口座に入れた',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 90_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -90_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 90_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 90_000 },
    ],
    why: [
      '当座預金が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '資産どうしの振替（売上は計上しない）',
    ],
    statementImpact: { bs: 'BS：現金 −9万、当座預金 ＋9万' },
  },

  {
    id: 'd5e08',
    no: 8,
    label: 'EVENT 08',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆などを 120,000円分、掛けで仕入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金が増えた' },
        { id: 'b', label: '当座預金が減った' },
        { id: 'c', label: '現金が減った' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback: 'いつもの掛け仕入。仕入（費用）と買掛金（負債）が増えます。',
      wrongFeedback: '掛けなので現金は動きません。買掛金という負債が増えます。',
    },
    plainSummary: '商品を先に受け取り、代金は後払いにした',
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
    id: 'd5e09',
    no: 9,
    label: 'EVENT 09',
    scene: '買掛金を小切手で支払い',
    narrative: '上の買掛金 120,000円を、小切手を振り出して支払いました。',
    quiz: {
      question: '小切手を振り出して買掛金を払ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金が減り、当座預金が減った' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '当座借越が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '自分が振り出した小切手は当座預金の引き落とし。買掛金（負債）と当座預金（資産）が同額減ります。',
      wrongFeedback:
        '自己振出の小切手は当座預金の減少。現金は動きません。',
    },
    plainSummary: '後払いの仕入代金を、小切手（当座預金）で払った',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -120_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 120_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 120_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '当座預金が減った → 資産の減少は貸方（自己振出小切手）',
    ],
    statementImpact: { bs: 'BS：買掛金 −12万、当座預金 −12万' },
  },

  {
    id: 'd5e10',
    no: 10,
    label: 'EVENT 10',
    scene: '仕入（掛け・電子記録債務の準備）',
    narrative: 'カップ・紙製品を 80,000円分、掛けで仕入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金が増えた' },
        { id: 'b', label: '電子記録債務が増えた' },
        { id: 'c', label: '当座預金が減った' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback: 'まずは通常の掛け仕入。仕入と買掛金が増えます。',
      wrongFeedback: 'この時点ではまだ買掛金。電子記録債務になるのは次の記録のときです。',
    },
    plainSummary: 'カップ類を掛けで仕入れた',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 80_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 80_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 80_000 },
    ],
    why: ['仕入が増えた → 費用の増加は借方', '買掛金が増えた → 負債の増加は貸方'],
    statementImpact: { pl: 'PL：仕入 ＋8万', bs: 'BS：買掛金 ＋8万' },
  },

  {
    id: 'd5e11',
    no: 11,
    label: 'EVENT 11',
    scene: '電子記録債務の発生',
    narrative:
      '上の買掛金 80,000円について、取引銀行を通じて電子記録債務の発生記録を行いました。',
    quiz: {
      question: '買掛金を電子記録債務にしたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金が減り、電子記録債務が増えた（負債の中で振替）' },
        { id: 'b', label: '当座預金が減った' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '費用が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'まだ支払っていません。支払う義務が「口約束（買掛金）」から「電子記録の債務」に変わっただけ。どちらも負債です。',
      wrongFeedback:
        '電子記録債務は、電子的に記録された確定的な支払義務。買掛金という負債が、別の負債に振り替わります。',
    },
    plainSummary: '買掛金を、電子記録された支払義務に切り替えた',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -80_000 },
      { accountId: 'edPayable', label: '電子記録債務', category: '負債', delta: 80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 80_000 },
      { side: 'credit', accountId: 'edPayable', label: '電子記録債務', amount: 80_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '電子記録債務が増えた → 負債の増加は貸方',
      '手形の電子版のようなもの。買掛金より確実な債務',
    ],
    statementImpact: { bs: 'BS：買掛金 −8万、電子記録債務 ＋8万' },
  },

  {
    id: 'd5e12',
    no: 12,
    label: 'EVENT 12',
    scene: '電子記録債権の発生',
    narrative:
      '得意先に対する売掛金 120,000円について、電子記録債権の発生記録を行いました。',
    quiz: {
      question: '売掛金を電子記録債権にしたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が減り、電子記録債権が増えた（資産の中で振替）' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '当座預金が増えた' },
        { id: 'd', label: '受取手形が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上は売ったとき計上済み。受け取る権利が「口約束（売掛金）」から「電子記録の債権」に変わっただけです。',
      wrongFeedback:
        '電子記録債権は、電子的に記録された確実な受取債権。売掛金という資産が、別の資産に振り替わります。',
    },
    plainSummary: '売掛金を、電子記録された受取債権に切り替えた',
    changes: [
      { accountId: 'edReceivable', label: '電子記録債権', category: '資産', delta: 120_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'edReceivable', label: '電子記録債権', amount: 120_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 120_000 },
    ],
    why: [
      '電子記録債権が増えた → 資産の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
      '売上は計上しない（売ったときに計上済み）',
    ],
    statementImpact: { bs: 'BS：売掛金 −12万、電子記録債権 ＋12万' },
  },

  {
    id: 'd5e13',
    no: 13,
    label: 'EVENT 13',
    scene: '電子記録債権の入金',
    narrative: '電子記録債権 120,000円が当座預金に入金されました。',
    quiz: {
      question: '電子記録債権が入金されたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '当座預金が増え、電子記録債権が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '受取利息が増えた' },
        { id: 'd', label: '売掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback: '「権利（電子記録債権）」が「お金（当座預金）」に変わっただけです。',
      wrongFeedback: '入金では売上は増えません。資産どうしの振替です。',
    },
    plainSummary: '電子記録債権が、当座預金として入金された',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 120_000 },
      { accountId: 'edReceivable', label: '電子記録債権', category: '資産', delta: -120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 120_000 },
      { side: 'credit', accountId: 'edReceivable', label: '電子記録債権', amount: 120_000 },
    ],
    why: [
      '当座預金が増えた → 資産の増加は借方',
      '電子記録債権が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：当座預金 ＋12万、電子記録債権 −12万' },
  },

  {
    id: 'd5e14',
    no: 14,
    label: 'EVENT 14',
    scene: '電子記録債務の支払い',
    narrative: '電子記録債務 80,000円を、当座預金から支払いました。',
    quiz: {
      question: '電子記録債務を支払ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '電子記録債務が減り、当座預金が減った' },
        { id: 'b', label: '仕入（費用）が増えた' },
        { id: 'c', label: '買掛金が減った' },
        { id: 'd', label: '当座借越が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '支払いで、電子記録債務（負債）と当座預金（資産）が同額減ります。',
      wrongFeedback: '仕入の費用は仕入れたとき計上済み。ここでは負債と資産が減るだけです。',
    },
    plainSummary: '電子記録された支払義務を、当座預金から果たした',
    changes: [
      { accountId: 'edPayable', label: '電子記録債務', category: '負債', delta: -80_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'edPayable', label: '電子記録債務', amount: 80_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 80_000 },
    ],
    why: [
      '電子記録債務が減った → 負債の減少は借方',
      '当座預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：電子記録債務 −8万、当座預金 −8万' },
  },

  {
    id: 'd5e15',
    no: 15,
    label: 'EVENT 15',
    scene: '当座借越の利用',
    narrative:
      '厨房設備（備品）260,000円を購入し、小切手を振り出しました。このとき当座預金の残高は 221,000円でしたが、銀行と当座借越契約（限度額 500,000円）を結んでいます。',
    quiz: {
      question: '残高を超えて小切手を振り出せたのは、なぜ？',
      options: [
        { id: 'a', label: '銀行と当座借越契約があり、不足分を銀行が一時的に立て替えるから' },
        { id: 'b', label: '小切手はいくらでも振り出せるから' },
        { id: 'c', label: '備品を買うと現金が増えるから' },
        { id: 'd', label: '売上が立つから' },
      ],
      correctId: 'a',
      correctFeedback:
        '当座借越契約があると、残高不足でも限度額まで小切手を振り出せます（不足分は銀行からの借り）。当座預金は貸方残（マイナス）になります。',
      wrongFeedback:
        '本来は残高までしか振り出せません。当座借越契約があるから、不足分を銀行が立て替えてくれます。',
    },
    plainSummary: '当座預金の残高を超えて小切手を振り出した（当座借越を利用）',
    changes: [
      { accountId: 'equipment', label: '備品', category: '資産', delta: 260_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -260_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'equipment', label: '備品', amount: 260_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 260_000 },
    ],
    why: [
      '備品が増えた → 資産の増加は借方',
      '当座預金が減った → 資産の減少は貸方',
      '残高 221,000 − 260,000 ＝ −39,000（当座預金が貸方残＝マイナスに）',
    ],
    statementImpact: { bs: 'BS：備品 ＋26万、当座預金 −26万（残高マイナスに）' },
  },

  {
    id: 'd5e16',
    no: 16,
    label: 'EVENT 16',
    scene: '当座借越への振替（決算）',
    narrative:
      '決算にあたり、当座預金の貸方残高（マイナス）39,000円を、当座借越（負債）に振り替えました。',
    quiz: {
      question: '当座預金がマイナスのまま決算をむかえたとき、どうする？',
      options: [
        { id: 'a', label: '貸方残高を「当座借越」（負債）に振り替える' },
        { id: 'b', label: 'そのままマイナスの資産として残す' },
        { id: 'c', label: '費用として処理する' },
        { id: 'd', label: '売上のマイナスにする' },
      ],
      correctId: 'a',
      correctFeedback:
        '当座預金のマイナスは、実質「銀行からの借り」。決算では当座借越（または借入金）という負債に振り替えて、BS をきれいにします。',
      wrongFeedback:
        '資産がマイナスのままでは変です。銀行からの借り＝負債（当座借越）に振り替えます。',
    },
    plainSummary: '当座預金のマイナス分を、銀行からの借り（当座借越）に直した',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 39_000 },
      { accountId: 'bankOverdraft', label: '当座借越', category: '負債', delta: 39_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 39_000 },
      { side: 'credit', accountId: 'bankOverdraft', label: '当座借越', amount: 39_000 },
    ],
    why: [
      '当座預金（貸方残）を借方に入れて 0 に戻す',
      '当座借越が増えた → 負債の増加は貸方',
      '「当座預金のマイナス＝銀行への借り（負債）」',
    ],
    statementImpact: { bs: 'BS：当座預金 0 に、当座借越（負債）＋39,000' },
  },
];

export const DAY5: DayDef = {
  day: 5,
  title: '現金・預金をきちんと管理する',
  subtitle: '当座預金・小切手・小口現金・当座借越・電子記録債権債務を扱います。',
  focus: ['当座預金と小切手', '小口現金', '当座借越', '電子記録債権・債務'],
  events: EVENTS,
  recap: [
    '他人が振り出した小切手は「現金」、自分が振り出した小切手は「当座預金の減少」',
    '小口現金はインプレストシステム。使った額だけ補給して定額に戻す',
    '当座借越契約があれば残高を超えて小切手を振り出せる。決算でマイナス分は当座借越（負債）へ',
    '電子記録債権・債務は、売掛金・買掛金を電子記録に置きかえたもの',
  ],
};
