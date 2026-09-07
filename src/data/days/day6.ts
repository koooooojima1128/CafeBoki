import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 6 — いろいろな債権・債務。
 * 未収入金・未払金（商品売買以外）/ 手形貸付金・手形借入金 / 当期の貸倒れ。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd6e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: '平日の現金売上が 120,000円ありました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '未収入金が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上。現金（資産）と売上（収益）が増えます。',
      wrongFeedback: 'その場で現金を受け取ったので、現金と売上が増えます。',
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
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋12万', bs: 'BS：現金 ＋12万' },
  },

  {
    id: 'd6e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: 'オフィスへ商品 130,000円分を掛けで販売しました。',
    quiz: {
      question: '商品を掛けで売ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が増え、売上が増えた' },
        { id: 'b', label: '未収入金が増えた' },
        { id: 'c', label: '現金が増えた' },
        { id: 'd', label: '前受金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '「商品」を売った代金の後払いは、売掛金（資産）で受け取ります。',
      wrongFeedback:
        '商品売買の代金あと払いは「売掛金」。商品以外なら「未収入金」です。',
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
    id: 'd6e03',
    no: 3,
    label: 'EVENT 03',
    scene: '備品の売却（代金あと払い）',
    narrative:
      '使わなくなった製氷機（備品・帳簿価額 50,000円）を 50,000円で売却しました。代金は月末に受け取ります。',
    quiz: {
      question: '商品ではない備品を売って、代金を後で受け取るとき、何が起きた？',
      options: [
        { id: 'a', label: '未収入金（あとで受け取る権利）が増え、備品が減った' },
        { id: 'b', label: '売掛金が増え、売上が増えた' },
        { id: 'c', label: '売上が増えた' },
        { id: 'd', label: '仕入が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '商品ではないものを売った代金の後払いは「未収入金」（売掛金ではない）。帳簿価額 50,000円＝売価なので、売却損益は出ません。',
      wrongFeedback:
        '売掛金は「商品」を売ったとき。備品など商品以外は「未収入金」を使います。',
    },
    plainSummary: '商品でない備品を売り、代金は後日受け取ることにした',
    changes: [
      { accountId: 'otherReceivable', label: '未収入金', category: '資産', delta: 50_000 },
      { accountId: 'equipment', label: '備品', category: '資産', delta: -50_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'otherReceivable', label: '未収入金', amount: 50_000 },
      { side: 'credit', accountId: 'equipment', label: '備品', amount: 50_000 },
    ],
    why: [
      '未収入金が増えた → 資産の増加は借方',
      '備品が減った → 資産の減少は貸方',
      '商品の代金あと払い＝売掛金／それ以外＝未収入金',
    ],
    statementImpact: { bs: 'BS：備品 −5万、未収入金 ＋5万' },
  },

  {
    id: 'd6e04',
    no: 4,
    label: 'EVENT 04',
    scene: '未収入金の回収',
    narrative: '製氷機の売却代金 50,000円が普通預金に振り込まれました。',
    quiz: {
      question: '未収入金が入金されたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、未収入金が減った' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '固定資産売却益が増えた' },
        { id: 'd', label: '売掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback: '「受け取る権利（未収入金）」が「お金（普通預金）」に変わっただけです。',
      wrongFeedback: '入金では収益は増えません。資産どうしの振替です。',
    },
    plainSummary: 'あとで受け取る予定だった代金が、預金として入ってきた',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 50_000 },
      { accountId: 'otherReceivable', label: '未収入金', category: '資産', delta: -50_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 50_000 },
      { side: 'credit', accountId: 'otherReceivable', label: '未収入金', amount: 50_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '未収入金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋5万、未収入金 −5万' },
  },

  {
    id: 'd6e05',
    no: 5,
    label: 'EVENT 05',
    scene: '広告費（あと払い）',
    narrative:
      '新聞折込チラシの印刷・配布代 25,000円は、後日支払うことにしました。',
    quiz: {
      question: '商品仕入ではない費用を後払いにしたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '広告宣伝費（費用）が増え、未払金（払う義務）が増えた' },
        { id: 'b', label: '買掛金が増えた' },
        { id: 'c', label: '仕入が増えた' },
        { id: 'd', label: '現金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        'チラシ代は費用（広告宣伝費）。後払いの義務は、商品仕入ではないので「未払金」（買掛金ではない）です。',
      wrongFeedback:
        '買掛金は「商品」を掛けで仕入れたとき。それ以外の後払いは「未払金」です。',
    },
    plainSummary: '広告費を、後払いの約束で使った',
    changes: [
      { accountId: 'advertising', label: '広告宣伝費', category: '費用', delta: 25_000 },
      { accountId: 'otherPayable', label: '未払金', category: '負債', delta: 25_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'advertising', label: '広告宣伝費', amount: 25_000 },
      { side: 'credit', accountId: 'otherPayable', label: '未払金', amount: 25_000 },
    ],
    why: [
      '広告宣伝費が増えた → 費用の増加は借方',
      '未払金が増えた → 負債の増加は貸方',
      '商品仕入の後払い＝買掛金／それ以外＝未払金',
    ],
    statementImpact: { pl: 'PL：広告宣伝費 ＋2.5万', bs: 'BS：未払金 ＋2.5万' },
  },

  {
    id: 'd6e06',
    no: 6,
    label: 'EVENT 06',
    scene: '未払金の支払い',
    narrative: 'チラシ代の未払金 25,000円を現金で支払いました。',
    quiz: {
      question: '未払金を支払ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '未払金（払う義務）が減り、現金が減った' },
        { id: 'b', label: '広告宣伝費（費用）が増えた' },
        { id: 'c', label: '買掛金が減った' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '費用はチラシを使ったとき計上済み。支払いでは未払金（負債）と現金（資産）が減ります。',
      wrongFeedback: '支払時に費用は増えません。未払金と現金が減るだけです。',
    },
    plainSummary: '後払いにしていた広告費を、現金で払った',
    changes: [
      { accountId: 'otherPayable', label: '未払金', category: '負債', delta: -25_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -25_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'otherPayable', label: '未払金', amount: 25_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 25_000 },
    ],
    why: [
      '未払金が減った → 負債の減少は借方',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：未払金 −2.5万、現金 −2.5万' },
  },

  {
    id: 'd6e07',
    no: 7,
    label: 'EVENT 07',
    scene: '手形借入金',
    narrative:
      '運転資金として銀行から 300,000円を借り入れ、約束手形を振り出して当座預金に入金されました。',
    quiz: {
      question: '借入れのために約束手形を振り出したとき、負債は何になる？',
      options: [
        { id: 'a', label: '手形借入金（お金を借りるために振り出した手形）' },
        { id: 'b', label: '支払手形' },
        { id: 'c', label: '買掛金' },
        { id: 'd', label: '前受金' },
      ],
      correctId: 'a',
      correctFeedback:
        '商品代金の支払いのために振り出す「支払手形」と区別して、お金の借入れのために振り出した手形は「手形借入金」で処理します。',
      wrongFeedback:
        '「支払手形」は商品代金の支払い用。借入れのための手形は「手形借入金」です。',
    },
    plainSummary: '手形を振り出してお金を借りた',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 300_000 },
      { accountId: 'notesLoanPayable', label: '手形借入金', category: '負債', delta: 300_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 300_000 },
      { side: 'credit', accountId: 'notesLoanPayable', label: '手形借入金', amount: 300_000 },
    ],
    why: [
      '当座預金が増えた → 資産の増加は借方',
      '手形借入金が増えた → 負債の増加は貸方',
      '営業取引の「支払手形」と、資金取引の「手形借入金」は分ける',
    ],
    statementImpact: { bs: 'BS：当座預金 ＋30万、手形借入金（負債）＋30万' },
  },

  {
    id: 'd6e08',
    no: 8,
    label: 'EVENT 08',
    scene: '手形貸付金',
    narrative:
      '取引先に 150,000円を貸し付け、先方が振り出した約束手形を受け取り、当座預金から支払いました。',
    quiz: {
      question: '手形を受け取ってお金を貸したとき、資産は何になる？',
      options: [
        { id: 'a', label: '手形貸付金（お金を貸して受け取った手形）' },
        { id: 'b', label: '受取手形' },
        { id: 'c', label: '売掛金' },
        { id: 'd', label: '貸倒損失' },
      ],
      correctId: 'a',
      correctFeedback:
        '商品代金として受け取る「受取手形」と区別して、お金を貸して受け取った手形は「手形貸付金」で処理します。',
      wrongFeedback:
        '「受取手形」は商品代金の受取り用。貸付けのための手形は「手形貸付金」です。',
    },
    plainSummary: '手形を受け取って、お金を貸した',
    changes: [
      { accountId: 'notesLoanReceivable', label: '手形貸付金', category: '資産', delta: 150_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -150_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'notesLoanReceivable', label: '手形貸付金', amount: 150_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 150_000 },
    ],
    why: [
      '手形貸付金が増えた → 資産の増加は借方',
      '当座預金が減った → 資産の減少は貸方',
      '営業の「受取手形」と、資金の「手形貸付金」は分ける',
    ],
    statementImpact: { bs: 'BS：当座預金 −15万、手形貸付金 ＋15万' },
  },

  {
    id: 'd6e09',
    no: 9,
    label: 'EVENT 09',
    scene: '手形貸付金の回収＋利息',
    narrative:
      '手形貸付金 150,000円の返済を受け、利息 3,000円とあわせて当座預金に入金されました。',
    quiz: {
      question: '貸付けを利息とともに回収したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '当座預金が増え、手形貸付金が減り、受取利息（収益）が増えた' },
        { id: 'b', label: '手形貸付金だけが減った' },
        { id: 'c', label: '売上が増えた' },
        { id: 'd', label: '支払利息が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '元本 150,000円ぶんは手形貸付金の回収、利息 3,000円は受取利息（収益）。合計 153,000円が当座預金に入ります。',
      wrongFeedback:
        '入金額のうち元本は貸付金の回収、利息は収益（受取利息）です。分けて記録します。',
    },
    plainSummary: '貸したお金が、利息つきで返ってきた',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 153_000 },
      { accountId: 'notesLoanReceivable', label: '手形貸付金', category: '資産', delta: -150_000 },
      { accountId: 'interestIncome', label: '受取利息', category: '収益', delta: 3_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 153_000 },
      { side: 'credit', accountId: 'notesLoanReceivable', label: '手形貸付金', amount: 150_000 },
      { side: 'credit', accountId: 'interestIncome', label: '受取利息', amount: 3_000 },
    ],
    why: [
      '当座預金が増えた → 資産の増加は借方',
      '手形貸付金が減った → 資産の減少は貸方',
      '受取利息が増えた → 収益の増加は貸方',
    ],
    statementImpact: { pl: 'PL：受取利息 ＋3千', bs: 'BS：当座預金 ＋15.3万、手形貸付金 −15万' },
  },

  {
    id: 'd6e10',
    no: 10,
    label: 'EVENT 10',
    scene: '手形借入金の返済＋利息',
    narrative:
      '手形借入金のうち 200,000円を、利息 4,000円とあわせて当座預金から返済しました。',
    quiz: {
      question: '借入れを利息とともに返したとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '手形借入金が減り、支払利息（費用）が発生し、当座預金が減った' },
        { id: 'b', label: '手形借入金だけが減った' },
        { id: 'c', label: '受取利息が増えた' },
        { id: 'd', label: '仕入が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '元本 200,000円は手形借入金の減少、利息 4,000円は支払利息（費用）。合計 204,000円が当座預金から出ます。',
      wrongFeedback:
        '返済額のうち元本は負債の減少、利息は費用（支払利息）です。分けて記録します。',
    },
    plainSummary: '借金の一部を、利息をつけて返した',
    changes: [
      { accountId: 'notesLoanPayable', label: '手形借入金', category: '負債', delta: -200_000 },
      { accountId: 'interestExpense', label: '支払利息', category: '費用', delta: 4_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -204_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'notesLoanPayable', label: '手形借入金', amount: 200_000 },
      { side: 'debit', accountId: 'interestExpense', label: '支払利息', amount: 4_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 204_000 },
    ],
    why: [
      '手形借入金が減った → 負債の減少は借方',
      '支払利息が増えた → 費用の増加は借方',
      '当座預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：支払利息 ＋4千', bs: 'BS：手形借入金 −20万、当座預金 −20.4万' },
  },

  {
    id: 'd6e11',
    no: 11,
    label: 'EVENT 11',
    scene: '貸倒れ（当期の売掛金）',
    narrative:
      '得意先が倒産し、この期に売り上げた分の売掛金 40,000円が回収できなくなりました（貸倒引当金は設定していません）。',
    quiz: {
      question: '当期の売掛金が貸倒れ（引当金なし）になったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '貸倒損失（費用）が増え、売掛金が減った' },
        { id: 'b', label: '売上が減った' },
        { id: 'c', label: '貸倒引当金が減った' },
        { id: 'd', label: '現金が減った' },
      ],
      correctId: 'a',
      correctFeedback:
        '回収できなくなった売掛金は「貸倒損失」という費用にし、売掛金（資産）を消します。（引当金があれば先に引当金を取り崩します＝DAY 12）',
      wrongFeedback:
        '売上は売ったとき計上済み。回収不能ぶんは「貸倒損失」（費用）にして売掛金を減らします。',
    },
    plainSummary: '売掛金が回収できなくなった（損失として処理）',
    changes: [
      { accountId: 'badDebtLoss', label: '貸倒損失', category: '費用', delta: 40_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -40_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'badDebtLoss', label: '貸倒損失', amount: 40_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 40_000 },
    ],
    why: [
      '貸倒損失が増えた → 費用の増加は借方',
      '売掛金が減った → 資産の減少は貸方',
      '引当金があるときは、まず引当金を取り崩す（DAY 12 でやる）',
    ],
    statementImpact: { pl: 'PL：貸倒損失 ＋4万', bs: 'BS：売掛金 −4万' },
  },

  {
    id: 'd6e12',
    no: 12,
    label: 'EVENT 12',
    scene: '備品の購入（あと払い）',
    narrative:
      '中古のテーブルセット（備品）を 30,000円で購入しました。代金は翌月払いです。',
    quiz: {
      question: '備品を買って代金を後払いにしたとき、負債は何になる？',
      options: [
        { id: 'a', label: '未払金（商品以外の後払い）' },
        { id: 'b', label: '買掛金' },
        { id: 'c', label: '前受金' },
        { id: 'd', label: '手形借入金' },
      ],
      correctId: 'a',
      correctFeedback:
        '備品は「商品」ではないので、後払いの義務は「未払金」。買掛金は商品を掛けで仕入れたときだけです。',
      wrongFeedback: '買掛金は商品仕入れの後払い。備品など商品以外は「未払金」です。',
    },
    plainSummary: '備品を買い、代金は後払いにした',
    changes: [
      { accountId: 'equipment', label: '備品', category: '資産', delta: 30_000 },
      { accountId: 'otherPayable', label: '未払金', category: '負債', delta: 30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'equipment', label: '備品', amount: 30_000 },
      { side: 'credit', accountId: 'otherPayable', label: '未払金', amount: 30_000 },
    ],
    why: [
      '備品が増えた → 資産の増加は借方',
      '未払金が増えた → 負債の増加は貸方',
      '商品仕入の後払い＝買掛金／それ以外＝未払金',
    ],
    statementImpact: { bs: 'BS：備品 ＋3万、未払金 ＋3万' },
  },

  {
    id: 'd6e13',
    no: 13,
    label: 'EVENT 13',
    scene: '未払金の支払い（備品分）',
    narrative: 'テーブルセットの未払金 30,000円を普通預金から支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '未払金が減り、普通預金が減った' },
        { id: 'b', label: '備品（費用）が増えた' },
        { id: 'c', label: '買掛金が減った' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback: '未払金（負債）と普通預金（資産）が同額減ります。',
      wrongFeedback: '備品は資産で、買ったとき計上済み。ここでは未払金と預金が減るだけです。',
    },
    plainSummary: '備品の未払金を、口座から払った',
    changes: [
      { accountId: 'otherPayable', label: '未払金', category: '負債', delta: -30_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -30_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'otherPayable', label: '未払金', amount: 30_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 30_000 },
    ],
    why: [
      '未払金が減った → 負債の減少は借方',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：未払金 −3万、普通預金 −3万' },
  },

  {
    id: 'd6e14',
    no: 14,
    label: 'EVENT 14',
    scene: '仕入と支払い',
    narrative:
      'コーヒー豆を 90,000円分掛けで仕入れ、その後すぐに小切手を振り出して買掛金 90,000円を支払いました。',
    quiz: {
      question: 'まとめると、この2つの取引で最終的に何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、当座預金が減った（買掛金は増えてすぐ減った）' },
        { id: 'b', label: '現金が減った' },
        { id: 'c', label: '買掛金が 90,000円残った' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '掛けで仕入れて（仕入／買掛金）、すぐ小切手で払った（買掛金／当座預金）。買掛金は行って来いで、残るのは仕入の増加と当座預金の減少です。',
      wrongFeedback:
        '自己振出の小切手は当座預金の減少。現金は動きません。',
    },
    plainSummary: '掛けで仕入れ、すぐに小切手で支払った',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 90_000 },
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: -90_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 90_000 },
      { side: 'credit', accountId: 'checkingDeposit', label: '当座預金', amount: 90_000 },
    ],
    why: [
      '仕入が増えた → 費用の増加は借方',
      '当座預金が減った → 資産の減少は貸方',
      '（買掛金は「仕入／買掛金」で増え「買掛金／当座預金」で減り、差し引きゼロ）',
    ],
    statementImpact: { pl: 'PL：仕入 ＋9万', bs: 'BS：当座預金 −9万' },
  },
];

export const DAY6: DayDef = {
  day: 6,
  title: 'いろいろな債権・債務',
  subtitle: '売掛金・買掛金以外の「あとで受け取る／払う」を整理します。',
  focus: ['未収入金・未払金', '手形貸付金・手形借入金', '当期の貸倒れ'],
  events: EVENTS,
  recap: [
    '「商品」の代金あと払いは 売掛金／買掛金、それ以外（備品・広告費など）は 未収入金／未払金',
    '資金の貸し借りで手形を使ったら「手形貸付金」「手形借入金」（営業の手形と分ける）',
    '回収不能になった売掛金は「貸倒損失」（引当金があればまず引当金を取り崩す）',
  ],
};
