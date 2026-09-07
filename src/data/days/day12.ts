import type { BusinessEvent } from '@/engine/types';
import type { DayDef } from './types';

/**
 * DAY 12 — 決算整理②。
 * 貸倒引当金（差額補充法）/ 減価償却（間接法・定額法）/ 経過勘定（前払・未払・前受・未収）/
 * 償却債権取立益。
 */
const EVENTS: BusinessEvent[] = [
  {
    id: 'd12e01',
    no: 1,
    label: 'EVENT 01',
    scene: '現金売上',
    narrative: 'この日の現金売上は 220,000円でした。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '受取手数料が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '基本の現金売上です。',
      wrongFeedback: 'その場で現金を受け取ったので、現金と売上が増えます。',
    },
    plainSummary: '商品を売って、その場で現金を受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 220_000 },
      { accountId: 'sales', label: '売上', category: '収益', delta: 220_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 220_000 },
      { side: 'credit', accountId: 'sales', label: '売上', amount: 220_000 },
    ],
    why: ['現金が増えた → 資産の増加は借方', '売上が増えた → 収益の増加は貸方'],
    statementImpact: { pl: 'PL：売上 ＋22万', bs: 'BS：現金 ＋22万' },
  },

  {
    id: 'd12e02',
    no: 2,
    label: 'EVENT 02',
    scene: '掛け売上',
    narrative: 'オフィスへ商品 100,000円分を掛けで販売しました。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '売掛金が増え、売上が増えた' },
        { id: 'b', label: '現金が増えた' },
        { id: 'c', label: '未収収益が増えた' },
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
    id: 'd12e03',
    no: 3,
    label: 'EVENT 03',
    scene: '手数料の受取り',
    narrative:
      '取引先の開業をサポートし、業務委託手数料 24,000円（今後半年分）を現金で受け取りました。',
    quiz: {
      question: '商品の売上ではない手数料を受け取ったとき、収益は何になる？',
      options: [
        { id: 'a', label: '受取手数料（収益）' },
        { id: 'b', label: '売上（収益）' },
        { id: 'c', label: '前受金（負債）' },
        { id: 'd', label: '雑益（収益）' },
      ],
      correctId: 'a',
      correctFeedback:
        '商品を売ったわけではないサービスの対価は「受取手数料」（収益）。まず全額を計上し、未経過分は決算で「前受収益」に振り替えます。',
      wrongFeedback:
        '商品売買ではないので「売上」ではなく「受取手数料」（収益）です。',
    },
    plainSummary: 'サポートの手数料を、まとめて現金で受け取った',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 24_000 },
      { accountId: 'feeIncome', label: '受取手数料', category: '収益', delta: 24_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 24_000 },
      { side: 'credit', accountId: 'feeIncome', label: '受取手数料', amount: 24_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '受取手数料が増えた → 収益の増加は貸方',
      'まず全額を収益に。未経過分は決算で前受収益へ',
    ],
    statementImpact: { pl: 'PL：受取手数料 ＋2.4万', bs: 'BS：現金 ＋2.4万' },
  },

  {
    id: 'd12e04',
    no: 4,
    label: 'EVENT 04',
    scene: '償却債権取立益',
    narrative:
      '以前に貸倒れとして処理し、帳簿から消していた売掛金のうち 8,000円を、先方から現金で回収できました。',
    quiz: {
      question: '前に貸倒れ処理した債権を回収できたとき、どう処理する？',
      options: [
        { id: 'a', label: '「償却債権取立益」（収益）で受ける' },
        { id: 'b', label: '売掛金を復活させる' },
        { id: 'c', label: '貸倒損失を減らす' },
        { id: 'd', label: '売上を計上する' },
      ],
      correctId: 'a',
      correctFeedback:
        '過去に費用（貸倒損失など）として処理した債権が回収できたので、「償却債権取立益」という収益で受けます。',
      wrongFeedback:
        '消してしまった売掛金は戻しません。回収額は「償却債権取立益」（収益）です。',
    },
    plainSummary: '前に貸倒れにした売掛金が、あとから回収できた',
    changes: [
      { accountId: 'cash', label: '現金', category: '資産', delta: 8_000 },
      { accountId: 'recoveredBadDebt', label: '償却債権取立益', category: '収益', delta: 8_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'cash', label: '現金', amount: 8_000 },
      { side: 'credit', accountId: 'recoveredBadDebt', label: '償却債権取立益', amount: 8_000 },
    ],
    why: [
      '現金が増えた → 資産の増加は借方',
      '償却債権取立益が増えた → 収益の増加は貸方',
    ],
    statementImpact: { pl: 'PL：償却債権取立益 ＋8千', bs: 'BS：現金 ＋8千' },
  },

  {
    id: 'd12e05',
    no: 5,
    label: 'EVENT 05',
    scene: '現金売上',
    narrative: '週末営業で現金売上が 150,000円ありました。ここから決算整理②に入ります。',
    quiz: {
      question: 'このとき、会社の中では何が起きた？',
      options: [
        { id: 'a', label: '現金が増え、売上が増えた' },
        { id: 'b', label: '売掛金が増えた' },
        { id: 'c', label: '受取手数料が増えた' },
        { id: 'd', label: '費用が減った' },
      ],
      correctId: 'a',
      correctFeedback: '最後の営業ぶんの現金売上。この次から決算整理②です。',
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
    id: 'd12e06',
    no: 6,
    label: 'EVENT 06',
    scene: '【決算整理】貸倒引当金の設定',
    narrative:
      '決算日、期末の売掛金・電子記録債権の合計 500,000円について、過去の実績から 2%（10,000円）が貸倒れると見積もりました。貸倒引当金の残高は 0円です。',
    quiz: {
      question: '差額補充法で貸倒引当金を設定するとき、いくら繰り入れる？',
      options: [
        { id: 'a', label: '見積額 10,000円 − 残高 0円 ＝ 10,000円を繰り入れる' },
        { id: 'b', label: '売掛金の全額 500,000円' },
        { id: 'c', label: '繰り入れは不要' },
        { id: 'd', label: '2,000円だけ' },
      ],
      correctId: 'a',
      correctFeedback:
        '差額補充法は「見積額 − 現在の引当金残高」を繰り入れます。今回は残高 0円なので、10,000円をまるごと「貸倒引当金繰入」（費用）で計上し、「貸倒引当金」（資産のマイナス）を積みます。',
      wrongFeedback:
        '設定するのは見積額と現在残高の差額。今回は残高 0 なので 10,000円です。',
    },
    plainSummary: '将来の貸倒れに備えて、引当金を積んだ',
    changes: [
      { accountId: 'badDebtProvision', label: '貸倒引当金繰入', category: '費用', delta: 10_000 },
      { accountId: 'allowanceDoubtful', label: '貸倒引当金', category: '資産(−)', delta: 10_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'badDebtProvision', label: '貸倒引当金繰入', amount: 10_000 },
      { side: 'credit', accountId: 'allowanceDoubtful', label: '貸倒引当金', amount: 10_000 },
    ],
    why: [
      '貸倒引当金繰入が増えた → 費用の増加は借方',
      '貸倒引当金が増えた → 資産のマイナス（評価勘定）なので貸方',
      '差額補充法：見積額 − 現在の残高 だけ繰り入れる',
    ],
    statementImpact: {
      pl: 'PL：貸倒引当金繰入 ＋1万',
      bs: 'BS：貸倒引当金 △1万（売掛金を実質的に減らす）',
    },
  },

  {
    id: 'd12e07',
    no: 7,
    label: 'EVENT 07',
    scene: '引当金があるときの貸倒れ',
    narrative:
      '引当金の設定直後、得意先の1社が倒産し、売掛金 6,000円が回収不能になりました。',
    quiz: {
      question: '貸倒引当金があるとき、売掛金が貸倒れたら？',
      options: [
        { id: 'a', label: 'まず貸倒引当金を取り崩す（足りない分だけ貸倒損失）' },
        { id: 'b', label: '全額を貸倒損失（費用）にする' },
        { id: 'c', label: '売上を減らす' },
        { id: 'd', label: '貸倒引当金繰入を増やす' },
      ],
      correctId: 'a',
      correctFeedback:
        '前もって積んでおいた「貸倒引当金」で受け止めます。引当金の残高（10,000円）で足りるので、6,000円を取り崩し、売掛金を消します。（引当金が足りなければ、超えた分だけ貸倒損失）',
      wrongFeedback:
        '引当金があるので、まず引当金を取り崩します。足りない分だけ貸倒損失です。',
    },
    plainSummary: '積んでいた引当金を使って、貸倒れを処理した',
    changes: [
      { accountId: 'allowanceDoubtful', label: '貸倒引当金', category: '資産(−)', delta: -6_000 },
      { accountId: 'ar', label: '売掛金', category: '資産', delta: -6_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'allowanceDoubtful', label: '貸倒引当金', amount: 6_000 },
      { side: 'credit', accountId: 'ar', label: '売掛金', amount: 6_000 },
    ],
    why: [
      '貸倒引当金が減った → 評価勘定の減少は借方',
      '売掛金が減った → 資産の減少は貸方',
      '引当金で足りない分だけ「貸倒損失」（費用）にする',
    ],
    statementImpact: { bs: 'BS：貸倒引当金 −6千、売掛金 −6千' },
  },

  {
    id: 'd12e08',
    no: 8,
    label: 'EVENT 08',
    scene: '【決算整理】減価償却（車両運搬具）',
    narrative:
      '配達用バイク（車両運搬具・取得原価 320,000円、耐用年数 4年、残存価額ゼロ、定額法）の当期1年分の減価償却を行います。',
    quiz: {
      question: '定額法での当期の減価償却費はいくら？（間接法で記帳）',
      options: [
        { id: 'a', label: '320,000円 ÷ 4年 ＝ 80,000円（減価償却費／減価償却累計額）' },
        { id: 'b', label: '320,000円をそのまま費用にする' },
        { id: 'c', label: '車両運搬具を 80,000円直接減らす' },
        { id: 'd', label: '減価償却は不要' },
      ],
      correctId: 'a',
      correctFeedback:
        '定額法は「取得原価 ÷ 耐用年数」。80,000円を「減価償却費」（費用）にし、間接法では車両そのものは減らさず「減価償却累計額」（資産のマイナス）を積みます。',
      wrongFeedback:
        '1年ぶんは 取得原価 ÷ 耐用年数 ＝ 80,000円。間接法なので累計額に積みます。',
    },
    plainSummary: 'バイクを1年使った価値の減りを、費用に計上した（間接法）',
    changes: [
      { accountId: 'depExpense', label: '減価償却費', category: '費用', delta: 80_000 },
      { accountId: 'accumDep', label: '減価償却累計額', category: '資産(−)', delta: 80_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'depExpense', label: '減価償却費', amount: 80_000 },
      { side: 'credit', accountId: 'accumDep', label: '減価償却累計額', amount: 80_000 },
    ],
    why: [
      '減価償却費が増えた → 費用の増加は借方',
      '減価償却累計額が増えた → 評価勘定なので貸方',
      '間接法：固定資産そのものは減らさず、累計額を積む',
    ],
    statementImpact: {
      pl: 'PL：減価償却費 ＋8万',
      bs: 'BS：減価償却累計額 △8万（車両の帳簿価額が下がる）',
    },
  },

  {
    id: 'd12e09',
    no: 9,
    label: 'EVENT 09',
    scene: '【決算整理】減価償却（備品）',
    narrative:
      '備品（取得原価 500,000円、耐用年数 5年、残存価額ゼロ、定額法）の当期1年分の減価償却を行います。',
    quiz: {
      question: '備品の当期の減価償却費はいくら？',
      options: [
        { id: 'a', label: '500,000円 ÷ 5年 ＝ 100,000円' },
        { id: 'b', label: '500,000円' },
        { id: 'c', label: '50,000円' },
        { id: 'd', label: '不要' },
      ],
      correctId: 'a',
      correctFeedback:
        '500,000円 ÷ 5年 ＝ 100,000円。車両と同じく、減価償却費（費用）と減価償却累計額（資産のマイナス）に計上します。',
      wrongFeedback: '取得原価 ÷ 耐用年数 ＝ 100,000円です。',
    },
    plainSummary: '備品を1年使った価値の減りを、費用に計上した',
    changes: [
      { accountId: 'depExpense', label: '減価償却費', category: '費用', delta: 100_000 },
      { accountId: 'accumDep', label: '減価償却累計額', category: '資産(−)', delta: 100_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'depExpense', label: '減価償却費', amount: 100_000 },
      { side: 'credit', accountId: 'accumDep', label: '減価償却累計額', amount: 100_000 },
    ],
    why: [
      '減価償却費が増えた → 費用の増加は借方',
      '減価償却累計額が増えた → 評価勘定なので貸方',
    ],
    statementImpact: {
      pl: 'PL：減価償却費 ＋10万',
      bs: 'BS：減価償却累計額 △10万',
    },
  },

  {
    id: 'd12e10',
    no: 10,
    label: 'EVENT 10',
    scene: '【決算整理】費用の前払い',
    narrative:
      'DAY 9 で支払った火災保険料 36,000円（1年分）のうち、決算日時点で 3か月分 9,000円がまだ経過していません。',
    quiz: {
      question: 'まだ経過していない期間の保険料 9,000円は、どうする？',
      options: [
        { id: 'a', label: '保険料（費用）を減らし、「前払費用」（資産）に振り替える' },
        { id: 'b', label: 'そのまま保険料にしておく' },
        { id: 'c', label: '前受収益（負債）にする' },
        { id: 'd', label: '未払費用（負債）にする' },
      ],
      correctId: 'a',
      correctFeedback:
        '来期にかかる分を今期の費用にしてはいけません。当期の「保険料」を 9,000円減らし、「前払費用」（資産）として繰り越します。',
      wrongFeedback:
        '未経過分は来期の費用。当期の費用から外して「前払費用」（資産）にします。',
    },
    plainSummary: '払いすぎた保険料（来期分）を、資産に繰り延べた',
    changes: [
      { accountId: 'prepaidExpense', label: '前払費用', category: '資産', delta: 9_000 },
      { accountId: 'insuranceExpense', label: '保険料', category: '費用', delta: -9_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'prepaidExpense', label: '前払費用', amount: 9_000 },
      { side: 'credit', accountId: 'insuranceExpense', label: '保険料', amount: 9_000 },
    ],
    why: [
      '前払費用が増えた → 資産の増加は借方',
      '保険料が減った → 費用の減少は貸方',
      '「時間が経っていない分」は当期の費用にしない',
    ],
    statementImpact: { pl: 'PL：保険料 −9千', bs: 'BS：前払費用 ＋9千' },
  },

  {
    id: 'd12e11',
    no: 11,
    label: 'EVENT 11',
    scene: '【決算整理】費用の未払い',
    narrative:
      '借入金の利息のうち、決算日までに発生しているのにまだ支払っていない分が 4,000円あります。',
    quiz: {
      question: '発生しているのに未払いの利息 4,000円は、どうする？',
      options: [
        { id: 'a', label: '支払利息（費用）を増やし、「未払費用」（負債）を計上する' },
        { id: 'b', label: '来期に払うので今は何もしない' },
        { id: 'c', label: '前払費用（資産）にする' },
        { id: 'd', label: '借入金を増やす' },
      ],
      correctId: 'a',
      correctFeedback:
        '時間が経った分の費用は、まだ払っていなくても当期の費用にします。「支払利息」を増やし、相手科目は「未払費用」（負債）です。',
      wrongFeedback:
        '発生しているなら当期の費用。まだ払っていない分は「未払費用」（負債）で計上します。',
    },
    plainSummary: '発生済みだが未払いの利息を、費用に追加計上した',
    changes: [
      { accountId: 'interestExpense', label: '支払利息', category: '費用', delta: 4_000 },
      { accountId: 'accruedExpense', label: '未払費用', category: '負債', delta: 4_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'interestExpense', label: '支払利息', amount: 4_000 },
      { side: 'credit', accountId: 'accruedExpense', label: '未払費用', amount: 4_000 },
    ],
    why: [
      '支払利息が増えた → 費用の増加は借方',
      '未払費用が増えた → 負債の増加は貸方',
      '「時間が経った分」は払っていなくても当期の費用',
    ],
    statementImpact: { pl: 'PL：支払利息 ＋4千', bs: 'BS：未払費用 ＋4千' },
  },

  {
    id: 'd12e12',
    no: 12,
    label: 'EVENT 12',
    scene: '【決算整理】収益の前受け',
    narrative:
      'EVENT 03 で受け取った手数料 24,000円のうち、決算日時点でまだ提供していない期間の分が 8,000円あります。',
    quiz: {
      question: 'まだ提供していない期間の手数料 8,000円は、どうする？',
      options: [
        { id: 'a', label: '受取手数料（収益）を減らし、「前受収益」（負債）に振り替える' },
        { id: 'b', label: 'そのまま受取手数料にしておく' },
        { id: 'c', label: '前払費用（資産）にする' },
        { id: 'd', label: '未収収益（資産）にする' },
      ],
      correctId: 'a',
      correctFeedback:
        'まだサービスを提供していない期間の分は、来期の収益。当期の「受取手数料」を 8,000円減らし、「前受収益」（負債）として繰り越します。',
      wrongFeedback:
        '未提供の期間の分は来期の収益。当期の収益から外して「前受収益」（負債）にします。',
    },
    plainSummary: '先にもらいすぎた手数料（来期分）を、負債に繰り延べた',
    changes: [
      { accountId: 'feeIncome', label: '受取手数料', category: '収益', delta: -8_000 },
      { accountId: 'unearnedRevenue', label: '前受収益', category: '負債', delta: 8_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'feeIncome', label: '受取手数料', amount: 8_000 },
      { side: 'credit', accountId: 'unearnedRevenue', label: '前受収益', amount: 8_000 },
    ],
    why: [
      '受取手数料が減った → 収益の減少は借方',
      '前受収益が増えた → 負債の増加は貸方',
      '「時間が経っていない分」は当期の収益にしない',
    ],
    statementImpact: { pl: 'PL：受取手数料 −8千', bs: 'BS：前受収益 ＋8千' },
  },

  {
    id: 'd12e13',
    no: 13,
    label: 'EVENT 13',
    scene: '【決算整理】収益の未収',
    narrative:
      '貸付金の利息のうち、決算日までに発生しているのにまだ受け取っていない分が 3,000円あります。',
    quiz: {
      question: '発生しているのに未収の利息 3,000円は、どうする？',
      options: [
        { id: 'a', label: '受取利息（収益）を増やし、「未収収益」（資産）を計上する' },
        { id: 'b', label: '来期に受け取るので今は何もしない' },
        { id: 'c', label: '前受収益（負債）にする' },
        { id: 'd', label: '貸付金を増やす' },
      ],
      correctId: 'a',
      correctFeedback:
        '時間が経った分の収益は、まだ受け取っていなくても当期の収益にします。「受取利息」を増やし、相手科目は「未収収益」（資産）です。',
      wrongFeedback:
        '発生しているなら当期の収益。まだ受け取っていない分は「未収収益」（資産）で計上します。',
    },
    plainSummary: '発生済みだが未収の利息を、収益に追加計上した',
    changes: [
      { accountId: 'accruedRevenue', label: '未収収益', category: '資産', delta: 3_000 },
      { accountId: 'interestIncome', label: '受取利息', category: '収益', delta: 3_000 },
    ],
    journal: [
      { side: 'debit', accountId: 'accruedRevenue', label: '未収収益', amount: 3_000 },
      { side: 'credit', accountId: 'interestIncome', label: '受取利息', amount: 3_000 },
    ],
    why: [
      '未収収益が増えた → 資産の増加は借方',
      '受取利息が増えた → 収益の増加は貸方',
      '「時間が経った分」は受け取っていなくても当期の収益',
    ],
    statementImpact: { pl: 'PL：受取利息 ＋3千', bs: 'BS：未収収益 ＋3千' },
  },
];

export const DAY12: DayDef = {
  day: 12,
  title: '決算整理②',
  subtitle: '貸倒引当金・減価償却・経過勘定（前払・未払・前受・未収）を扱います。',
  focus: ['貸倒引当金（差額補充法）', '減価償却（間接法）', '経過勘定'],
  events: EVENTS,
  recap: [
    '貸倒引当金は差額補充法：見積額 − 現在の残高だけ繰り入れる。貸倒れ時はまず引当金を取り崩す',
    '減価償却（定額法）＝ 取得原価 ÷ 耐用年数。間接法は「減価償却累計額」（資産のマイナス）を積む',
    '経過勘定：前払費用・前受収益は「まだ時間が経っていない分」を来期へ／未払費用・未収収益は「もう時間が経った分」を当期に足す',
  ],
};
