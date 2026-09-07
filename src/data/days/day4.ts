import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 4 — 商品売買のこまかい処理。
 * 返品（戻し・戻り）/ 値引き / 仕入・売上の諸掛り / クレジット売掛金 / 受取商品券。
 * その日の利益：売上（純額）215,000 −（仕入 98,000 ＋ 発送費 2,000 ＋ 支払手数料 3,200）＝ ＋111,800。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd4e01',
    no: 1,
    label: 'EVENT 01',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆・紙カップなどを 120,000円分、掛けで仕入れました。',
    quiz: {
      question: '掛けで仕入れたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金（払う義務）が増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '売掛金が増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback: 'いつもの掛け仕入。仕入（費用）と買掛金（負債）が同額増えます。',
      wrongFeedback: '後払いの約束なので現金は動きません。買掛金という負債が増えます。',
    },
    plainSummary: '商品を先に受け取り、代金は後で払うことにした',
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
    id: 'd4e02',
    no: 2,
    label: 'EVENT 02',
    scene: '仕入戻し（返品）',
    narrative:
      '届いた商品のうち 20,000円分に汚れがあり、仕入先に返品しました（掛け代金から差し引き）。',
    quiz: {
      question: '仕入れた商品を返品したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金（払う義務）が減り、仕入（費用）も減った' },
        { id: 'b', label: '仕入（費用）が増えた' },
        { id: 'c', label: '売上が減った' },
        { id: 'd', label: '現金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '返した分は「買わなかったこと」にします。仕入（費用）を減らし、その分の買掛金（負債）も減らします。仕入時の逆仕訳です。',
      wrongFeedback:
        '返品は仕入の取り消し。仕入（費用）を減らし、払う義務（買掛金）も減らします。',
    },
    plainSummary: '仕入れた商品の一部を返した（仕入の取り消し）',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -20_000 },
      { accountId: 'purchases', label: '仕入', category: '費用', delta: -20_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 20_000 },
      { side: 'credit', accountId: 'purchases', label: '仕入', amount: 20_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '仕入が減った → 費用の減少は貸方',
      '返品は「仕入時の逆仕訳」',
    ],
    statementImpact: { pl: 'PL：仕入 −2万', bs: 'BS：買掛金 −2万' },
  },

  {
    id: 'd4e03',
    no: 3,
    label: 'EVENT 03',
    scene: '仕入諸掛り（引取運賃）',
    narrative:
      '仕入れた豆を店まで運ぶ引取運賃 3,000円を、当社負担で現金で支払いました。',
    quiz: {
      question: '仕入時の運賃を当社が負担したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増えた（運賃も商品の原価に含める）' },
        { id: 'b', label: '発送費（費用）が増えた' },
        { id: 'c', label: '立替金が増えた' },
        { id: 'd', label: '買掛金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '仕入に付随する運賃（仕入諸掛り）は、商品の原価の一部として「仕入」に含めます。現金が 3,000円減ります。',
      wrongFeedback:
        '「発送費」は売る側の送料。仕入側の運賃（引取運賃）は仕入原価に含めるので「仕入」を増やします。',
    },
    plainSummary: '仕入れた商品の運賃を、仕入の原価に足した',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 3_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -3_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 3_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 3_000 },
    ],
    why: [
      '仕入が増えた → 費用の増加は借方（仕入諸掛りは仕入に含める）',
      '現金が減った → 資産の減少は貸方',
      '売る側の送料「発送費」と混同しない',
    ],
    statementImpact: { pl: 'PL：仕入 ＋3千（諸掛り込み）', bs: 'BS：現金 −3千' },
  },

  {
    id: 'd4e04',
    no: 4,
    label: 'EVENT 04',
    scene: '売上（掛け）',
    narrative: 'オフィスへ 150,000円分を掛けで販売しました。',
    quiz: {
      question: '掛けで売り上げたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が増え、売上が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '前受金が増えた' },
        { id: 'd', label: '買掛金が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '後で受け取る約束なので、売掛金（資産）と売上（収益）が増えます。',
      wrongFeedback: '掛けなのでまだ現金は入りません。売掛金という資産で受け取ります。',
    },
    plainSummary: '商品を先に渡し、代金は後でもらうことにした',
    changes: [
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 150_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 150_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 150_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 150_000 },
    ],
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋15万', bs: 'BS：売掛金 ＋15万' },
  },

  {
    id: 'd4e05',
    no: 5,
    label: 'EVENT 05',
    scene: '売上戻り（返品）',
    narrative:
      '納品した商品のうち 30,000円分が「注文と違う」と返品されてきました（掛け代金から差し引き）。',
    quiz: {
      question: '売った商品が返品されたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売上（収益）が減り、売掛金（もらう権利）も減った' },
        { id: 'b', label: '仕入が減った' },
        { id: 'c', label: '現金が減った' },
        { id: 'd', label: '買掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '返された分は「売らなかったこと」にします。売上（収益）を減らし、その分の売掛金（資産）も減らします。売上時の逆仕訳です。',
      wrongFeedback:
        '返品は売上の取り消し。売上（収益）を減らし、もらう権利（売掛金）も減らします。',
    },
    plainSummary: '売った商品の一部が返ってきた（売上の取り消し）',
    changes: [
      { accountId: 'sales', label: '売上', category: '収益', delta: -30_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'sales', label: '売上', amount: 30_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 30_000 },
    ],
    why: [
      '売上が減った → 収益の減少は借方',
      '売掛金が減った → 資産の減少は貸方',
      '返品は「売上時の逆仕訳」',
    ],
    statementImpact: { pl: 'PL：売上 −3万', bs: 'BS：売掛金 −3万' },
  },

  {
    id: 'd4e06',
    no: 6,
    label: 'EVENT 06',
    scene: '仕入値引き',
    narrative:
      '先に掛けで仕入れた商品に小さなキズがあり、仕入先が代金を 5,000円値引きしてくれました。',
    quiz: {
      question: '品質不良で仕入代金を安くしてもらったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金が減り、仕入（費用）も減った（返品と同じ形）' },
        { id: 'b', label: '仕入（費用）が増えた' },
        { id: 'c', label: '雑収入（収益）が増えた' },
        { id: 'd', label: '現金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '値引きは「その分だけ仕入がなかったこと」にします。返品とまったく同じで、買掛金と仕入を減らします。',
      wrongFeedback:
        '値引きは収益ではありません。返品と同じく、仕入（費用）と買掛金（負債）を減らします。',
    },
    plainSummary: '仕入代金を一部まけてもらった（仕入を減らす）',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -5_000 },
      { accountId: 'purchases', label: '仕入', category: '費用', delta: -5_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 5_000 },
      { side: 'credit', accountId: 'purchases', label: '仕入', amount: 5_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '仕入が減った → 費用の減少は貸方',
      '返品も値引きも「仕入を減らす」処理は同じ',
    ],
    statementImpact: { pl: 'PL：仕入 −5千', bs: 'BS：買掛金 −5千' },
  },

  {
    id: 'd4e07',
    no: 7,
    label: 'EVENT 07',
    scene: '売上諸掛り（発送費・当社負担）',
    narrative:
      '遠方のお客さまへ商品を発送し、宅配便代 2,000円を当社負担で現金で支払いました。',
    quiz: {
      question: '商品を送る宅配便代を当社が負担したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '発送費（費用）が増えた' },
        { id: 'b', label: '仕入（費用）が増えた' },
        { id: 'c', label: '立替金が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '売る側が負担する送料は「発送費」という費用です。仕入側の運賃を「仕入」に含めるのと対になる考え方です。',
      wrongFeedback:
        '仕入の運賃は「仕入」に含めますが、売る側の送料（当社負担）は「発送費」という費用にします。',
    },
    plainSummary: '商品を送る送料を、当社の費用として払った',
    changes: [
      { accountId: 'freightExpense', label: '発送費', category: '費用', delta: 2_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -2_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'freightExpense', label: '発送費', amount: 2_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 2_000 },
    ],
    why: [
      '発送費が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '仕入諸掛り＝仕入に含める／売上諸掛り（当社負担）＝発送費',
    ],
    statementImpact: { pl: 'PL：発送費 ＋2千', bs: 'BS：現金 −2千' },
  },

  {
    id: 'd4e08',
    no: 8,
    label: 'EVENT 08',
    scene: '送料の立替（先方負担）',
    narrative:
      '別のお客さまへ発送。送料 2,500円は先方負担ですが、いったん当社が現金で立替払いしました。',
    quiz: {
      question: '先方が負担すべき送料を当社が立て替えたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '立替金（あとで回収する権利）が増えた' },
        { id: 'b', label: '発送費（費用）が増えた' },
        { id: 'c', label: '売上が増えた' },
        { id: 'd', label: '仕入が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '先方負担ぶんは当社の費用ではありません。あとで回収するので立替金（資産）で処理します（売掛金に含める方法もあります）。',
      wrongFeedback:
        '当社負担なら発送費（費用）ですが、先方負担なので「立替金」（あとで回収する資産）です。',
    },
    plainSummary: 'お客さま負担の送料を、当社が立て替えて払った',
    changes: [
      { accountId: 'advancesPaid', label: '立替金', category: '資産', delta: 2_500 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -2_500 },
    ],
    journal: [
      { side: 'debit', accountId: 'advancesPaid', label: '立替金', amount: 2_500 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 2_500 },
    ],
    why: [
      '立替金が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '先方負担の諸掛りは費用にしない（立替金 or 売掛金）',
    ],
    statementImpact: { bs: 'BS：現金 −2.5千、立替金 ＋2.5千' },
  },

  {
    id: 'd4e09',
    no: 9,
    label: 'EVENT 09',
    scene: '立替金の回収',
    narrative: '立て替えた送料 2,500円を、お客さまから現金で受け取りました。',
    quiz: {
      question: '立替金を回収したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、立替金（回収する権利）が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '発送費が減った' },
        { id: 'd', label: '前受金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '立替時に費用にしていないので、回収しても収益は出ません。立替金（資産）が現金（資産）に変わるだけです。',
      wrongFeedback:
        '回収は売上ではありません。立替金（資産）が現金（資産）に変わるだけです。',
    },
    plainSummary: '立て替えていたお金が、現金として戻ってきた',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 2_500 },
      { accountId: 'advancesPaid', label: '立替金', category: '資産', delta: -2_500 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 2_500 },
      { side: 'credit', accountId: 'advancesPaid', label: '立替金', amount: 2_500 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '立替金が減った → 資産の減少は貸方',
      '立替金の回収は資産どうしの振替',
    ],
    statementImpact: { bs: 'BS：現金 ＋2.5千、立替金 −2.5千' },
  },

  {
    id: 'd4e10',
    no: 10,
    label: 'EVENT 10',
    scene: 'クレジット売上',
    narrative:
      '店頭でクレジットカード決済の売上 80,000円。カード会社への手数料は代金の 4%（3,200円）で、差し引かれます。',
    quiz: {
      question: 'クレジットカードで売ったとき、会社の中では何が起きた？',
      options: [
        {
          id: 'a',
          label: '売上は満額 80,000円。手数料 3,200円は支払手数料（費用）、残り 76,800円はクレジット売掛金（資産）',
        },
        { id: 'b', label: '売上は 76,800円だけ' },
        { id: 'c', label: '現金が 80,000円増えた' },
        { id: 'd', label: '売掛金が 80,000円増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上はお客さまが払った満額の 80,000円。カード会社の手数料 3,200円は「支払手数料」。あとでカード会社から受け取る 76,800円は「クレジット売掛金」（通常の売掛金とは相手が違う）。',
      wrongFeedback:
        '売上は値引き前の満額 80,000円。手数料は支払手数料（費用）、カード会社から受け取る分はクレジット売掛金（資産）に分けます。',
    },
    plainSummary: 'カード決済で売った。手数料を引かれ、残りはカード会社から後日入金',
    changes: [
      { accountId: 'creditAr', label: 'クレジット売掛金', category: '資産', delta: 76_800 },
      { accountId: 'feeExpense', label: '支払手数料', category: '費用', delta: 3_200 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'creditAr', label: 'クレジット売掛金', amount: 76_800 },
      { side: 'debit', accountId: 'feeExpense', label: '支払手数料', amount: 3_200 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 80_000 },
    ],
    why: [
      'クレジット売掛金が増えた → 資産の増加は借方',
      '支払手数料が増えた → 費用の増加は借方',
      '売上が増えた → 収益の増加は貸方（お客さまが払った満額）',
      '借方2つ（76,800＋3,200）＝ 貸方 80,000',
    ],
    statementImpact: {
      pl: 'PL：売上 ＋8万、支払手数料 ＋3,200',
      bs: 'BS：クレジット売掛金 ＋76,800',
    },
  },

  {
    id: 'd4e11',
    no: 11,
    label: 'EVENT 11',
    scene: 'クレジット売掛金の入金',
    narrative: 'カード会社から、クレジット売掛金 76,800円が普通預金に入金されました。',
    quiz: {
      question: 'クレジット売掛金が入金されたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、クレジット売掛金（受け取る権利）が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '支払手数料が増えた' },
        { id: 'd', label: '売掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上も手数料もクレジット売上のとき計上済み。入金では「権利（クレジット売掛金）」が「お金（普通預金）」に変わるだけです。',
      wrongFeedback:
        '入金時に売上は増えません。クレジット売掛金（資産）が普通預金（資産）に変わります。',
    },
    plainSummary: 'カード会社から、売った代金（手数料差引後）が入金された',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 76_800 },
      { accountId: 'creditAr', label: 'クレジット売掛金', category: '資産', delta: -76_800 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 76_800 },
      { side: 'credit', accountId: 'creditAr', label: 'クレジット売掛金', amount: 76_800 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      'クレジット売掛金が減った → 資産の減少は貸方',
      '入金は資産どうしの振替',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋76,800、クレジット売掛金 −76,800' },
  },

  {
    id: 'd4e12',
    no: 12,
    label: 'EVENT 12',
    scene: '受取商品券',
    narrative:
      '商店街の共通商品券で、15,000円の売上を受け取りました。',
    quiz: {
      question: '商品券で代金を受け取ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '受取商品券（あとで換金できる権利）が増え、売上が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '前受金が増えた' },
        { id: 'd', label: '売上は計上しない' },
      ],
      correctId: 'a',
      correctFeedback:
        '商品は渡したので売上は計上します。受け取ったのは現金ではなく、あとで換金できる「受取商品券」という資産です。',
      wrongFeedback:
        '商品券は現金ではありませんが、あとで換金できる資産（受取商品券）。売上はふつうに計上します。',
    },
    plainSummary: '商品を売り、代金を商品券で受け取った',
    changes: [
      { accountId: 'giftCertReceivable', label: '受取商品券', category: '資産', delta: 15_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 15_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'giftCertReceivable', label: '受取商品券', amount: 15_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 15_000 },
    ],
    why: [
      '受取商品券が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      '受取商品券は「あとで換金できる」資産',
    ],
    statementImpact: { pl: 'PL：売上 ＋1.5万', bs: 'BS：受取商品券 ＋1.5万' },
  },

  {
    id: 'd4e13',
    no: 13,
    label: 'EVENT 13',
    scene: '受取商品券の精算',
    narrative:
      '受け取った商品券 15,000円を発行元に渡し、現金 15,000円を受け取りました。',
    quiz: {
      question: '商品券を換金したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、受取商品券（換金する権利）が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '受取利息が増えた' },
        { id: 'd', label: '前受金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上は商品券を受け取ったとき計上済み。換金では「商品券（権利）」が「現金」に変わるだけです。',
      wrongFeedback:
        '換金は売上ではありません。受取商品券（資産）が現金（資産）に変わります。',
    },
    plainSummary: '持っていた商品券を、現金に換えた',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 15_000 },
      { accountId: 'giftCertReceivable', label: '受取商品券', category: '資産', delta: -15_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 15_000 },
      { side: 'credit', accountId: 'giftCertReceivable', label: '受取商品券', amount: 15_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '受取商品券が減った → 資産の減少は貸方',
      '換金は資産どうしの振替（売上は計上しない）',
    ],
    statementImpact: { bs: 'BS：現金 ＋1.5万、受取商品券 −1.5万' },
  },

  {
    id: 'd4e14',
    no: 14,
    label: 'EVENT 14',
    scene: '買掛金の支払い',
    narrative:
      'この日の仕入の買掛金の残り 95,000円を、普通預金から支払いました。',
    quiz: {
      question: '買掛金を支払ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金（払う義務）が減り、普通預金が減った' },
        { id: 'b', label: '仕入（費用）が増えた' },
        { id: 'c', label: '売上が減った' },
        { id: 'd', label: '現金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '仕入の費用は仕入れたとき計上済み。支払いでは買掛金（負債）が減り、普通預金（資産）が減るだけです。',
      wrongFeedback:
        '支払時に費用は増えません。買掛金（負債）と普通預金（資産）が同額減ります。',
    },
    plainSummary: '後払いにしていた仕入代金を、口座から払った',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -95_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -95_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 95_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 95_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '普通預金が減った → 資産の減少は貸方',
      '支払時に費用は発生しない（計上済み）',
    ],
    statementImpact: { bs: 'BS：買掛金 −9.5万、普通預金 −9.5万' },
  },
];

export const DAY4: DayDef = {
  day: 4,
  title: '商品売買のこまかい処理',
  subtitle: '返品・値引き・送料・クレジット・商品券。売り買いにくっつく取引を整理します。',
  focus: ['返品（戻し・戻り）', '仕入・売上の諸掛り', 'クレジット売掛金', '受取商品券'],
  events: EVENTS,
  recap: [
    '返品・値引きは「仕入／売上を減らす」。仕入戻しは 買掛金／仕入、売上戻りは 売上／売掛金',
    '仕入の運賃は「仕入」に含める。売る側の送料（当社負担）は「発送費」',
    'クレジット売上は、売上は満額・手数料は支払手数料・残りはクレジット売掛金',
    '商品券で受け取っても売上は計上し、受取商品券（資産）としてあとで換金する',
  ],
};
