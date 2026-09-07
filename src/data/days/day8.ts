import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 8 — 株式会社のお金と、税金。
 * 増資（新株発行）/ 租税公課 / 消費税（税抜方式）/ 法人税等（中間納付・確定）。
 * ※消費税は EVENT 01〜04 でだけ明示。ほかの売上・仕入は本体のみ表示している。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd8e01',
    no: 1,
    label: 'EVENT 01',
    scene: '仕入と消費税（税抜方式）',
    narrative:
      '商品を本体価格 220,000円で掛け仕入れしました。消費税 10%（22,000円）を含めた 242,000円を支払う約束です。',
    quiz: {
      question: '税抜方式で仕入れたとき、消費税 22,000円はどう処理する？',
      options: [
        { id: 'a', label: '「仮払消費税」（あとで差し引ける資産）にする' },
        { id: 'b', label: '仕入に含めて 242,000円にする' },
        { id: 'c', label: '租税公課（費用）にする' },
        { id: 'd', label: '仮受消費税（負債）にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '税抜方式では、本体 220,000円は「仕入」、払った消費税 22,000円は「仮払消費税」（あとで納付額から差し引ける資産）に分けます。',
      wrongFeedback:
        '税抜方式では消費税を仕入に含めません。払った消費税は「仮払消費税」という資産です。',
    },
    plainSummary: '仕入の本体と消費税を分けて記録した（税抜方式）',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 220_000 },
      { accountId: 'prepaidConsumptionTax', label: '仮払消費税', category: '資産', delta: 22_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 242_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 220_000 },
      { side: 'debit', accountId: 'prepaidConsumptionTax', label: '仮払消費税', amount: 22_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 242_000 },
    ],
    why: [
      '仕入が増えた → 費用の増加は借方（本体のみ）',
      '仮払消費税が増えた → 資産の増加は借方（あとで控除する）',
      '買掛金が増えた → 負債の増加は貸方（税こみの総額）',
    ],
    statementImpact: { pl: 'PL：仕入 ＋22万', bs: 'BS：仮払消費税 ＋2.2万、買掛金 ＋24.2万' },
  },

  {
    id: 'd8e02',
    no: 2,
    label: 'EVENT 02',
    scene: '売上と消費税（税抜方式）',
    narrative:
      '商品を本体価格 350,000円で掛け販売しました。消費税 10%（35,000円）を含めた 385,000円を受け取る約束です。',
    quiz: {
      question: '税抜方式で売ったとき、預かった消費税 35,000円はどう処理する？',
      options: [
        { id: 'a', label: '「仮受消費税」（あとで納める負債）にする' },
        { id: 'b', label: '売上に含めて 385,000円にする' },
        { id: 'c', label: '受取利息（収益）にする' },
        { id: 'd', label: '仮払消費税（資産）にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '税抜方式では、本体 350,000円は「売上」、お客さまから預かった消費税 35,000円は「仮受消費税」（あとで国に納める負債）に分けます。',
      wrongFeedback:
        '預かった消費税は自社のもうけではありません。「仮受消費税」という負債です。',
    },
    plainSummary: '売上の本体と、預かった消費税を分けて記録した（税抜方式）',
    changes: [
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 385_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 350_000 },
      { accountId: 'receivedConsumptionTax', label: '仮受消費税', category: '負債', delta: 35_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 385_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 350_000 },
      { side: 'credit', accountId: 'receivedConsumptionTax', label: '仮受消費税', amount: 35_000 },
    ],
    why: [
      '売掛金が増えた → 資産の増加は借方（税こみ総額）',
      '売上が増えた → 収益の増加は貸方（本体のみ）',
      '仮受消費税が増えた → 負債の増加は貸方（預かっただけ）',
    ],
    statementImpact: { pl: 'PL：売上 ＋35万', bs: 'BS：売掛金 ＋38.5万、仮受消費税 ＋3.5万' },
  },

  {
    id: 'd8e03',
    no: 3,
    label: 'EVENT 03',
    scene: '消費税の精算（決算）',
    narrative:
      '決算にあたり、仮受消費税 35,000円と仮払消費税 22,000円を相殺し、差額を納付額として確定しました。',
    quiz: {
      question: '決算で消費税を精算すると、納める額はいくら？',
      options: [
        { id: 'a', label: '仮受 35,000円 − 仮払 22,000円 ＝ 13,000円を「未払消費税」にする' },
        { id: 'b', label: '仮受 35,000円をそのまま納める' },
        { id: 'c', label: '仮払 22,000円を納める' },
        { id: 'd', label: '合計 57,000円を納める' },
      ],
      correctId: 'a',
      correctFeedback:
        '預かった消費税（仮受）から、自社が払った消費税（仮払）を差し引いた 13,000円が納付額。決算では「未払消費税」（負債）にしておきます。',
      wrongFeedback:
        '納めるのは「預かった分 − 払った分」。差額 13,000円を未払消費税にします。',
    },
    plainSummary: '預かった消費税から払った消費税を引いて、納める額を確定した',
    changes: [
      { accountId: 'receivedConsumptionTax', label: '仮受消費税', category: '負債', delta: -35_000 },
      { accountId: 'prepaidConsumptionTax', label: '仮払消費税', category: '資産', delta: -22_000 },
      { accountId: 'payableConsumptionTax', label: '未払消費税', category: '負債', delta: 13_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'receivedConsumptionTax', label: '仮受消費税', amount: 35_000 },
      { side: 'credit', accountId: 'prepaidConsumptionTax', label: '仮払消費税', amount: 22_000 },
      { side: 'credit', accountId: 'payableConsumptionTax', label: '未払消費税', amount: 13_000 },
    ],
    why: [
      '仮受消費税を借方に入れて消す（負債の減少）',
      '仮払消費税を貸方に入れて消す（資産の減少）',
      '差額 13,000円が未払消費税（負債の増加）',
    ],
    statementImpact: { bs: 'BS：仮受・仮払消費税を精算、未払消費税 ＋13,000' },
  },

  {
    id: 'd8e04',
    no: 4,
    label: 'EVENT 04',
    scene: '消費税の納付',
    narrative: '未払消費税 13,000円を現金で納付しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '未払消費税（納める義務）が減り、現金が減った' },
        { id: 'b', label: '租税公課（費用）が増えた' },
        { id: 'c', label: '仮受消費税が減った' },
        { id: 'd', label: '法人税等が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '消費税は「預かって代わりに納める」だけなので、会社の費用にはなりません。未払消費税（負債）と現金（資産）が減ります。',
      wrongFeedback:
        '消費税の納付は費用ではありません。未払消費税（負債）を減らして支払います。',
    },
    plainSummary: '確定していた消費税を国に納めた',
    changes: [
      { accountId: 'payableConsumptionTax', label: '未払消費税', category: '負債', delta: -13_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -13_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'payableConsumptionTax', label: '未払消費税', amount: 13_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 13_000 },
    ],
    why: [
      '未払消費税が減った → 負債の減少は借方',
      '現金が減った → 資産の減少は貸方',
      '消費税の納付は費用にならない（預かって納めるだけ）',
    ],
    statementImpact: { bs: 'BS：未払消費税 −13,000、現金 −13,000' },
  },

  {
    id: 'd8e05',
    no: 5,
    label: 'EVENT 05',
    scene: '固定資産税の納付',
    narrative: '店舗の固定資産税 40,000円を現金で納付しました。',
    quiz: {
      question: '固定資産税・自動車税・印紙税などは、どの勘定で処理する？',
      options: [
        { id: 'a', label: '租税公課（費用）' },
        { id: 'b', label: '法人税等（費用）' },
        { id: 'c', label: '未払消費税（負債）' },
        { id: 'd', label: '支払手数料（費用）' },
      ],
      correctId: 'a',
      correctFeedback:
        '固定資産税・自動車税・印紙税・登録免許税などは「租税公課」という費用でまとめます。',
      wrongFeedback:
        '会社のもうけにかかる「法人税等」とは別。それ以外の税金・公課は「租税公課」です。',
    },
    plainSummary: '固定資産税を現金で納めた（租税公課）',
    changes: [
      { accountId: 'taxesDues', label: '租税公課', category: '費用', delta: 40_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -40_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'taxesDues', label: '租税公課', amount: 40_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 40_000 },
    ],
    why: [
      '租税公課が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：租税公課 ＋4万', bs: 'BS：現金 −4万' },
  },

  {
    id: 'd8e06',
    no: 6,
    label: 'EVENT 06',
    scene: '収入印紙の使用',
    narrative: '契約書に貼るため、収入印紙 5,000円を現金で購入し、その場で貼付しました。',
    quiz: {
      question: 'すぐに使う収入印紙を買ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '租税公課（費用）が増え、現金が減った' },
        { id: 'b', label: '貯蔵品（資産）が増えた' },
        { id: 'c', label: '通信費が増えた' },
        { id: 'd', label: '消耗品費が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '収入印紙は印紙税。すぐ使った分は「租税公課」（費用）です。（未使用のまま決算をむかえたら「貯蔵品」に振り替えます＝DAY 11）',
      wrongFeedback:
        '収入印紙は印紙税なので「租税公課」。使わずに残ったぶんだけ決算で貯蔵品にします。',
    },
    plainSummary: '収入印紙を買ってすぐ使った（租税公課）',
    changes: [
      { accountId: 'taxesDues', label: '租税公課', category: '費用', delta: 5_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -5_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'taxesDues', label: '租税公課', amount: 5_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 5_000 },
    ],
    why: [
      '租税公課が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '印紙税＝租税公課',
    ],
    statementImpact: { pl: 'PL：租税公課 ＋5千', bs: 'BS：現金 −5千' },
  },

  {
    id: 'd8e07',
    no: 7,
    label: 'EVENT 07',
    scene: '自動車税の納付',
    narrative: '配達用バイクの自動車税 8,000円を現金で納付しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '租税公課（費用）が増え、現金が減った' },
        { id: 'b', label: '車両運搬具（資産）が増えた' },
        { id: 'c', label: '修繕費が増えた' },
        { id: 'd', label: '法人税等が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '自動車税も「租税公課」（費用）です。車両運搬具の取得原価には含めません。',
      wrongFeedback: '毎年かかる自動車税は費用（租税公課）。取得原価には含めません。',
    },
    plainSummary: '自動車税を現金で納めた（租税公課）',
    changes: [
      { accountId: 'taxesDues', label: '租税公課', category: '費用', delta: 8_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -8_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'taxesDues', label: '租税公課', amount: 8_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 8_000 },
    ],
    why: [
      '租税公課が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：租税公課 ＋8千', bs: 'BS：現金 −8千' },
  },

  {
    id: 'd8e08',
    no: 8,
    label: 'EVENT 08',
    scene: '新株の発行（増資）',
    narrative:
      '事業拡大のため新株を発行しました。50株を1株 6,000円で発行し、全額の 300,000円が当座預金に払い込まれました。',
    quiz: {
      question: '会社が新しく株式を発行してお金を集めたとき、払込金はどうなる？',
      options: [
        { id: 'a', label: '「資本金」（純資産）が増える' },
        { id: 'b', label: '「売上」（収益）が増える' },
        { id: 'c', label: '「借入金」（負債）が増える' },
        { id: 'd', label: '「前受金」（負債）が増える' },
      ],
      correctId: 'a',
      correctFeedback:
        '株主からの出資金は返す必要のないお金なので「資本金」（純資産）。借入金（返す）とも売上（もうけ）とも違います。',
      wrongFeedback:
        '株式の払込金は、返済不要の出資。純資産の「資本金」が増えます。',
    },
    plainSummary: '新しい株式を発行して、出資金を集めた',
    changes: [
      { accountId: 'checkingDeposit', label: '当座預金', category: '資産', delta: 300_000 },
      { accountId: 'capital', label: '資本金', category: '純資産', delta: 300_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'checkingDeposit', label: '当座預金', amount: 300_000 },
      { side: 'credit', accountId: 'capital', label: '資本金', amount: 300_000 },
    ],
    why: [
      '当座預金が増えた → 資産の増加は借方',
      '資本金が増えた → 純資産の増加は貸方',
      '払込金は原則、全額を資本金にする（3級）',
    ],
    statementImpact: { bs: 'BS：当座預金 ＋30万、資本金 ＋30万' },
  },

  {
    id: 'd8e09',
    no: 9,
    label: 'EVENT 09',
    scene: '追加の増資',
    narrative:
      'さらに 20株を1株 5,000円で発行し、100,000円が普通預金に払い込まれました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '普通預金が増え、資本金が増えた' },
        { id: 'b', label: '普通預金が増え、売上が増えた' },
        { id: 'c', label: '普通預金が増え、借入金が増えた' },
        { id: 'd', label: '普通預金が増え、利益が増えた' },
      ],
      correctId: 'a',
      correctFeedback: 'こちらも増資。払込金 100,000円は資本金（純資産）が増えます。',
      wrongFeedback: '株式の払込金は資本金。会社のもうけ（利益）ではありません。',
    },
    plainSummary: 'もう一度、株式を発行して出資金を集めた',
    changes: [
      { accountId: 'ordinaryDeposit', label: '普通預金', category: '資産', delta: 100_000 },
      { accountId: 'capital', label: '資本金', category: '純資産', delta: 100_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ordinaryDeposit', label: '普通預金', amount: 100_000 },
      { side: 'credit', accountId: 'capital', label: '資本金', amount: 100_000 },
    ],
    why: [
      '普通預金が増えた → 資産の増加は借方',
      '資本金が増えた → 純資産の増加は貸方',
    ],
    statementImpact: { bs: 'BS：普通預金 ＋10万、資本金 ＋10万' },
  },

  {
    id: 'd8e10',
    no: 10,
    label: 'EVENT 10',
    scene: '法人税等の中間納付',
    narrative:
      '法人税等の中間申告として、60,000円を現金で納付しました（確定額はまだ決まっていません）。',
    quiz: {
      question: '確定前に先に納めた法人税等は、どう処理する？',
      options: [
        { id: 'a', label: '「仮払法人税等」（あとで精算する資産）にする' },
        { id: 'b', label: '「法人税等」（費用）にする' },
        { id: 'c', label: '「租税公課」（費用）にする' },
        { id: 'd', label: '「未払法人税等」（負債）にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '確定額が決まる前の中間納付は、いったん「仮払法人税等」（資産）で置いておき、決算で確定額と精算します。',
      wrongFeedback:
        '確定していないので費用にはしません。「仮払法人税等」（資産）で仮に処理します。',
    },
    plainSummary: '法人税等を先に一部だけ納めた（仮払い）',
    changes: [
      { accountId: 'prepaidIncomeTax', label: '仮払法人税等', category: '資産', delta: 60_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -60_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'prepaidIncomeTax', label: '仮払法人税等', amount: 60_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 60_000 },
    ],
    why: [
      '仮払法人税等が増えた → 資産の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '確定額が決まるまでの一時的な資産',
    ],
    statementImpact: { bs: 'BS：仮払法人税等 ＋6万、現金 −6万' },
  },

  {
    id: 'd8e11',
    no: 11,
    label: 'EVENT 11',
    scene: '法人税等の確定（決算）',
    narrative:
      '決算にあたり、当期の法人税等が 100,000円と確定しました。中間納付した 60,000円を差し引き、残りを未払いとします。',
    quiz: {
      question: '法人税等が確定したとき、どう処理する？',
      options: [
        {
          id: 'a',
          label: '「法人税等」100,000円を計上し、仮払 60,000円を消し、残り 40,000円を未払法人税等にする',
        },
        { id: 'b', label: '「法人税等」は 40,000円だけ' },
        { id: 'c', label: '「租税公課」100,000円にする' },
        { id: 'd', label: '仮払法人税等をそのまま残す' },
      ],
      correctId: 'a',
      correctFeedback:
        '費用となる「法人税等」は確定額の満額 100,000円。すでに仮払いした 60,000円を差し引き、残り 40,000円を「未払法人税等」（負債）にします。',
      wrongFeedback:
        '法人税等（費用）は確定額の全額。中間納付分を引いた残りが「未払法人税等」です。',
    },
    plainSummary: '法人税等の金額が確定し、中間納付分を精算した',
    changes: [
      { accountId: 'incomeTaxExpense', label: '法人税等', category: '費用', delta: 100_000 },
      { accountId: 'prepaidIncomeTax', label: '仮払法人税等', category: '資産', delta: -60_000 },
      { accountId: 'incomeTaxPayable', label: '未払法人税等', category: '負債', delta: 40_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'incomeTaxExpense', label: '法人税等', amount: 100_000 },
      { side: 'credit', accountId: 'prepaidIncomeTax', label: '仮払法人税等', amount: 60_000 },
      { side: 'credit', accountId: 'incomeTaxPayable', label: '未払法人税等', amount: 40_000 },
    ],
    why: [
      '法人税等が増えた → 費用の増加は借方（確定額の全額）',
      '仮払法人税等を貸方に入れて消す（資産の減少）',
      '未払法人税等が増えた → 負債の増加は貸方（残りの納付予定額）',
    ],
    statementImpact: {
      pl: 'PL：法人税等 ＋10万',
      bs: 'BS：仮払法人税等 −6万、未払法人税等 ＋4万',
    },
  },

  {
    id: 'd8e12',
    no: 12,
    label: 'EVENT 12',
    scene: '仕入（掛け）',
    narrative: 'コーヒー豆・食材を 180,000円分、掛けで仕入れました（消費税は省略）。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '仕入（費用）が増え、買掛金が増えた' },
        { id: 'b', label: '仮払消費税が増えた' },
        { id: 'c', label: '現金が減った' },
        { id: 'd', label: '売上が増えた' },
      ],
      correctId: 'a',
      correctFeedback: 'ふつうの掛け仕入。仕入と買掛金が増えます。',
      wrongFeedback: '掛けなので現金は動きません。買掛金という負債が増えます。',
    },
    plainSummary: '商品を掛けで仕入れた',
    changes: [
      { accountId: 'purchases', label: '仕入', category: '費用', delta: 180_000 },
      { accountId: 'ap', label: '買掛金', category: '負債', delta: 180_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'purchases', label: '仕入', amount: 180_000 },
      { side: 'credit', accountId: 'ap', label: '買掛金', amount: 180_000 },
    ],
    why: ['仕入が増えた → 費用の増加は借方', '買掛金が増えた → 負債の増加は貸方'],
    statementImpact: { pl: 'PL：仕入 ＋18万', bs: 'BS：買掛金 ＋18万' },
  },

  {
    id: 'd8e13',
    no: 13,
    label: 'EVENT 13',
    scene: '現金売上',
    narrative: '週末営業で現金売上が 300,000円ありました（消費税は省略）。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '仮受消費税が増えた' },
        { id: 'c', label: '売掛金が増えた' },
        { id: 'd', label: '資本金が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上です。',
      wrongFeedback: 'その場で現金を受け取ったので、現金と売上が増えます。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 300_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 300_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 300_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 300_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋30万', bs: 'BS：現金 ＋30万' },
  },
];

export const DAY8: DayDef = {
  day: 8,
  title: '株式会社のお金と、税金',
  subtitle: '増資（新株発行）・租税公課・消費税（税抜方式）・法人税等を扱います。',
  focus: ['増資（資本金）', '租税公課', '消費税（税抜方式）', '法人税等'],
  events: EVENTS,
  recap: [
    '株式の払込金は返さないお金なので「資本金」（純資産）',
    '固定資産税・自動車税・印紙税などは「租税公課」（費用）',
    '税抜方式：仕入の消費税は仮払消費税（資産）、売上の消費税は仮受消費税（負債）。決算で相殺して未払消費税に',
    '法人税等は会社のもうけにかかる税金（費用）。中間納付は仮払法人税等、残りは未払法人税等',
  ],
};
