/**
 * Chart of accounts for the カフェ経営 simulation.
 *
 * 三分法（簿記3級）：仕入・売上 は期中は費用・収益として扱う。
 * `contra: true` … 評価勘定（減価償却累計額・貸倒引当金）。資産のマイナスとして表示する。
 *
 * 並び順が BS / PL の行の並び順になるので、実際の財務諸表に近い順に並べている。
 */

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type Side = 'debit' | 'credit';

export interface AccountDef {
  id: string;
  name: string;
  type: AccountType;
  /** 評価勘定（資産のマイナス）。減価償却累計額・貸倒引当金など。 */
  contra?: boolean;
}

export const ACCOUNTS: Record<string, AccountDef> = {
  // ---------------- 資産 ----------------
  cash: { id: 'cash', name: '現金', type: 'asset' },
  pettyCash: { id: 'pettyCash', name: '小口現金', type: 'asset' },
  checkingDeposit: { id: 'checkingDeposit', name: '当座預金', type: 'asset' },
  ordinaryDeposit: { id: 'ordinaryDeposit', name: '普通預金', type: 'asset' },
  ar: { id: 'ar', name: '売掛金', type: 'asset' },
  allowanceDoubtful: {
    id: 'allowanceDoubtful',
    name: '貸倒引当金',
    type: 'asset',
    contra: true,
  },
  creditAr: { id: 'creditAr', name: 'クレジット売掛金', type: 'asset' },
  notesReceivable: { id: 'notesReceivable', name: '受取手形', type: 'asset' },
  edReceivable: { id: 'edReceivable', name: '電子記録債権', type: 'asset' },
  giftCertReceivable: { id: 'giftCertReceivable', name: '受取商品券', type: 'asset' },
  otherReceivable: { id: 'otherReceivable', name: '未収入金', type: 'asset' },
  accruedRevenue: { id: 'accruedRevenue', name: '未収収益', type: 'asset' },
  prepaid: { id: 'prepaid', name: '前払金', type: 'asset' },
  prepaidExpense: { id: 'prepaidExpense', name: '前払費用', type: 'asset' },
  advancesPaid: { id: 'advancesPaid', name: '立替金', type: 'asset' },
  suspensePaid: { id: 'suspensePaid', name: '仮払金', type: 'asset' },
  prepaidConsumptionTax: {
    id: 'prepaidConsumptionTax',
    name: '仮払消費税',
    type: 'asset',
  },
  prepaidIncomeTax: {
    id: 'prepaidIncomeTax',
    name: '仮払法人税等',
    type: 'asset',
  },
  loansReceivable: { id: 'loansReceivable', name: '貸付金', type: 'asset' },
  notesLoanReceivable: {
    id: 'notesLoanReceivable',
    name: '手形貸付金',
    type: 'asset',
  },
  mercInventory: { id: 'mercInventory', name: '繰越商品', type: 'asset' },
  storableSupplies: { id: 'storableSupplies', name: '貯蔵品', type: 'asset' },
  cashOverShort: { id: 'cashOverShort', name: '現金過不足', type: 'asset' },
  deposits: { id: 'deposits', name: '差入保証金', type: 'asset' },
  equipment: { id: 'equipment', name: '備品', type: 'asset' },
  vehicles: { id: 'vehicles', name: '車両運搬具', type: 'asset' },
  accumDep: {
    id: 'accumDep',
    name: '減価償却累計額',
    type: 'asset',
    contra: true,
  },

  // ---------------- 負債 ----------------
  ap: { id: 'ap', name: '買掛金', type: 'liability' },
  notesPayable: { id: 'notesPayable', name: '支払手形', type: 'liability' },
  edPayable: { id: 'edPayable', name: '電子記録債務', type: 'liability' },
  otherPayable: { id: 'otherPayable', name: '未払金', type: 'liability' },
  accruedExpense: { id: 'accruedExpense', name: '未払費用', type: 'liability' },
  unearned: { id: 'unearned', name: '前受金', type: 'liability' },
  unearnedRevenue: { id: 'unearnedRevenue', name: '前受収益', type: 'liability' },
  depositsReceived: { id: 'depositsReceived', name: '預り金', type: 'liability' },
  suspenseReceived: { id: 'suspenseReceived', name: '仮受金', type: 'liability' },
  receivedConsumptionTax: {
    id: 'receivedConsumptionTax',
    name: '仮受消費税',
    type: 'liability',
  },
  payableConsumptionTax: {
    id: 'payableConsumptionTax',
    name: '未払消費税',
    type: 'liability',
  },
  incomeTaxPayable: {
    id: 'incomeTaxPayable',
    name: '未払法人税等',
    type: 'liability',
  },
  dividendsPayable: {
    id: 'dividendsPayable',
    name: '未払配当金',
    type: 'liability',
  },
  bankOverdraft: { id: 'bankOverdraft', name: '当座借越', type: 'liability' },
  loan: { id: 'loan', name: '借入金', type: 'liability' },
  notesLoanPayable: {
    id: 'notesLoanPayable',
    name: '手形借入金',
    type: 'liability',
  },

  // ---------------- 純資産 ----------------
  capital: { id: 'capital', name: '資本金', type: 'equity' },
  legalReserve: { id: 'legalReserve', name: '利益準備金', type: 'equity' },
  retainedEarnings: {
    id: 'retainedEarnings',
    name: '繰越利益剰余金',
    type: 'equity',
  },
  incomeSummary: { id: 'incomeSummary', name: '損益', type: 'equity' },

  // ---------------- 収益 ----------------
  sales: { id: 'sales', name: '売上', type: 'revenue' },
  interestIncome: { id: 'interestIncome', name: '受取利息', type: 'revenue' },
  feeIncome: { id: 'feeIncome', name: '受取手数料', type: 'revenue' },
  gainOnSaleFA: {
    id: 'gainOnSaleFA',
    name: '固定資産売却益',
    type: 'revenue',
  },
  recoveredBadDebt: {
    id: 'recoveredBadDebt',
    name: '償却債権取立益',
    type: 'revenue',
  },
  miscGain: { id: 'miscGain', name: '雑益', type: 'revenue' },

  // ---------------- 費用 ----------------
  purchases: { id: 'purchases', name: '仕入', type: 'expense' },
  rent: { id: 'rent', name: '支払家賃', type: 'expense' },
  salary: { id: 'salary', name: '給料', type: 'expense' },
  legalWelfare: { id: 'legalWelfare', name: '法定福利費', type: 'expense' },
  utilities: { id: 'utilities', name: '水道光熱費', type: 'expense' },
  suppliesExpense: { id: 'suppliesExpense', name: '消耗品費', type: 'expense' },
  communication: { id: 'communication', name: '通信費', type: 'expense' },
  travel: { id: 'travel', name: '旅費交通費', type: 'expense' },
  advertising: { id: 'advertising', name: '広告宣伝費', type: 'expense' },
  freightExpense: { id: 'freightExpense', name: '発送費', type: 'expense' },
  feeExpense: { id: 'feeExpense', name: '支払手数料', type: 'expense' },
  repairExpense: { id: 'repairExpense', name: '修繕費', type: 'expense' },
  insuranceExpense: { id: 'insuranceExpense', name: '保険料', type: 'expense' },
  welfareExpense: { id: 'welfareExpense', name: '福利厚生費', type: 'expense' },
  duesExpense: { id: 'duesExpense', name: '諸会費', type: 'expense' },
  taxesDues: { id: 'taxesDues', name: '租税公課', type: 'expense' },
  depExpense: { id: 'depExpense', name: '減価償却費', type: 'expense' },
  badDebtProvision: {
    id: 'badDebtProvision',
    name: '貸倒引当金繰入',
    type: 'expense',
  },
  badDebtLoss: { id: 'badDebtLoss', name: '貸倒損失', type: 'expense' },
  lossOnSaleFA: {
    id: 'lossOnSaleFA',
    name: '固定資産売却損',
    type: 'expense',
  },
  interestExpense: { id: 'interestExpense', name: '支払利息', type: 'expense' },
  incomeTaxExpense: { id: 'incomeTaxExpense', name: '法人税等', type: 'expense' },
  miscExpense: { id: 'miscExpense', name: '雑費', type: 'expense' },
  miscLoss: { id: 'miscLoss', name: '雑損', type: 'expense' },
};

export const CATEGORY_LABEL: Record<AccountType, string> = {
  asset: '資産',
  liability: '負債',
  equity: '純資産',
  revenue: '収益',
  expense: '費用',
};

/** The side on which this account TYPE naturally increases (ignores contra). */
export function normalSide(type: AccountType): Side {
  return type === 'asset' || type === 'expense' ? 'debit' : 'credit';
}

/** The side on which THIS account naturally increases (contra accounts are flipped). */
export function accountNormalSide(def: AccountDef): Side {
  const base = normalSide(def.type);
  if (!def.contra) return base;
  return base === 'debit' ? 'credit' : 'debit';
}

export function accountName(id: string): string {
  return ACCOUNTS[id]?.name ?? id;
}
