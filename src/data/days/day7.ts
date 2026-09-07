import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 7 — 固定資産。
 * 取得原価（付随費用こみ）/ 資本的支出と収益的支出 / 売却（売却損・売却益）。
 * 減価償却は決算整理でやる（DAY 12）。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd7e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: 'イベント出店で現金売上が 200,000円ありました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '未収入金が増えた' },
        { id: 'd', label: '費用が減った' },
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
    id: 'd7e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: 'オフィスへ商品 100,000円分を掛けで販売しました。',
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
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 100_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 100_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 100_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 100_000 },
    ],
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋10万', bs: 'BS：売掛金 ＋10万' },
  },

  {
    id: 'd7e03',
    no: 3,
    label: 'EVENT 03',
    scene: '銀行借入れ',
    narrative: '設備投資のため、銀行から 400,000円を借り入れ、普通預金に入金されました。',
    quiz: {
      question: 'お金を借りたとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、借入金（返す義務）が増えた' },
        { id: 'b', label: '売上が増えた' },
        { id: 'c', label: '資本金が増えた' },
        { id: 'd', label: '費用が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '借りたお金は返す義務があるので「借入金」という負債です。',
      wrongFeedback: '借りたお金は売上でも資本金でもなく、返す義務のある「借入金」です。',
    },
    plainSummary: '銀行からお金を借りた',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 400_000 },
      { accountId: 'loan', label: '借入金', category: '負債', delta: 400_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 400_000 },
      { side: 'credit', accountId: 'loan', label: '借入金', amount: 400_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '借入金が増えた → 負債の増加は貸方',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋40万、借入金 ＋40万' },
  },

  {
    id: 'd7e04',
    no: 4,
    label: 'EVENT 04',
    scene: '固定資産の取得（付随費用こみ）',
    narrative:
      '配達用バイク（車両運搬具）を購入しました。本体価格 300,000円に、登録手数料・納車費用 20,000円を加えた 320,000円を普通預金から支払いました。',
    quiz: {
      question: '固定資産の「取得原価」に含めるのは？',
      options: [
        { id: 'a', label: '本体価格 ＋ 付随費用（手数料・運賃・据付費など）＝ 320,000円' },
        { id: 'b', label: '本体価格 300,000円だけ' },
        { id: 'c', label: '付随費用 20,000円だけ' },
        { id: 'd', label: '本体価格から手数料を引いた 280,000円' },
      ],
      correctId: 'a',
      correctFeedback:
        '固定資産を「使える状態にするまで」にかかった付随費用は、取得原価に含めます。ここでは 300,000 ＋ 20,000 ＝ 320,000円が車両運搬具の取得原価です。',
      wrongFeedback:
        '付随費用（手数料・運賃・据付費・登記料など）も、固定資産の取得原価に含めます。',
    },
    plainSummary: 'バイクを、付随費用こみの金額で資産に計上した',
    changes: [
      { accountId: 'vehicles', label: '車両運搬具', category: '資産', delta: 320_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -320_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'vehicles', label: '車両運搬具', amount: 320_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 320_000 },
    ],
    why: [
      '車両運搬具が増えた → 資産の増加は借方（取得原価＝本体＋付随費用）',
      '普通預金が減った → 資産の減少は貸方',
      '「使えるようにするまでの費用」は取得原価に含める',
    ],
    statementImpact: { bs: 'BS：車両運搬具 ＋32万、普通預金 −32万' },
  },

  {
    id: 'd7e05',
    no: 5,
    label: 'EVENT 05',
    scene: '収益的支出（修繕費）',
    narrative:
      'エスプレッソマシンが故障。もとどおりに直すための修理代 18,000円を現金で支払いました。',
    quiz: {
      question: '壊れたものを「元の状態に戻すだけ」の支出は、どう処理する？',
      options: [
        { id: 'a', label: '修繕費（費用）にする＝収益的支出' },
        { id: 'b', label: '備品（資産）を増やす＝資本的支出' },
        { id: 'c', label: '仕入を増やす' },
        { id: 'd', label: '売上を減らす' },
      ],
      correctId: 'a',
      correctFeedback:
        '価値を高めるのではなく「原状回復」なので、費用（修繕費）にします。これを収益的支出といいます。',
      wrongFeedback:
        '元に戻すだけなら費用（修繕費）。価値を高める・寿命を延ばすなら資産計上（資本的支出）です。',
    },
    plainSummary: '故障をもとどおりに直した（費用）',
    changes: [
      { accountId: 'repairExpense', label: '修繕費', category: '費用', delta: 18_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -18_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'repairExpense', label: '修繕費', amount: 18_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 18_000 },
    ],
    why: [
      '修繕費が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '原状回復＝収益的支出（費用）',
    ],
    statementImpact: { pl: 'PL：修繕費 ＋1.8万', bs: 'BS：現金 −1.8万' },
  },

  {
    id: 'd7e06',
    no: 6,
    label: 'EVENT 06',
    scene: '資本的支出',
    narrative:
      '店舗に新しい造作棚を設置しました。工事代 120,000円を現金で支払い、これにより店の機能が高まり、長く使えるようになりました。',
    quiz: {
      question: '価値を高めて長く使えるようにする支出は、どう処理する？',
      options: [
        { id: 'a', label: '備品（資産）を増やす＝資本的支出' },
        { id: 'b', label: '修繕費（費用）にする' },
        { id: 'c', label: '仕入を増やす' },
        { id: 'd', label: '広告宣伝費にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '固定資産の価値を高めたり、使用可能期間を延ばす支出は「資本的支出」。費用ではなく資産（備品など）を増やします。',
      wrongFeedback:
        '原状回復（修繕費）ではなく、価値を高める支出なので資産計上（資本的支出）です。',
    },
    plainSummary: '店の価値を高める工事をした（資産計上）',
    changes: [
      { accountId: 'equipment', label: '備品', category: '資産', delta: 120_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'equipment', label: '備品', amount: 120_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 120_000 },
    ],
    why: [
      '備品が増えた → 資産の増加は借方（資本的支出）',
      '現金が減った → 資産の減少は貸方',
      '価値を高める・寿命を延ばす＝資本的支出（資産）',
    ],
    statementImpact: { bs: 'BS：備品 ＋12万、現金 −12万' },
  },

  {
    id: 'd7e07',
    no: 7,
    label: 'EVENT 07',
    scene: '固定資産の売却（売却損）',
    narrative:
      '使わなくなった古いレジ（備品・帳簿価額 60,000円）を 45,000円で売却し、代金は現金で受け取りました。',
    quiz: {
      question: '帳簿価額 60,000円のものを 45,000円で売ったとき、差額はどうなる？',
      options: [
        { id: 'a', label: '差額 15,000円は「固定資産売却損」（費用）' },
        { id: 'b', label: '差額 15,000円は「固定資産売却益」（収益）' },
        { id: 'c', label: '差額は売上になる' },
        { id: 'd', label: '差額は仕入の減少になる' },
      ],
      correctId: 'a',
      correctFeedback:
        '帳簿価額（60,000円）より安く（45,000円）売れたので、差額 15,000円は「固定資産売却損」。備品を帳簿価額ぶん消し、受け取った現金との差を損益にします。',
      wrongFeedback:
        '帳簿価額より安く売れた → 損。差額は固定資産売却損（費用）です。',
    },
    plainSummary: '備品を帳簿価額より安く売った（売却損）',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 45_000 },
      { accountId: 'lossOnSaleFA', label: '固定資産売却損', category: '費用', delta: 15_000 },
      { accountId: 'equipment', label: '備品', category: '資産', delta: -60_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 45_000 },
      { side: 'debit', accountId: 'lossOnSaleFA', label: '固定資産売却損', amount: 15_000 },
      { side: 'credit', accountId: 'equipment', label: '備品', amount: 60_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '固定資産売却損が増えた → 費用の増加は借方',
      '備品が減った → 資産の減少は貸方（帳簿価額 60,000 を消す）',
      '借方 45,000＋15,000 ＝ 貸方 60,000',
    ],
    statementImpact: { pl: 'PL：固定資産売却損 ＋1.5万', bs: 'BS：備品 −6万、現金 ＋4.5万' },
  },

  {
    id: 'd7e08',
    no: 8,
    label: 'EVENT 08',
    scene: '固定資産の売却（売却益）',
    narrative:
      '別の不要な備品（帳簿価額 40,000円）を 55,000円で売却しました。代金は月末に受け取ります。',
    quiz: {
      question: '帳簿価額 40,000円のものを 55,000円で売ったとき、差額はどうなる？',
      options: [
        { id: 'a', label: '差額 15,000円は「固定資産売却益」（収益）' },
        { id: 'b', label: '差額 15,000円は「固定資産売却損」（費用）' },
        { id: 'c', label: '差額は売上になる' },
        { id: 'd', label: '差額は受取利息になる' },
      ],
      correctId: 'a',
      correctFeedback:
        '帳簿価額（40,000円）より高く（55,000円）売れたので、差額 15,000円は「固定資産売却益」。代金は商品ではないので「未収入金」で受け取ります。',
      wrongFeedback:
        '帳簿価額より高く売れた → 益。差額は固定資産売却益（収益）です。',
    },
    plainSummary: '備品を帳簿価額より高く売った（売却益）。代金は後日受取り',
    changes: [
      { accountId: 'otherReceivable', label: '未収入金', category: '資産', delta: 55_000 },
      { accountId: 'equipment', label: '備品', category: '資産', delta: -40_000 },
      { accountId: 'gainOnSaleFA', label: '固定資産売却益', category: '収益', delta: 15_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'otherReceivable', label: '未収入金', amount: 55_000 },
      { side: 'credit', accountId: 'equipment', label: '備品', amount: 40_000 },
      { side: 'credit', accountId: 'gainOnSaleFA', label: '固定資産売却益', amount: 15_000 },
    ],
    why: [
      '未収入金が増えた → 資産の増加は借方（商品ではないので売掛金ではない）',
      '備品が減った → 資産の減少は貸方（帳簿価額 40,000 を消す）',
      '固定資産売却益が増えた → 収益の増加は貸方',
    ],
    statementImpact: { pl: 'PL：固定資産売却益 ＋1.5万', bs: 'BS：備品 −4万、未収入金 ＋5.5万' },
  },

  {
    id: 'd7e09',
    no: 9,
    label: 'EVENT 09',
    scene: '未収入金の回収',
    narrative: '備品の売却代金 55,000円が普通預金に振り込まれました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、未収入金が減った' },
        { id: 'b', label: '固定資産売却益が増えた' },
        { id: 'c', label: '売上が増えた' },
        { id: 'd', label: '売掛金が減った' },
      ],
      correctId: 'a',
      correctFeedback: '売却益はすでに計上済み。入金は「権利（未収入金）」が「お金」に変わるだけです。',
      wrongFeedback: '入金では利益は増えません。資産どうしの振替です。',
    },
    plainSummary: 'あとで受け取る予定だった売却代金が入金された',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 55_000 },
      { accountId: 'otherReceivable', label: '未収入金', category: '資産', delta: -55_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 55_000 },
      { side: 'credit', accountId: 'otherReceivable', label: '未収入金', amount: 55_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '未収入金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋5.5万、未収入金 −5.5万' },
  },

  {
    id: 'd7e10',
    no: 10,
    label: 'EVENT 10',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆・食材を 130,000円分、掛けで仕入れました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金が増えた' },
        { id: 'b', label: '未払金が増えた' },
        { id: 'c', label: '現金が減った' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '商品の掛け仕入なので、仕入と買掛金が増えます。',
      wrongFeedback: '商品の掛け仕入は「買掛金」（商品以外なら未払金）。',
    },
    plainSummary: '商品を掛けで仕入れた',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 130_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 130_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 130_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 130_000 },
    ],
    why: ['仕入が増えた → 費用の増加は借方', '買掛金が増えた → 負債の増加は貸方'],
    statementImpact: { pl: 'PL：仕入 ＋13万', bs: 'BS：買掛金 ＋13万' },
  },

  {
    id: 'd7e11',
    no: 11,
    label: 'EVENT 11',
    scene: '買掛金の支払い',
    narrative: '買掛金 130,000円を普通預金から支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '買掛金が減り、普通預金が減った' },
        { id: 'b', label: '仕入（費用）が増えた' },
        { id: 'c', label: '未払金が減った' },
        { id: 'd', label: '売上が減った' },
      ],
      correctId: 'a',
      correctFeedback: '費用は仕入れたとき計上済み。支払いでは買掛金と普通預金が減ります。',
      wrongFeedback: '支払時に費用は増えません。買掛金（負債）と普通預金（資産）が減ります。',
    },
    plainSummary: '後払いの仕入代金を、口座から払った',
    changes: [
      { accountId: 'ap', label: '買掛金', category: '負債', delta: -130_000 },
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: -130_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ap', label: '買掛金', amount: 130_000 },
      { side: 'credit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 130_000 },
    ],
    why: [
      '買掛金が減った → 負債の減少は借方',
      '普通預金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：買掛金 −13万、普通預金 −13万' },
  },

  {
    id: 'd7e12',
    no: 12,
    label: 'EVENT 12',
    scene: '車両の整備（収益的支出）',
    narrative: '配達用バイクの定期点検・整備代 8,000円を現金で支払いました。',
    quiz: {
      question: '固定資産をふつうに使い続けるための維持費は、どう処理する？',
      options: [
        { id: 'a', label: '修繕費（費用）にする＝収益的支出' },
        { id: 'b', label: '車両運搬具（資産）を増やす' },
        { id: 'c', label: '仕入にする' },
        { id: 'd', label: '売上を減らす' },
      ],
      correctId: 'a',
      correctFeedback:
        '性能を高めるわけではない通常の維持・点検は、費用（修繕費）＝収益的支出です。',
      wrongFeedback:
        '価値を高めるわけではないので資産計上はしません。費用（修繕費）です。',
    },
    plainSummary: 'バイクの定期整備をした（費用）',
    changes: [
      { accountId: 'repairExpense', label: '修繕費', category: '費用', delta: 8_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -8_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'repairExpense', label: '修繕費', amount: 8_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 8_000 },
    ],
    why: [
      '修繕費が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '通常の維持費＝収益的支出（費用）',
    ],
    statementImpact: { pl: 'PL：修繕費 ＋8千', bs: 'BS：現金 −8千' },
  },

  {
    id: 'd7e13',
    no: 13,
    label: 'EVENT 13',
    scene: '現金売上',
    narrative: '週末営業で現金売上が 150,000円ありました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '固定資産売却益が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上です。',
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
];

export const DAY7: DayDef = {
  day: 7,
  title: '固定資産',
  subtitle: '取得原価（付随費用こみ）・資本的支出／収益的支出・売却損益を扱います。',
  focus: ['取得原価と付随費用', '資本的支出／収益的支出', '固定資産の売却損益'],
  events: EVENTS,
  recap: [
    '固定資産の取得原価は「本体価格 ＋ 付随費用（手数料・運賃・据付費など）」',
    '価値を高める・寿命を延ばす支出＝資本的支出（資産）／原状回復・維持費＝収益的支出（修繕費）',
    '固定資産を売ったら、帳簿価額と売価の差が「固定資産売却損／益」',
    '固定資産の代金あと払い・あと受け取りは「未払金／未収入金」（売掛金・買掛金ではない）',
  ],
};
