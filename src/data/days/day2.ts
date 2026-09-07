import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 2 — お金の“形”が変わる取引。
 * 普通預金 / 前払金・前受金 / 貸付金・利息 / 手形。
 * 各仕訳は貸借一致で組んであるので、累計 BS は自動的に釣り合う。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd2e01',
    no: 1,
    label: 'EVENT 01',
    scene: '普通預金へ預入',
    narrative:
      '手元の現金 50万円を、盗難や紛失を防ぐために銀行の普通預金口座に預け入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、普通預金という別の資産が増えた' },
        { id: 'b', label: '費用が増えた' },
        { id: 'c', label: '売上が減った' },
        { id: 'd', label: '借入金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '現金も普通預金も「会社のお金」。置き場所が変わっただけで、資産の中での振替です。',
      wrongFeedback:
        'お金の置き場所を現金から銀行口座に移しただけ。損得（費用・収益）は発生していません。',
    },
    plainSummary: '現金を、銀行口座（普通預金）に移した',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 500_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -500_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 500_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 500_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '現金も預金も同じ「お金」（資産）。中身が入れ替わっただけ',
    ],
    statementImpact: { bs: 'BS：現金 −50万、普通預金 ＋50万（資産内で振替）' },
  },

  {
    id: 'd2e02',
    no: 2,
    label: 'EVENT 02',
    scene: '売掛金の回収',
    narrative:
      '前日にオフィスへ掛けで売った代金 12万円が、普通預金に振り込まれました。',
    quiz: {
      question: '売掛金が入金されたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、売掛金（もらう権利）が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '前受金が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上は掛けで売ったとき計上済み。入金時は「権利（売掛金）」が「お金（普通預金）」に変わるだけです。',
      wrongFeedback:
        '入金の時点では売上は増えません。売掛金という資産が、普通預金という資産に変わります。',
    },
    plainSummary: 'あとでもらう権利（売掛金）が、預金として入ってきた',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 120_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 120_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 120_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
      '入金時に売上は計上しない（売ったときに計上済み）',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋12万、売掛金 −12万' },
  },

  {
    id: 'd2e03',
    no: 3,
    label: 'EVENT 03',
    scene: '前払金の支払い',
    narrative:
      '来週入荷するコーヒー豆 6万円分について、代金を先に普通預金から支払いました（内金）。',
    quiz: {
      question: '商品を受け取る前に代金を払ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が減り、前払金（商品を受け取る権利）が増えた' },
        { id: 'b', label: '仕入（費用）がすぐに増えた' },
        { id: 'c', label: '買掛金が増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'まだ商品を受け取っていないので仕入にはなりません。「先に払ったお金」は前払金という資産です。',
      wrongFeedback:
        '仕入（費用）になるのは商品を受け取ったとき。今の段階は前払金という資産で持っている状態です。',
    },
    plainSummary: '商品を受け取る前に、代金だけ先に払った',
    changes: [
      { accountId: 'prepaid', label: '前払金', category: '資産', delta: 60_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -60_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'prepaid', label: '前払金', amount: 60_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 60_000 },
    ],
    why: [
      '前払金が増えた → 資産の増加は借方',
      '普通預金が減った → 資産の減少は貸方',
      '「先払い」は、商品を受け取る権利（資産）',
    ],
    statementImpact: { bs: 'BS：普通預金 −6万、前払金 ＋6万' },
  },

  {
    id: 'd2e04',
    no: 4,
    label: 'EVENT 04',
    scene: '前払した豆が入荷',
    narrative: '先に代金を払っていたコーヒー豆 6万円分が入荷しました。',
    quiz: {
      question: '前払していた商品が届いたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '前払金が減り、仕入（費用）が増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '買掛金が増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '代金はもう払ってあるのでお金は動きません。前払金という権利を使って、ここで仕入が計上されます。',
      wrongFeedback:
        '支払いは前回済んでいます。今回は前払金（資産）が消えて、仕入（費用）に変わります。',
    },
    plainSummary: '先に払ってあった商品を、実際に受け取った',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 60_000 },
      { accountId: 'prepaid', label: '前払金', category: '資産', delta: -60_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 60_000 },
      { side: 'credit', accountId: 'prepaid', label: '前払金', amount: 60_000 },
    ],
    why: [
      '仕入が増えた → 費用の増加は借方',
      '前払金が減った → 資産の減少は貸方',
      '前払金は「商品を受け取ったら仕入に振り替える」',
    ],
    statementImpact: { pl: 'PL：仕入 ＋6万', bs: 'BS：前払金 −6万' },
  },

  {
    id: 'd2e05',
    no: 5,
    label: 'EVENT 05',
    scene: '前受金を受け取る',
    narrative:
      '常連客から「来週の会議用ケータリング（8万円）を予約したい」と、代金 8万円を現金で先に受け取りました。',
    quiz: {
      question: 'サービスを提供する前に代金を受け取ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、前受金（サービスを提供する義務）が増えた' },
        { id: 'b', label: '売上がすぐ増えた' },
        { id: 'c', label: '売掛金が増えた' },
        { id: 'd', label: '借入金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'まだケータリングをしていないので売上にはできません。「先に受け取ったお金」は前受金という負債です。',
      wrongFeedback:
        '売上になるのはサービスを提供したとき。今は前受金（あとで果たす義務＝負債）です。',
    },
    plainSummary: 'サービスを提供する前に、代金だけ先に受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 80_000 },
      { accountId: 'unearned', label: '前受金', category: '負債', delta: 80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 80_000 },
      { side: 'credit', accountId: 'unearned', label: '前受金', amount: 80_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '前受金が増えた → 負債の増加は貸方',
      '「先に受け取ったお金」は、あとで果たす義務（負債）',
    ],
    statementImpact: { bs: 'BS：現金 ＋8万、前受金（負債）＋8万' },
  },

  {
    id: 'd2e06',
    no: 6,
    label: 'EVENT 06',
    scene: 'サービスを提供',
    narrative: '予約されていた会議用ケータリングを実施しました。',
    quiz: {
      question: '前受金をもらっていたサービスを提供したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '前受金（義務）が減り、売上（収益）が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '現金が減った' },
        { id: 'd', label: '費用が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '代金は先にもらってあるのでお金は動きません。義務（前受金）を果たしたので、ここで売上が立ちます。',
      wrongFeedback:
        '入金は前回済み。今回は前受金（負債）が減り、売上（収益）に変わります。',
    },
    plainSummary: '代金を先にもらっていたサービスを、実際に提供した',
    changes: [
      { accountId: 'unearned', label: '前受金', category: '負債', delta: -80_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'unearned', label: '前受金', amount: 80_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 80_000 },
    ],
    why: [
      '前受金が減った → 負債の減少は借方',
      '売上が増えた → 収益の増加は貸方',
      '前受金は「提供したら売上に振り替える」',
    ],
    statementImpact: { pl: 'PL：売上 ＋8万', bs: 'BS：前受金 −8万' },
  },

  {
    id: 'd2e07',
    no: 7,
    label: 'EVENT 07',
    scene: 'お金を貸す',
    narrative:
      '取引先から頼まれ、借用証書を受け取って現金 20万円を貸し付けました。',
    quiz: {
      question: 'お金を貸したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が減り、貸付金（返してもらう権利）が増えた' },
        { id: 'b', label: '費用が増えた' },
        { id: 'c', label: '借入金が増えた' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '貸したお金は返ってくるので費用ではありません。「返してもらう権利」は貸付金という資産です。',
      wrongFeedback:
        '貸付金は返済される予定のお金。使い切る費用ではなく、資産（貸付金）として持っています。',
    },
    plainSummary: '現金を貸して、返してもらう権利（貸付金）を得た',
    changes: [
      { accountId: 'loansReceivable', label: '貸付金', category: '資産', delta: 200_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -200_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'loansReceivable', label: '貸付金', amount: 200_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 200_000 },
    ],
    why: [
      '貸付金が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '借りた側は「借入金（負債）」、貸した側は「貸付金（資産）」',
    ],
    statementImpact: { bs: 'BS：現金 −20万、貸付金 ＋20万' },
  },

  {
    id: 'd2e08',
    no: 8,
    label: 'EVENT 08',
    scene: '利息を受け取る',
    narrative: '貸付金の利息 4,000円を現金で受け取りました。',
    quiz: {
      question: '貸したお金の利息を受け取ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、受取利息（収益）が増えた' },
        { id: 'b', label: '貸付金が増えた' },
        { id: 'c', label: '売上が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '利息は商品の売上ではありませんが、お金を貸したことで得た収益なので「受取利息」で計上します。',
      wrongFeedback:
        '利息は貸付金の元本とは別のもうけ。受け取った利息は「受取利息」という収益です。',
    },
    plainSummary: '貸したお金の利息を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 4_000 },
      { accountId: 'interestIncome', label: '受取利息', category: '収益', delta: 4_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 4_000 },
      { side: 'credit', accountId: 'interestIncome', label: '受取利息', amount: 4_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '受取利息が増えた → 収益の増加は貸方',
      '利息のもうけは「受取利息」（売上とは分ける）',
    ],
    statementImpact: { pl: 'PL：受取利息 ＋4千（収益）', bs: 'BS：現金 ＋4千' },
  },

  {
    id: 'd2e09',
    no: 9,
    label: 'EVENT 09',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆 5万円を掛けで仕入れました。',
    quiz: {
      question: '掛けで仕入れたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金（払う義務）が増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '支払手形が増えた' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'いつもの掛け仕入です。仕入（費用）が増え、あとで払う義務（買掛金）が増えます。',
      wrongFeedback:
        '掛け（口約束の後払い）なので現金は動きません。買掛金という負債が増えます。',
    },
    plainSummary: '商品を先に受け取り、代金は後で払うことにした（掛け）',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 50_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 50_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 50_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 50_000 },
    ],
    why: [
      '仕入が増えた → 費用の増加は借方',
      '買掛金が増えた → 負債の増加は貸方',
    ],
    statementImpact: { pl: 'PL：仕入 ＋5万', bs: 'BS：買掛金 ＋5万' },
  },

  {
    id: 'd2e10',
    no: 10,
    label: 'EVENT 10',
    scene: '約束手形を振り出す',
    narrative:
      '上の買掛金 5万円の支払いにあてるため、約束手形（支払期日つきの支払約束の証券）を振り出して渡しました。',
    quiz: {
      question: '買掛金の支払いのために約束手形を振り出したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金が減り、支払手形（手形で払う義務）が増えた' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '費用が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '支払いの中身が「口約束（買掛金）」から「証券による約束（支払手形）」に変わっただけ。どちらも負債です。',
      wrongFeedback:
        'まだ現金は払っていません。買掛金という負債が、支払手形という別の負債に振り替わります。',
    },
    plainSummary: '買掛金の支払いを、約束手形（証券）でする約束に切り替えた',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -50_000 },
      { accountId: 'notesPayable', label: '支払手形', category: '負債', delta: 50_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 50_000 },
      { side: 'credit', accountId: 'notesPayable', label: '支払手形', amount: 50_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '支払手形が増えた → 負債の増加は貸方',
      '手形は「書面での支払約束」。買掛金より強い債務',
    ],
    statementImpact: { bs: 'BS：買掛金 −5万、支払手形 ＋5万' },
  },

  {
    id: 'd2e11',
    no: 11,
    label: 'EVENT 11',
    scene: '売上（手形で受取）',
    narrative:
      '得意先へ商品 9万円を売り上げ、代金は先方が振り出した約束手形で受け取りました。',
    quiz: {
      question: '売上代金を約束手形で受け取ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '受取手形（手形でお金を受け取る権利）が増え、売上が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '売掛金が増えた' },
        { id: 'd', label: '買掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '現金でも売掛金でもなく、「手形でお金を受け取る権利」＝受取手形という資産で受け取りました。',
      wrongFeedback:
        '受け取ったのは現金ではなく手形。売掛金より確実な「受取手形」という資産になります。',
    },
    plainSummary: '商品を売り、代金を約束手形（証券）で受け取った',
    changes: [
      { accountId: 'notesReceivable', label: '受取手形', category: '資産', delta: 90_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 90_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'notesReceivable', label: '受取手形', amount: 90_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 90_000 },
    ],
    why: [
      '受取手形が増えた → 資産の増加は借方',
      '売上が増えた → 収益の増加は貸方',
      '受取手形は「期日にお金を受け取れる証券」',
    ],
    statementImpact: { pl: 'PL：売上 ＋9万', bs: 'BS：受取手形 ＋9万' },
  },

  {
    id: 'd2e12',
    no: 12,
    label: 'EVENT 12',
    scene: '手形が満期入金',
    narrative:
      '保有していた受取手形 9万円が満期をむかえ、普通預金に入金されました。',
    quiz: {
      question: '受取手形が満期で入金されたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、受取手形（受け取る権利）が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '受取利息が増えた' },
        { id: 'd', label: '前受金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '売上は手形を受け取ったとき計上済み。満期入金では「手形（権利）」が「預金（お金）」に変わるだけです。',
      wrongFeedback:
        '入金時に売上は増えません。受取手形という資産が、普通預金という資産に変わります。',
    },
    plainSummary: '持っていた手形が期日になり、預金としてお金が入ってきた',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 90_000 },
      { accountId: 'notesReceivable', label: '受取手形', category: '資産', delta: -90_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 90_000 },
      { side: 'credit', accountId: 'notesReceivable', label: '受取手形', amount: 90_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '受取手形が減った → 資産の減少は貸方',
      '満期入金は、資産どうしの振替（売上は計上しない）',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋9万、受取手形 −9万' },
  },

  {
    id: 'd2e13',
    no: 13,
    label: 'EVENT 13',
    scene: '借入金の返済＋利息',
    narrative:
      '銀行からの借入金のうち 10万円を、利息 3,000円とあわせて普通預金から返済しました。',
    quiz: {
      question: '借入金を利息とともに返したとき、会社の中では何が起きた？',
      options: [
        {
          id: 'a',
          label: '借入金（負債）が減り、支払利息（費用）が発生し、普通預金が減った',
        },
        { id: 'b', label: '借入金だけが減った' },
        { id: 'c', label: '支払利息は資産になる' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '元本 10万円は借入金（負債）の減少、利息 3,000円は支払利息（費用）。合計 103,000円が普通預金から出ていきます。',
      wrongFeedback:
        '返済額のうち元本は負債の減少、利息は費用（支払利息）です。両方を分けて記録します。',
    },
    plainSummary: '借金の一部を、利息をつけて返した',
    changes: [
      { accountId: 'loan', label: '借入金', category: '負債', delta: -100_000 },
      { accountId: 'interestExpense', label: '支払利息', category: '費用', delta: 3_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -103_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'loan', label: '借入金', amount: 100_000 },
      { side: 'debit', accountId: 'interestExpense', label: '支払利息', amount: 3_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 103_000 },
    ],
    why: [
      '借入金が減った → 負債の減少は借方',
      '支払利息が増えた → 費用の増加は借方',
      '普通預金が減った → 資産の減少は貸方',
      '借方が2つでも、貸方との合計は一致する',
    ],
    statementImpact: { pl: 'PL：支払利息 ＋3千', bs: 'BS：借入金 −10万、普通預金 −10.3万' },
  },
];

export const DAY2: DayDef = {
  day: 2,
  title: 'お金の置き場所と、貸し借り',
  subtitle: '現金・預金・手形・前払い…お金の“形”が変わる取引を扱います。',
  focus: ['普通預金', '前払金・前受金', '手形', '貸付金・利息'],
  events: EVENTS,
  recap: [
    '現金・普通預金・受取手形は、置き場所や形がちがうだけで、どれも「会社のお金・権利」',
    '前払金／前受金は「お金が先、モノ・サービスが後」のときの一時的な資産・負債',
    '貸したら貸付金（資産）、借りたら借入金（負債）。もうけ／コストは受取利息・支払利息',
    '返済額は「元本（負債の減少）」と「利息（費用）」に分ける',
  ],
};
