import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 9 — 人を雇うお金と、その他の費用。訂正仕訳。
 * 給料と源泉・社会保険料の預り / 法定福利費 / 保険料・福利厚生費・諸会費 / 訂正仕訳。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd9e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: '平日の現金売上が 250,000円ありました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '前受金が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上です。',
      wrongFeedback: 'その場で現金を受け取ったので、現金と売上が増えます。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 250_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 250_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 250_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 250_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋25万', bs: 'BS：現金 ＋25万' },
  },

  {
    id: 'd9e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: 'オフィスへ商品 120,000円分を掛けで販売しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が増え、売上が増えた' },
        { id: 'b', label: '未収入金が増えた' },
        { id: 'c', label: '現金が増えた' },
        { id: 'd', label: '前受金が増えた' },
      ],
      correctId: 'a',
      correctFeedback: '商品の掛け売上。売掛金（資産）と売上（収益）が増えます。',
      wrongFeedback: '商品の代金あと払いは「売掛金」です。',
    },
    plainSummary: '商品を先に渡し、代金は後でもらうことにした',
    changes: [
      { accountId: 'ar', label: '売掛金', category: '資産', delta: 120_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 120_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'ar', label: '売掛金', amount: 120_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 120_000 },
    ],
    why: ['売掛金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋12万', bs: 'BS：売掛金 ＋12万' },
  },

  {
    id: 'd9e03',
    no: 3,
    label: 'EVENT 03',
    scene: '週末の現金売上',
    narrative: '週末営業で現金売上が 150,000円ありました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '費用が減った' },
        { id: 'd', label: '資本金が増えた' },
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

  {
    id: 'd9e04',
    no: 4,
    label: 'EVENT 04',
    scene: '給料の支払い（源泉・社会保険料の天引き）',
    narrative:
      '従業員へ給料 300,000円を支給。所得税の源泉徴収 15,000円と、社会保険料の従業員負担分 24,000円を差し引き、残り 261,000円を現金で支払いました。',
    quiz: {
      question: '天引きして給料を払ったとき、費用になる「給料」はいくら？',
      options: [
        { id: 'a', label: '天引き前の 300,000円（天引き分は預り金という負債）' },
        { id: 'b', label: '振り込んだ 261,000円だけ' },
        { id: 'c', label: '天引き分 39,000円だけ' },
        { id: 'd', label: '0円（すべて預り金）' },
      ],
      correctId: 'a',
      correctFeedback:
        '費用となる給料は満額の 300,000円。源泉所得税 15,000円と社会保険料（本人負担）24,000円は、会社が預かって代わりに納めるので「預り金」（負債）です。',
      wrongFeedback:
        '給料（費用）は天引き前の全額。天引き分は「預り金」（あとで納める負債）に分けます。',
    },
    plainSummary: '給料から税金・社会保険料を天引きして、残りを振り込んだ',
    changes: [
      { accountId: 'salary', label: '給料', category: '費用', delta: 300_000 },
      { accountId: 'depositsReceived', label: '預り金', category: '負債', delta: 39_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -261_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'salary', label: '給料', amount: 300_000 },
      { side: 'credit', accountId: 'depositsReceived', label: '預り金', amount: 39_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 261_000 },
    ],
    why: [
      '給料が増えた → 費用の増加は借方（天引き前の全額）',
      '預り金が増えた → 負債の増加は貸方（源泉所得税 15,000 ＋ 社会保険料本人負担 24,000）',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: {
      pl: 'PL：給料 ＋30万',
      bs: 'BS：預り金 ＋3.9万、現金 −26.1万',
    },
  },

  {
    id: 'd9e05',
    no: 5,
    label: 'EVENT 05',
    scene: '社会保険料の納付',
    narrative:
      '社会保険料を年金事務所に納付しました。従業員から預かった 24,000円と、会社が負担する分 24,000円の合計 48,000円を現金で支払いました。',
    quiz: {
      question: '社会保険料の会社負担分は、どう処理する？',
      options: [
        { id: 'a', label: '「法定福利費」（費用）にする' },
        { id: 'b', label: '「給料」に含める' },
        { id: 'c', label: '「福利厚生費」にする' },
        { id: 'd', label: '「租税公課」にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '従業員から預かった分は「預り金」の取り崩し、会社が負担する分は「法定福利費」（費用）です。合計 48,000円を納めます。',
      wrongFeedback:
        '会社が法律で負担を義務づけられている社会保険料は「法定福利費」（費用）です。',
    },
    plainSummary: '預かった社会保険料と、会社負担分を合わせて納めた',
    changes: [
      { accountId: 'depositsReceived', label: '預り金', category: '負債', delta: -24_000 },
      { accountId: 'legalWelfare', label: '法定福利費', category: '費用', delta: 24_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -48_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'depositsReceived', label: '預り金', amount: 24_000 },
      { side: 'debit', accountId: 'legalWelfare', label: '法定福利費', amount: 24_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 48_000 },
    ],
    why: [
      '預り金が減った → 負債の減少は借方（従業員負担分を納めた）',
      '法定福利費が増えた → 費用の増加は借方（会社負担分）',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：法定福利費 ＋2.4万', bs: 'BS：預り金 −2.4万、現金 −4.8万' },
  },

  {
    id: 'd9e06',
    no: 6,
    label: 'EVENT 06',
    scene: '源泉所得税の納付',
    narrative: '給料から預かっていた源泉所得税 15,000円を、現金で税務署に納付しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '預り金（納める義務）が減り、現金が減った' },
        { id: 'b', label: '給料（費用）が増えた' },
        { id: 'c', label: '法定福利費が増えた' },
        { id: 'd', label: '租税公課が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '源泉所得税は従業員が負担するもの。会社は預かって納めるだけなので、費用にはならず「預り金」（負債）が減ります。',
      wrongFeedback: '源泉所得税は会社の費用ではありません。預り金を減らして納めます。',
    },
    plainSummary: '給料から預かっていた所得税を、税務署に納めた',
    changes: [
      { accountId: 'depositsReceived', label: '預り金', category: '負債', delta: -15_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -15_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'depositsReceived', label: '預り金', amount: 15_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 15_000 },
    ],
    why: [
      '預り金が減った → 負債の減少は借方',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { bs: 'BS：預り金 −1.5万、現金 −1.5万' },
  },

  {
    id: 'd9e07',
    no: 7,
    label: 'EVENT 07',
    scene: '火災保険料の支払い',
    narrative: '店舗の火災保険料 1年分 36,000円を現金で支払いました。',
    quiz: {
      question: '保険料を1年分まとめて払ったとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '保険料（費用）が増え、現金が減った' },
        { id: 'b', label: '前払費用（資産）が 36,000円増えた' },
        { id: 'c', label: '差入保証金が増えた' },
        { id: 'd', label: '租税公課が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        'いったん全額を「保険料」（費用）で処理します。決算のときに、まだ経過していない期間の分を「前払費用」に振り替えます（DAY 12）。',
      wrongFeedback:
        '支払時はまず全額を費用（保険料）に。未経過分の振替は決算で行います。',
    },
    plainSummary: '火災保険料を1年分まとめて払った',
    changes: [
      { accountId: 'insuranceExpense', label: '保険料', category: '費用', delta: 36_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -36_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'insuranceExpense', label: '保険料', amount: 36_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 36_000 },
    ],
    why: [
      '保険料が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
      '未経過分の前払費用への振替は決算でやる',
    ],
    statementImpact: { pl: 'PL：保険料 ＋3.6万', bs: 'BS：現金 −3.6万' },
  },

  {
    id: 'd9e08',
    no: 8,
    label: 'EVENT 08',
    scene: '従業員の懇親会',
    narrative: '従業員の慰労をかねた懇親会の費用 20,000円を現金で支払いました。',
    quiz: {
      question: '従業員のための福利厚生の費用は、どの勘定で処理する？',
      options: [
        { id: 'a', label: '福利厚生費（費用）' },
        { id: 'b', label: '法定福利費（費用）' },
        { id: 'c', label: '給料（費用）' },
        { id: 'd', label: '諸会費（費用）' },
      ],
      correctId: 'a',
      correctFeedback:
        '法律で義務づけられた社会保険料は「法定福利費」、それ以外の従業員向けの福利厚生（懇親会・慶弔金・お茶代など）は「福利厚生費」です。',
      wrongFeedback:
        '「法定福利費」は社会保険料の会社負担分。会社が任意で行う福利厚生は「福利厚生費」です。',
    },
    plainSummary: '従業員向けの懇親会の費用を払った',
    changes: [
      { accountId: 'welfareExpense', label: '福利厚生費', category: '費用', delta: 20_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -20_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'welfareExpense', label: '福利厚生費', amount: 20_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 20_000 },
    ],
    why: [
      '福利厚生費が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：福利厚生費 ＋2万', bs: 'BS：現金 −2万' },
  },

  {
    id: 'd9e09',
    no: 9,
    label: 'EVENT 09',
    scene: '諸会費',
    narrative: '商工会議所の年会費 12,000円を現金で支払いました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '諸会費（費用）が増え、現金が減った' },
        { id: 'b', label: '租税公課が増えた' },
        { id: 'c', label: '福利厚生費が増えた' },
        { id: 'd', label: '差入保証金が増えた' },
      ],
      correctId: 'a',
      correctFeedback:
        '同業組合や商工会議所などの会費は「諸会費」（費用）でまとめます。',
      wrongFeedback: '団体の年会費は「諸会費」という費用です。',
    },
    plainSummary: '加入している団体の年会費を払った',
    changes: [
      { accountId: 'duesExpense', label: '諸会費', category: '費用', delta: 12_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -12_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'duesExpense', label: '諸会費', amount: 12_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 12_000 },
    ],
    why: [
      '諸会費が増えた → 費用の増加は借方',
      '現金が減った → 資産の減少は貸方',
    ],
    statementImpact: { pl: 'PL：諸会費 ＋1.2万', bs: 'BS：現金 −1.2万' },
  },

  {
    id: 'd9e10',
    no: 10,
    label: 'EVENT 10',
    scene: '誤った記帳（科目ちがい）',
    narrative:
      '事務用品 6,000円を現金で購入しましたが、担当者が誤って「通信費 6,000円 / 現金 6,000円」と記帳してしまいました。',
    quiz: {
      question: 'この記帳、どこが間違っている？',
      options: [
        { id: 'a', label: '科目が違う（正しくは消耗品費）。金額と貸借は合っている' },
        { id: 'b', label: '金額が違う' },
        { id: 'c', label: '貸借が逆' },
        { id: 'd', label: '間違っていない' },
      ],
      correctId: 'a',
      correctFeedback:
        '事務用品はすぐ使い切るので「消耗品費」。担当者は「通信費」で記帳してしまいました。金額 6,000円と貸借の向きは正しいです。',
      wrongFeedback:
        '金額（6,000円）と貸借（借方費用・貸方現金）は正しく、科目だけ「通信費」→「消耗品費」の間違いです。',
    },
    plainSummary: '事務用品の購入を、誤って通信費で記帳してしまった',
    changes: [
      { accountId: 'communication', label: '通信費', category: '費用', delta: 6_000 },
      { accountId: 'cash', label: '現金', category: '資産', delta: -6_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'communication', label: '通信費', amount: 6_000 },
      { side: 'credit', accountId: 'cash', label: '現金', amount: 6_000 },
    ],
    why: [
      'これは「誤った」記帳（次で訂正する）',
      '本来は 消耗品費 6,000 / 現金 6,000 とすべきだった',
    ],
    statementImpact: { pl: 'PL：通信費 ＋6千（誤り）', bs: 'BS：現金 −6千' },
  },

  {
    id: 'd9e11',
    no: 11,
    label: 'EVENT 11',
    scene: '訂正仕訳（科目ちがい）',
    narrative:
      '試算表を見ていて上の誤りに気づきました。「通信費」を「消耗品費」に直す訂正仕訳を切ります。',
    quiz: {
      question: '科目だけを間違えていたとき、訂正仕訳はどうなる？',
      options: [
        { id: 'a', label: '誤った科目（通信費）を減らし、正しい科目（消耗品費）を増やす' },
        { id: 'b', label: '現金をもう一度減らす' },
        { id: 'c', label: 'すべての金額を2倍にする' },
        { id: 'd', label: '売上を減らす' },
      ],
      correctId: 'a',
      correctFeedback:
        '金額も貸借も合っていて科目だけ違うなら、誤った科目を貸方に（＝減らす）、正しい科目を借方に（＝増やす）だけでOKです。現金には触れません。',
      wrongFeedback:
        '現金部分は正しかったので触りません。費用の科目だけ「通信費 → 消耗品費」に振り替えます。',
    },
    plainSummary: '通信費で記帳していたのを、消耗品費に振り替えて直した',
    changes: [
      { accountId: 'suppliesExpense', label: '消耗品費', category: '費用', delta: 6_000 },
      { accountId: 'communication', label: '通信費', category: '費用', delta: -6_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'suppliesExpense', label: '消耗品費', amount: 6_000 },
      { side: 'credit', accountId: 'communication', label: '通信費', amount: 6_000 },
    ],
    why: [
      '消耗品費が増えた → 費用の増加は借方（正しい科目）',
      '通信費が減った → 費用の減少は貸方（誤った科目を取り消す）',
      '（EVENT 10 と合わせると、結局 消耗品費 6,000 / 現金 6,000 になる）',
    ],
    statementImpact: { pl: 'PL：消耗品費 ＋6千、通信費 −6千', bs: '—' },
  },

  {
    id: 'd9e12',
    no: 12,
    label: 'EVENT 12',
    scene: '誤った記帳（金額不足）',
    narrative:
      '得意先から売掛金 50,000円を現金で回収しましたが、誤って「現金 5,000円 / 売掛金 5,000円」と記帳してしまいました。',
    quiz: {
      question: 'この記帳、どこが間違っている？',
      options: [
        { id: 'a', label: '金額が 45,000円不足している（科目と貸借は合っている）' },
        { id: 'b', label: '科目が違う' },
        { id: 'c', label: '貸借が逆' },
        { id: 'd', label: '間違っていない' },
      ],
      correctId: 'a',
      correctFeedback:
        '科目（現金・売掛金）と貸借は正しいのですが、金額を 50,000円とすべきところ 5,000円で記帳しています。45,000円足りません。',
      wrongFeedback:
        '科目・貸借は合っていて、金額だけ 5,000円 → 50,000円の不足（45,000円）です。',
    },
    plainSummary: '売掛金の回収を、金額を少なく（5,000円）記帳してしまった',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 5_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -5_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 5_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 5_000 },
    ],
    why: [
      'これは「金額不足」の記帳（次で訂正する）',
      '本来は 現金 50,000 / 売掛金 50,000 とすべきだった',
    ],
    statementImpact: { bs: 'BS：現金 ＋5千、売掛金 −5千（本来は各5万）' },
  },

  {
    id: 'd9e13',
    no: 13,
    label: 'EVENT 13',
    scene: '訂正仕訳（金額不足）',
    narrative: '上の記帳が 45,000円不足していたので、不足分を追加で計上します。',
    quiz: {
      question: '正しい金額より「少なく」記帳していたとき、訂正仕訳はどうなる？',
      options: [
        { id: 'a', label: '不足額 45,000円を、同じ向きの仕訳で追加する' },
        { id: 'b', label: '正しい金額 50,000円をもう一度全部計上する' },
        { id: 'c', label: '貸借を逆にして取り消す' },
        { id: 'd', label: '売上を追加計上する' },
      ],
      correctId: 'a',
      correctFeedback:
        '向きは合っているので、足りない 45,000円だけを同じ形（現金 / 売掛金）で追加すれば、合計で正しい 50,000円になります。',
      wrongFeedback:
        '最初の 5,000円は正しく入っています。差額 45,000円だけを追加します。',
    },
    plainSummary: '少なく記帳していた売掛金の回収を、不足分だけ追加した',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 45_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -45_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 45_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 45_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方（不足していた分）',
      '売掛金が減った → 資産の減少は貸方',
      '（EVENT 12 と合わせて、正しい 現金 50,000 / 売掛金 50,000 になる）',
    ],
    statementImpact: { bs: 'BS：現金 ＋4.5万、売掛金 −4.5万' },
  },
];

export const DAY9: DayDef = {
  day: 9,
  title: '人を雇うお金と、その他の費用',
  subtitle: '給料の天引き・社会保険料・保険料・福利厚生費、そして訂正仕訳を扱います。',
  focus: ['給料と預り金', '法定福利費', '保険料・福利厚生費・諸会費', '訂正仕訳'],
  events: EVENTS,
  recap: [
    '給料（費用）は天引き前の全額。源泉所得税と社会保険料の本人負担分は「預り金」（負債）',
    '社会保険料の会社負担分は「法定福利費」、任意の福利厚生（懇親会など）は「福利厚生費」',
    '訂正仕訳：科目ちがいは「誤った科目を減らし正しい科目を増やす」、金額不足は「不足分を追加」、貸借逆は「逆仕訳＋正しい仕訳」',
  ],
};
