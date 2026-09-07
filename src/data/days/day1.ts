import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 1 — カフェ「MY CAFE」開業初日。
 *
 * 13 の商売イベントで「会社を始める / 商売 / 掛け取引 / 経費 / 設備 / 借入」を体験する。
 * 金額は決算がきれいに合うように設計:
 *   資産 1,400,000 ＝ 負債 300,000 ＋ 資本金 1,000,000 ＋ 利益 100,000
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd1e01',
    no: 1,
    label: 'EVENT 01',
    scene: '開業',
    narrative:
      'あなたは今日からカフェ「MY CAFE」のオーナーです。事業を始めるために、自己資金 100万円を会社の口座に入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '売上が増えた' },
        { id: 'd', label: '費用が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'そのとおり。会社に現金 100万円が入りました。しかもこの 100万円は、あなたが出資したお金＝資本金です。',
      wrongFeedback:
        'お金を「会社に入れた」ので会社の現金は増えます。これは商売の成果（売上）ではなく、オーナーからの出資です。',
    },
    plainSummary: '会社にお金が入った（オーナーが出資した）',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 1_000_000 },
      { accountId: 'capital', label: '資本金', category: '純資産', delta: 1_000_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 1_000_000 },
      { side: 'credit', accountId: 'capital', label: '資本金', amount: 1_000_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方（左）',
      '資本金が増えた → 純資産の増加は貸方（右）',
      '「そのお金は誰のものか」を示すのが資本金',
    ],
    statementImpact: { bs: 'BS：資産（現金）＋100万、純資産（資本金）＋100万' },
  },

  {
    id: 'd1e02',
    no: 2,
    label: 'EVENT 02',
    scene: '店舗を借りる',
    narrative:
      '店舗を借りるため、大家さんに敷金 20万円を現金で預けました。これは解約するときに返ってくるお金です。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、あとで返ってくる権利（資産）が増えた' },
        { id: 'b', label: '費用が 20万円増えた' },
        { id: 'c', label: '売上が減った' },
        { id: 'd', label: '借入金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '敷金は「返ってくるお金」なので費用ではありません。現金が、差入保証金という別の資産に変わっただけです。',
      wrongFeedback:
        '敷金は将来返ってくるお金。使い切る費用ではなく、資産（差入保証金）として持っている状態になります。',
    },
    plainSummary: '現金が、あとで返ってくる権利（差入保証金）に変わった',
    changes: [
      { accountId: 'deposits', label: '差入保証金', category: '資産', delta: 200_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -200_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'deposits', label: '差入保証金', amount: 200_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 200_000 },
    ],
    why: [
      '差入保証金が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '資産の中身が入れ替わっただけ。費用は発生していない',
    ],
    statementImpact: { bs: 'BS：現金 −20万、差入保証金 ＋20万（資産の中で振替）' },
  },

  {
    id: 'd1e03',
    no: 3,
    label: 'EVENT 03',
    scene: '仕入（現金）',
    narrative: 'コーヒー豆を現金 3万円で仕入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、仕入（費用）が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '売上が増えた' },
        { id: 'd', label: '資本金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '商品を仕入れると「仕入」という費用が発生し、その分だけ現金が減ります。',
      wrongFeedback:
        '豆を買うためにお金を払ったので現金は減少。買った金額は「仕入」という費用になります。',
    },
    plainSummary: '現金を払って商品（コーヒー豆）を仕入れた',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 30_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 30_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 30_000 },
    ],
    why: [
      '仕入が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '3級では仕入を「費用」として扱う（三分法）',
    ],
    statementImpact: { pl: 'PL：仕入 ＋3万（費用の増加）', bs: 'BS：現金 −3万' },
  },

  {
    id: 'd1e04',
    no: 4,
    label: 'EVENT 04',
    scene: '売上（現金）',
    narrative: '開店初日。コーヒーやフードが売れて、現金 12万円を受け取りました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上（収益）が増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '費用が増えた' },
        { id: 'd', label: '借入金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '商品を売ってお金を受け取ったので、現金が増え、同じ額の売上（収益）が立ちます。',
      wrongFeedback:
        'お客さんからお金を受け取ったので現金は増加。商売の成果なので「売上」という収益になります。',
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
      '収益はいつも貸方（右）に増える',
    ],
    statementImpact: { pl: 'PL：売上 ＋12万（収益の増加）', bs: 'BS：現金 ＋12万' },
  },

  {
    id: 'd1e05',
    no: 5,
    label: 'EVENT 05',
    scene: '仕入（掛け）',
    narrative:
      '週末に備えて、コーヒー豆を 8万円分仕入れました。代金は「今度まとめて払う」約束（掛け）にしました。',
    quiz: {
      question: '代金を後払いにしたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金（あとで払う義務）が増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '売掛金が増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'まだ払っていないので現金は動きません。代わりに「あとで払う義務」＝買掛金が増えます。',
      wrongFeedback:
        '掛け（後払い）なので現金は減りません。支払う義務が、買掛金という負債として増えます。',
    },
    plainSummary: '商品を先に受け取り、代金は後で払うことにした',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 80_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 80_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 80_000 },
    ],
    why: [
      '仕入が増えた → 費用の増加は借方',
      '買掛金が増えた → 負債の増加は貸方',
      '買掛金＝まだ払っていない仕入代金',
    ],
    statementImpact: { pl: 'PL：仕入 ＋8万', bs: 'BS：買掛金（負債）＋8万' },
  },

  {
    id: 'd1e06',
    no: 6,
    label: 'EVENT 06',
    scene: '売上（掛け）',
    narrative:
      '近くのオフィスから「会議用にコーヒーを大量に」と注文が入り、18万円分を納品しました。代金は月末にまとめて振り込まれます。',
    quiz: {
      question: '代金を後で受け取る約束で売ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売上（収益）が増え、売掛金（あとでもらう権利）が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '買掛金が増えた' },
        { id: 'd', label: '費用が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'まだ入金されていなくても、売った時点で売上は立ちます。受け取る権利は売掛金という資産です。',
      wrongFeedback:
        'まだ現金は受け取っていません。でも商品は渡したので売上を計上し、代金は売掛金（資産）になります。',
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
    why: [
      '売掛金が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      '売掛金＝まだ受け取っていない売上代金',
      '「売上＝現金」ではない、がポイント',
    ],
    statementImpact: { pl: 'PL：売上 ＋18万', bs: 'BS：売掛金（資産）＋18万' },
  },

  {
    id: 'd1e07',
    no: 7,
    label: 'EVENT 07',
    scene: '家賃',
    narrative: '店舗の 1か月分の家賃 5万円を現金で支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、支払家賃（費用）が増えた' },
        { id: 'b', label: '差入保証金が増えた' },
        { id: 'c', label: '売上が減った' },
        { id: 'd', label: '資本金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '家賃は返ってこないお金なので費用です。返ってくる敷金（差入保証金）とは区別します。',
      wrongFeedback:
        '毎月払う家賃は使い切る費用。将来返還される敷金（差入保証金）とは性質が違います。',
    },
    plainSummary: '今月の家賃を現金で払った',
    changes: [
      { accountId: 'rent', label: '支払家賃', category: '費用', delta: 50_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -50_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'rent', label: '支払家賃', amount: 50_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 50_000 },
    ],
    why: ['支払家賃が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：支払家賃 ＋5万', bs: 'BS：現金 −5万' },
  },

  {
    id: 'd1e08',
    no: 8,
    label: 'EVENT 08',
    scene: '給料',
    narrative: 'アルバイトさんに、今日までの給料 3万円を現金で支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、給料（費用）が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '買掛金が増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '人件費も費用です。現金が 3万円減り、給料が 3万円増えます。',
      wrongFeedback:
        '給料の支払いで現金は減少。人に払った労働の対価は「給料」という費用です。',
    },
    plainSummary: 'アルバイトに給料を現金で払った',
    changes: [
      { accountId: 'salary', label: '給料', category: '費用', delta: 30_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'salary', label: '給料', amount: 30_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 30_000 },
    ],
    why: ['給料が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：給料 ＋3万', bs: 'BS：現金 −3万' },
  },

  {
    id: 'd1e09',
    no: 9,
    label: 'EVENT 09',
    scene: '水道光熱費',
    narrative: '電気・ガス・水道の料金 1万円を現金で支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、水道光熱費（費用）が増えた' },
        { id: 'b', label: '備品が増えた' },
        { id: 'c', label: '売上が減った' },
        { id: 'd', label: '借入金が減った' },
      ],
      correctId: 'a',
      correctFeedback: '光熱費も日々かかる費用です。現金が 1万円減ります。',
      wrongFeedback:
        '毎月かかる電気・ガス・水道代は「水道光熱費」という費用。現金が減ります。',
    },
    plainSummary: '光熱費を現金で払った',
    changes: [
      { accountId: 'utilities', label: '水道光熱費', category: '費用', delta: 10_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -10_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'utilities', label: '水道光熱費', amount: 10_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 10_000 },
    ],
    why: ['水道光熱費が増えた → 費用の増加は借方', '現金が減った → 資産の減少は貸方'],
    statementImpact: { pl: 'PL：水道光熱費 ＋1万', bs: 'BS：現金 −1万' },
  },

  {
    id: 'd1e10',
    no: 10,
    label: 'EVENT 10',
    scene: '設備（備品）',
    narrative:
      '本格的なエスプレッソマシンを 15万円で購入し、現金で支払いました。これから何年も使う道具です。',
    quiz: {
      question: '長く使う道具を買ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、備品（資産）が増えた' },
        { id: 'b', label: '費用が 15万円増えた' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '長く使うものは、その場で全額を費用にせず「備品」という資産にします（使う分だけ少しずつ費用化＝減価償却）。',
      wrongFeedback:
        'すぐ使い切る豆と違い、マシンは何年も使うので資産（備品）。買った年に全額を費用にはしません。',
    },
    plainSummary: '現金を払って、長く使う道具（備品）を手に入れた',
    changes: [
      { accountId: 'equipment', label: '備品', category: '資産', delta: 150_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -150_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'equipment', label: '備品', amount: 150_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 150_000 },
    ],
    why: [
      '備品が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      'すぐ使い切る「仕入」と、長く使う「備品」を区別する',
    ],
    statementImpact: { bs: 'BS：現金 −15万、備品 ＋15万（資産の中で振替）' },
  },

  {
    id: 'd1e11',
    no: 11,
    label: 'EVENT 11',
    scene: 'お金を借りる',
    narrative:
      '仕入や運転資金を厚くするため、銀行から 30万円を借り、現金で受け取りました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、借入金（あとで返す義務）が増えた' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '資本金が増えた' },
        { id: 'd', label: '費用が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '借りたお金は返す必要があるので、売上でも資本金でもなく「借入金」という負債です。',
      wrongFeedback:
        '銀行から入ったお金でも、返す義務があるものは負債（借入金）。商売の成果である売上とは違います。',
    },
    plainSummary: '銀行からお金を借りた（返す義務つき）',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 300_000 },
      { accountId: 'loan', label: '借入金', category: '負債', delta: 300_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 300_000 },
      { side: 'credit', accountId: 'loan', label: '借入金', amount: 300_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '借入金が増えた → 負債の増加は貸方',
      '資本金（返さない）と借入金（返す）の違いに注意',
    ],
    statementImpact: { bs: 'BS：現金 ＋30万、借入金（負債）＋30万' },
  },

  {
    id: 'd1e12',
    no: 12,
    label: 'EVENT 12',
    scene: '買掛金の支払い',
    narrative:
      'EVENT 05 で「掛け」で仕入れたコーヒー豆の代金 8万円を、現金で支払いました。',
    quiz: {
      question: '後払いだった仕入代金を払ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、買掛金（払う義務）が減った' },
        { id: 'b', label: '仕入（費用）が増えた' },
        { id: 'c', label: '売上が減った' },
        { id: 'd', label: '備品が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '仕入の費用は EVENT 05 で計上済み。今回は「義務を果たした」だけなので、費用は増えず買掛金が減ります。',
      wrongFeedback:
        '仕入の費用は掛けで買ったときに計上済み。支払いのときは買掛金（負債）が減るだけです。',
    },
    plainSummary: '後払いにしていた仕入代金を払って、義務がなくなった',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -80_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 80_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 80_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '現金が減った → 資産の減少は貸方',
      '支払時には費用は発生しない（計上済み）',
    ],
    statementImpact: { bs: 'BS：現金 −8万、買掛金 −8万' },
  },

  {
    id: 'd1e13',
    no: 13,
    label: 'EVENT 13',
    scene: '売掛金の回収',
    narrative:
      'オフィスに納品した分の代金のうち、6万円が口座に振り込まれました。',
    quiz: {
      question: '売掛金の一部が入金されたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売掛金（もらう権利）が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '買掛金が減った' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上は EVENT 06 で計上済み。今回は「権利が現金に変わった」だけで、売上は増えません。',
      wrongFeedback:
        '売上は掛けで売ったときに計上済み。入金時は売掛金（資産）が現金（資産）に変わるだけです。',
    },
    plainSummary: 'あとでもらう予定だったお金が、現金として入ってきた',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 60_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -60_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 60_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 60_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
      '入金時に売上は発生しない（計上済み）',
    ],
    statementImpact: { bs: 'BS：現金 ＋6万、売掛金 −6万' },
  },
];

export const DAY1: DayDef = {
  day: 1,
  title: 'カフェをはじめる',
  subtitle: '開業から1日分の商売。会社を始める・仕入・売上・掛け取引・経費・設備・借入。',
  focus: ['資本金', '仕入・売上', '掛け取引', '経費・設備・借入'],
  events: EVENTS,
  recap: [
    '会社の現金が増えた／減った、から仕訳が決まる',
    '売掛金は「まだもらっていない売上」、買掛金は「まだ払っていない仕入」',
    '長く使う道具は費用ではなく資産（備品）',
    '利益は、現金の残高そのものではない',
  ],
};
