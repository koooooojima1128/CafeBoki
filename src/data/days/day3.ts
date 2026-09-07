import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 3 — 日々の細かい経費と、人を雇うお金。
 * 消耗品費 / 通信費 / 旅費交通費 / 立替金 / 預り金 / 仮払金 / 仮受金 / 現金過不足。
 * その日の利益：売上 300,000 −（経費 252,000）＝ ＋48,000。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd3e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: '週末は満席続き。1日の現金売上は 15万円でした。',
    quiz: {
      question: '現金で売り上げたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上（収益）が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '前受金が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上です。現金（資産）と売上（収益）が同額増えます。',
      wrongFeedback: 'その場で現金を受け取ったので、現金と売上が増えます。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 150_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 150_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 150_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 150_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋15万', bs: 'BS：現金 ＋15万' },
  },

  {
    id: 'd3e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: '近隣オフィスへ、まとめてドリンクを掛けで販売しました（9万円）。',
    quiz: {
      question: '掛けで売り上げたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が増え、売上が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '前受金が増えた' },
        { id: 'd', label: '買掛金が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '後で代金を受け取る約束なので、売掛金（資産）と売上（収益）が増えます。',
      wrongFeedback: '掛けなのでまだ現金は入りません。売掛金という資産で受け取ります。',
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
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋9万', bs: 'BS：売掛金 ＋9万' },
  },

  {
    id: 'd3e03',
    no: 3,
    label: 'EVENT 03',
    scene: '消耗品費',
    narrative:
      'コピー用紙・ボールペン・レシート用紙などの事務用品 8,000円を現金で購入しました（すぐ使い切るもの）。',
    quiz: {
      question: 'すぐ使い切る事務用品を買ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、消耗品費（費用）が増えた' },
        { id: 'b', label: '備品（資産）が増えた' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        'すぐ使い切る少額のものは「消耗品費」という費用。何年も使う備品とは分けます。',
      wrongFeedback:
        '長く使うマシンなどは備品（資産）ですが、紙やペンはすぐ無くなるので消耗品費（費用）です。',
    },
    plainSummary: 'すぐ使い切る事務用品を現金で買った',
    changes: [
      { accountId: 'suppliesExpense', label: '消耗品費', category: '費用', delta: 8_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -8_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'suppliesExpense', label: '消耗品費', amount: 8_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 8_000 },
    ],
    why: [
      '消耗品費が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '「すぐ使い切る＝費用」「長く使う＝資産（備品）」',
    ],
    statementImpact: { pl: 'PL：消耗品費 ＋8千', bs: 'BS：現金 −8千' },
  },

  {
    id: 'd3e04',
    no: 4,
    label: 'EVENT 04',
    scene: '通信費',
    narrative:
      '店の携帯電話とインターネットの料金 12,000円が普通預金から引き落とされました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が減り、通信費（費用）が増えた' },
        { id: 'b', label: '消耗品費が増えた' },
        { id: 'c', label: '前払金が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '電話・ネット・切手・宅配便などの費用は「通信費」でまとめます。',
      wrongFeedback:
        '通信にかかった費用なので「通信費」。普通預金から引き落とされて資産が減ります。',
    },
    plainSummary: '電話・ネット料金が口座から引き落とされた',
    changes: [
      { accountId: 'communication', label: '通信費', category: '費用', delta: 12_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -12_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'communication', label: '通信費', amount: 12_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 12_000 },
    ],
    why: ['通信費が増えた → 費用の増加は借方', '普通預金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：通信費 ＋1.2万', bs: 'BS：普通預金 −1.2万' },
  },

  {
    id: 'd3e05',
    no: 5,
    label: 'EVENT 05',
    scene: '旅費交通費',
    narrative: '仕入先へ打ち合わせに行き、電車・バス代 4,000円を現金で支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、旅費交通費（費用）が増えた' },
        { id: 'b', label: '立替金が増えた' },
        { id: 'c', label: '仮払金が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '電車・バス・タクシー・出張の宿泊などは「旅費交通費」という費用です。',
      wrongFeedback:
        '移動にかかったお金なので旅費交通費（費用）。現金で払ったので現金が減ります。',
    },
    plainSummary: '移動の交通費を現金で払った',
    changes: [
      { accountId: 'travel', label: '旅費交通費', category: '費用', delta: 4_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -4_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'travel', label: '旅費交通費', amount: 4_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 4_000 },
    ],
    why: ['旅費交通費が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：旅費交通費 ＋4千', bs: 'BS：現金 −4千' },
  },

  {
    id: 'd3e06',
    no: 6,
    label: 'EVENT 06',
    scene: '立替金',
    narrative:
      '従業員の通勤定期代 3,000円を、本人に代わって会社が現金で立て替えて払いました（あとで本人から回収します）。',
    quiz: {
      question: '従業員の分を会社が立替払いしたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、立替金（本人から回収する権利）が増えた' },
        { id: 'b', label: '旅費交通費（費用）が増えた' },
        { id: 'c', label: '給料が増えた' },
        { id: 'd', label: '預り金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '会社の費用ではなく「従業員に代わって払った、あとで返してもらうお金」なので、立替金という資産です。',
      wrongFeedback:
        'これは会社の交通費ではありません。本人から回収するので、立替金（資産）になります。',
    },
    plainSummary: '従業員の分を会社が立て替えた（あとで回収する）',
    changes: [
      { accountId: 'advancesPaid', label: '立替金', category: '資産', delta: 3_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -3_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'advancesPaid', label: '立替金', amount: 3_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 3_000 },
    ],
    why: [
      '立替金が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '立替金は「他人の分を払った、回収予定のお金」（資産）',
    ],
    statementImpact: { bs: 'BS：現金 −3千、立替金 ＋3千' },
  },

  {
    id: 'd3e07',
    no: 7,
    label: 'EVENT 07',
    scene: '仮払金',
    narrative:
      '出張する従業員に、旅費の概算として 3万円を現金で前渡ししました（使った金額はあとで精算します）。',
    quiz: {
      question: '金額が確定していないお金を前渡ししたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、仮払金（精算までの一時的な資産）が増えた' },
        { id: 'b', label: '旅費交通費（費用）が確定して増えた' },
        { id: 'c', label: '立替金が増えた' },
        { id: 'd', label: '前払金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'いくら使うか未確定なので、まだ費用にはできません。精算までの「仮の支払い」＝仮払金（資産）で持っておきます。',
      wrongFeedback:
        '使った額が決まっていないので旅費交通費にはできません。いったん仮払金（資産）で処理します。',
    },
    plainSummary: '使い道は決まっているが金額が未確定のお金を、先に渡した',
    changes: [
      { accountId: 'suspensePaid', label: '仮払金', category: '資産', delta: 30_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'suspensePaid', label: '仮払金', amount: 30_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 30_000 },
    ],
    why: [
      '仮払金が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '仮払金は「あとで正しい科目に振り替える」一時的な資産',
    ],
    statementImpact: { bs: 'BS：現金 −3万、仮払金 ＋3万' },
  },

  {
    id: 'd3e08',
    no: 8,
    label: 'EVENT 08',
    scene: '仮払金の精算',
    narrative:
      '出張から戻り精算しました。旅費交通費は 26,000円で、余った 4,000円は現金で返してもらいました。',
    quiz: {
      question: '仮払金を精算したとき、会社の中では何が起きた？',
      options: [
        {
          id: 'a',
          label: '仮払金が消え、旅費交通費 26,000円が確定し、現金 4,000円が戻った',
        },
        { id: 'b', label: '旅費交通費が 30,000円増えた' },
        { id: 'c', label: '仮払金がそのまま残る' },
        { id: 'd', label: '立替金に振り替わる' },
      ],
      correctId: 'a',
      correctFeedback:
        '仮払金 30,000円の内訳が確定：旅費交通費 26,000円と、戻ってきた現金 4,000円に分かれます。',
      wrongFeedback:
        '実際に使ったのは 26,000円。差額 4,000円は現金で戻るので、仮払金 30,000円がぴったり無くなります。',
    },
    plainSummary: '前渡ししたお金の使い道が確定し、余りが戻ってきた',
    changes: [
      { accountId: 'travel', label: '旅費交通費', category: '費用', delta: 26_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: 4_000 },
      { accountId: 'suspensePaid', label: '仮払金', category: '資産', delta: -30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'travel', label: '旅費交通費', amount: 26_000 },
      { side: 'debit', accountId: 'cash', label: '現金', amount: 4_000 },
      { side: 'credit', accountId: 'suspensePaid', label: '仮払金', amount: 30_000 },
    ],
    why: [
      '旅費交通費が増えた → 費用の増加は借方',
      '現金が戻った → 資産の増加は借方',
      '仮払金が減った → 資産の減少は貸方',
      '借方合計 30,000 ＝ 貸方 30,000',
    ],
    statementImpact: { pl: 'PL：旅費交通費 ＋2.6万', bs: 'BS：仮払金 −3万、現金 ＋4千' },
  },

  {
    id: 'd3e09',
    no: 9,
    label: 'EVENT 09',
    scene: '給料の支払い',
    narrative:
      '従業員へ給料 20万円を支給。源泉所得税 12,000円と、先に立て替えた定期代 3,000円を差し引き、残り 185,000円を普通預金から振り込みました。',
    quiz: {
      question: '天引きして給料を払ったとき、会社の中では何が起きた？',
      options: [
        {
          id: 'a',
          label: '給料（費用）20万円が発生し、預り金・立替金の回収・普通預金の減少に分かれた',
        },
        { id: 'b', label: '給料は 185,000円だけ' },
        { id: 'c', label: '源泉所得税は会社の費用' },
        { id: 'd', label: '立替金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '給料の費用は満額の 20万円。そこから、税務署に納める預り金 12,000円、立替金の回収 3,000円を引き、残り 185,000円を振込。',
      wrongFeedback:
        '費用になる給料は天引き前の 20万円。天引き分は「預り金（負債）」「立替金の回収（資産の減少）」です。',
    },
    plainSummary: '給料から税金などを天引きして、残りを振り込んだ',
    changes: [
      { accountId: 'salary', label: '給料', category: '費用', delta: 200_000 },
      { accountId: 'depositsReceived', label: '預り金', category: '負債', delta: 12_000 },
      { accountId: 'advancesPaid', label: '立替金', category: '資産', delta: -3_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -185_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'salary', label: '給料', amount: 200_000 },
      { side: 'credit', accountId: 'depositsReceived', label: '預り金', amount: 12_000 },
      { side: 'credit', accountId: 'advancesPaid', label: '立替金', amount: 3_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 185_000 },
    ],
    why: [
      '給料が増えた → 費用の増加は借方（天引き前の全額）',
      '預り金が増えた → 負債の増加は貸方',
      '立替金が減った → 資産の減少は貸方（本人から回収できた）',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: {
      pl: 'PL：給料 ＋20万',
      bs: 'BS：預り金 ＋1.2万、立替金 −3千、普通預金 −18.5万',
    },
  },

  {
    id: 'd3e10',
    no: 10,
    label: 'EVENT 10',
    scene: '掛け売上',
    narrative: '別の得意先へも、掛けで 6万円を売り上げました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が増え、売上が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '仮受金が増えた' },
        { id: 'd', label: '前受金が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '掛け売上なので売掛金（資産）と売上（収益）が増えます。',
      wrongFeedback: '後払いの約束なので、売掛金という資産で受け取ります。',
    },
    plainSummary: '商品を先に渡し、代金は後でもらうことにした',
    changes: [
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 60_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 60_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 60_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 60_000 },
    ],
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋6万', bs: 'BS：売掛金 ＋6万' },
  },

  {
    id: 'd3e11',
    no: 11,
    label: 'EVENT 11',
    scene: '預り金の納付',
    narrative:
      '給料から預かっていた源泉所得税 12,000円を、税務署に現金で納付しました。',
    quiz: {
      question: '預かっていた税金を納めたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '預り金（納める義務）が減り、現金が減った' },
        { id: 'b', label: '給料（費用）が増えた' },
        { id: 'c', label: '租税公課（費用）が増えた' },
        { id: 'd', label: '立替金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        'この税金は従業員が負担するもので、会社は「預かって代わりに納める」だけ。会社の費用にはならず、預り金（負債）が減ります。',
      wrongFeedback:
        '源泉所得税は会社の費用ではありません。預かっていた分（預り金）を納めたので、負債が減ります。',
    },
    plainSummary: '給料から預かっていた税金を、税務署に納めた',
    changes: [
      { accountId: 'depositsReceived', label: '預り金', category: '負債', delta: -12_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -12_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'depositsReceived', label: '預り金', amount: 12_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 12_000 },
    ],
    why: [
      '預り金が減った → 負債の減少は借方',
      '現金が減った → 資産の減少は貸方',
      '預り金は「他人のお金を一時的に預かっている」負債',
    ],
    statementImpact: { bs: 'BS：預り金 −1.2万、現金 −1.2万' },
  },

  {
    id: 'd3e12',
    no: 12,
    label: 'EVENT 12',
    scene: '仮受金',
    narrative: '普通預金に、差出人も内容もわからない入金 5万円がありました。',
    quiz: {
      question: '内容がわからない入金があったとき、会社の中では何が起きた？',
      options: [
        {
          id: 'a',
          label: '普通預金が増え、仮受金（内容が分かるまでの一時的な負債）が増えた',
        },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '前受金が増えた' },
        { id: 'd', label: '売掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '何のお金か不明なうちは売上にも売掛金回収にもできません。いったん仮受金（負債）で受けておきます。',
      wrongFeedback:
        '内容が確定するまでは科目を決められません。一時的に仮受金（負債）で処理します。',
    },
    plainSummary: '正体不明のお金が入ってきた（とりあえず預かり扱い）',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 50_000 },
      { accountId: 'suspenseReceived', label: '仮受金', category: '負債', delta: 50_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 50_000 },
      { side: 'credit', accountId: 'suspenseReceived', label: '仮受金', amount: 50_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '仮受金が増えた → 負債の増加は貸方',
      '仮受金は「あとで正しい科目に振り替える」一時的な負債',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋5万、仮受金 ＋5万' },
  },

  {
    id: 'd3e13',
    no: 13,
    label: 'EVENT 13',
    scene: '仮受金の判明',
    narrative:
      '先ほどの入金 5万円は、得意先からの売掛金の回収だと判明しました。',
    quiz: {
      question: '仮受金の正体が売掛金の回収と分かったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仮受金が消え、売掛金（もらう権利）が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '現金が増えた' },
        { id: 'd', label: '前受金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上は掛け販売のとき計上済み。今回は仮受金（負債）を正しい科目に振り替え、売掛金（資産）を減らします。',
      wrongFeedback:
        '入金の正体が分かっただけなので売上は増えません。仮受金を消して、売掛金を減らします。',
    },
    plainSummary: '正体不明だったお金が、売掛金の回収だと判明した',
    changes: [
      { accountId: 'suspenseReceived', label: '仮受金', category: '負債', delta: -50_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -50_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'suspenseReceived', label: '仮受金', amount: 50_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 50_000 },
    ],
    why: [
      '仮受金が減った → 負債の減少は借方',
      '売掛金が減った → 資産の減少は貸方',
      '仮の勘定は、正体が分かったら必ず振り替える',
    ],
    statementImpact: { bs: 'BS：仮受金 −5万、売掛金 −5万' },
  },

  {
    id: 'd3e14',
    no: 14,
    label: 'EVENT 14',
    scene: '現金過不足（発見）',
    narrative:
      '一日の終わりに金庫の現金を数えたら、帳簿の残高より 2,000円少なくなっていました（原因は不明）。',
    quiz: {
      question: '現金が帳簿より少なかったとき、会社の中では何が起きた？',
      options: [
        {
          id: 'a',
          label: '帳簿の現金を実際に合わせて減らし、差額を現金過不足として一時的に記録した',
        },
        { id: 'b', label: '雑損（費用）を確定計上した' },
        { id: 'c', label: '現金を増やした' },
        { id: 'd', label: '売上を減らした' },
      ],
      correctId: 'a',
      correctFeedback:
        'まず帳簿を実際の有り高に合わせます。原因が分かるまで、差額 2,000円は現金過不足という仮の勘定で持っておきます。',
      wrongFeedback:
        '原因不明のうちは費用を確定できません。差額はいったん現金過不足で受けます。',
    },
    plainSummary: '実際の現金が帳簿より少なかったので、帳簿を実際に合わせた',
    changes: [
      { accountId: 'cashOverShort', label: '現金過不足', category: '資産', delta: 2_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -2_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cashOverShort', label: '現金過不足', amount: 2_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 2_000 },
    ],
    why: [
      '現金過不足（借方）＝原因不明の不足を一時的に置く場所',
      '現金が減った → 資産の減少は貸方',
      'まず「帳簿を実際の有り高に合わせる」',
    ],
    statementImpact: { bs: 'BS：現金 −2千（帳簿を実際有高に修正）' },
  },

  {
    id: 'd3e15',
    no: 15,
    label: 'EVENT 15',
    scene: '現金過不足（判明）',
    narrative:
      '不足 2,000円の原因は、記帳し忘れていた旅費交通費（電車代）2,000円でした。',
    quiz: {
      question: '現金過不足の原因が費用の記帳漏れと分かったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金過不足が消え、旅費交通費（費用）が確定して増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '雑益（収益）が増えた' },
        { id: 'd', label: '立替金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '原因が判明したので、仮の勘定（現金過不足）を正しい費用（旅費交通費）に振り替えます。これで現金過不足はゼロに。',
      wrongFeedback:
        '現金はもう修正済み。ここでは現金過不足を消して、旅費交通費（費用）に振り替えます。',
    },
    plainSummary: '現金が足りなかった原因（交通費の記帳漏れ）が分かった',
    changes: [
      { accountId: 'travel', label: '旅費交通費', category: '費用', delta: 2_000 },
      { accountId: 'cashOverShort', label: '現金過不足', category: '資産', delta: -2_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'travel', label: '旅費交通費', amount: 2_000 },
      { side: 'credit', accountId: 'cashOverShort', label: '現金過不足', amount: 2_000 },
    ],
    why: [
      '旅費交通費が増えた → 費用の増加は借方',
      '現金過不足が減った → 貸方で消す',
      '原因判明で仮の勘定は必ず精算する（決算まで残ったら雑損・雑益へ）',
    ],
    statementImpact: { pl: 'PL：旅費交通費 ＋2千', bs: 'BS：現金過不足 0 に' },
  },
];

export const DAY3: DayDef = {
  day: 3,
  title: 'こまかい経費と、人を雇うお金',
  subtitle: '日々の細かな支払いと、金額・内容が未確定なお金の一時処理を学びます。',
  focus: ['消耗品費・通信費', '立替金・預り金', '仮払金・仮受金', '現金過不足'],
  events: EVENTS,
  recap: [
    'こまかい経費にも名前がある：消耗品費・通信費・旅費交通費',
    '立替金は「他人の分を払った」資産、預り金は「他人のお金を預かった」負債',
    '金額や内容が未確定なら、仮払金・仮受金・現金過不足でいったん受けて、後で必ず振り替える',
    '給料の費用は天引き前の全額。天引き分は預り金などに分かれる',
  ],
};
