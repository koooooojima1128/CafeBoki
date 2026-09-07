# カフェ簿記 (boki-app)

簿記という言語を、商売（カフェ経営）を通して理解するシミュレーター。

カフェのオーナーになって開業〜1日分の商売を体験し、
「何が起きた？」→「会社の何が変わった？」→「簿記でどう書く？」→「PL / BS への影響」
の順で仕訳が生まれる理由を体で覚えます。

## 技術構成

- **Expo (SDK 52)** + **expo-router** — 1つのコードベースで **Web** と **iOS**（Android も）に対応
- React Native + `react-native-web`
- TypeScript / 状態は React Context + `AsyncStorage` で進捗を保存
- 「簿記翻訳エンジン」は `src/engine` に分離（勘定科目・元帳・PL/BS 計算）
- 商売イベントのデータは `src/data/days/`（DAY ごとに 1 ファイル。すべて静的データ・AI なし）

## セットアップ

```bash
npm install
```

インストール後に依存バージョンの警告が出たら:

```bash
npx expo install --fix
```

## 実行

### Web（Windows / Mac どちらでも）

```bash
npm run web
```

ブラウザで `http://localhost:8081` が開きます。

### iOS

- **iPhone 実機**: `npm start` して、表示された QR コードを **Expo Go** アプリで読み取り（PC と iPhone が同じ Wi-Fi にいること）
- **iOS シミュレータ**: Mac + Xcode が必要。`npm run ios`
  （Windows では iOS シミュレータは使えないため、実機 + Expo Go を使ってください）

### Web の静的ビルド

```bash
npm run build:web    # expo export → dist/ ＋ dist/404.html を生成
node scripts/serve-dist.mjs   # dist/ を http://localhost:4477 で確認（Vercel 相当の挙動）
```

## Vercel へのデプロイ

`vercel.json` 済み（buildCommand `npm run build:web` / outputDirectory `dist` / `cleanUrls`）。
パスパラメータの動的ルートは無く、全ページが静的 HTML。未マッチは `dist/404.html`。

**方法A — Vercel CLI（GitHub 不要）**

```bash
npm i -g vercel
vercel login
vercel          # 初回：数問答えて Preview URL がデプロイされる
vercel --prod   # 本番（<project>.vercel.app）に反映
```

**方法B — GitHub 連携（継続運用向け）**

```bash
git init && git add -A && git commit -m "カフェ簿記 v1"
gh repo create boki-app --private --source=. --push
```

その後 vercel.com → Add New → Project → リポジトリを import。`vercel.json` を自動検出。
以降 `main` への push で自動デプロイ。

**デプロイ後にやること**

- `src/config.ts` の `APP_URL` を本番 URL に（ネイティブ共有リンク用。Web は自動）
- `STUDYING_URL` を本物のアフィリエイトリンクに
- `src/legal.ts` / `docs/*.md` の事業者情報プレースホルダを埋める
- Node バージョンでビルドが失敗する場合は Vercel の Project Settings → Node.js Version を 20.x に

## 型チェック

```bash
npm run typecheck
```

## 画面

| ルート | 画面 | 内容 |
| --- | --- | --- |
| `/` | ホーム | 正答率メーター・DAY 一覧（ロック／進行中／クリア）・各種リンク |
| `/onboarding` | 使い方 | 3枚のスライド |
| `/play` | シミュレーション | `currentDay` のイベント × (何が起きた？ → 会社の変化 → 仕訳) |
| `/status` | 会社の現在地 | ここまで確定した取引の累計 BS（モーダル） |
| `/settlement` | 決算 | その日の PL ＋ 累計 BS ＋ 残高試算表。DAY 14 は「帳簿の締め」（BS／繰越試算表のみ） |
| `/clear` | DAY N CLEAR | 成績・称号・まとめ・次の DAY への導線・スタディング CTA |
| `/cert` | 成績表 / 修了証 | 称号・スコア・スタンプの証明カード。テキスト＆画像でシェア。`?d=` 付きで他人の証明カードを表示 |
| `/review` | ふりかえる | まちがい直し／ランダム総復習／**仕訳入力ドリル**（成績には影響しない） |
| `/journal-book` | 仕訳日記帳 | これまでにつくった全仕訳を DAY ごとに一覧 |
| `/reference` | 勘定科目じてん | 借方・貸方チートシート＋全科目（意味つき）。行タップで T字勘定へ |
| `/ledger` | 総勘定元帳（T字） | `?acct=<id>` の勘定の記入を T字＋残高で表示 |
| `/notes` | 学んだことノート | クリアした DAY の要点（recap）をまとめて閲覧 |
| `/transfer` | 進捗の引き継ぎ | 進捗を1つのコードに書き出し／読み込み（`src/transfer.ts`、base64） |

## DAY（コンテンツ）

**DAY 1〜14 で簿記3級の範囲をひととおり一周**。すべて `src/data/days/` の静的データ。
DAY を増やすときは新しい `dayN.ts` を追加して `src/data/days/index.ts` の `DAYS` 配列に足すだけ。
各イベントの仕訳は貸借一致で組むこと（→ 累計 BS は自動的に釣り合う）。

| DAY | テーマ | 主な論点 |
| --- | --- | --- |
| 1 | カフェをはじめる | 資本金 / 仕入・売上 / 掛け取引 / 経費・設備・借入 |
| 2 | お金の置き場所と、貸し借り | 普通預金 / 前払金・前受金 / 手形 / 貸付金・利息 |
| 3 | こまかい経費と、人を雇うお金 | 消耗品費・通信費・旅費交通費 / 立替金・預り金 / 仮払金・仮受金 / 現金過不足 |
| 4 | 商品売買のこまかい処理 | 返品・値引き / 仕入・売上の諸掛り / クレジット売掛金 / 受取商品券 |
| 5 | 現金・預金をきちんと管理する | 当座預金・小切手 / 小口現金 / 当座借越 / 電子記録債権・債務 |
| 6 | いろいろな債権・債務 | 未収入金・未払金 / 手形貸付金・手形借入金 / 当期の貸倒れ |
| 7 | 固定資産 | 取得原価（付随費用）/ 資本的支出・収益的支出 / 売却損益 |
| 8 | 株式会社のお金と、税金 | 増資 / 租税公課 / 消費税（税抜方式）/ 法人税等 |
| 9 | 人を雇うお金と、その他の費用 | 給料と預り金 / 法定福利費 / 保険料・福利厚生費・諸会費 / 訂正仕訳 |
| 10 | 試算表と、決算の準備 | 残高試算表 / 借方合計＝貸方合計 / 現金過不足 |
| 11 | 決算整理① | 現金過不足→雑損／雑益 / 貯蔵品 / 売上原価の算定（しくりくりし）|
| 12 | 決算整理② | 貸倒引当金（差額補充法）/ 減価償却（間接法）/ 経過勘定 |
| 13 | 精算表と財務諸表 | 精算表の流れ / 収益費用は P/L・資産負債純資産は B/S |
| 14 | 帳簿を締める | 決算振替仕訳 / 当期純利益→繰越利益剰余金 / 剰余金の配当 / 繰越試算表 |

`scripts/verify.ts`（`npx tsx scripts/verify.ts`）で全 DAY の仕訳の貸借一致と累計 BS の一致を検証できる。

## 特典（スコア・称号・修了証）

すべて静的（サーバー・アカウント・AI なし）。`src/score.ts` の純粋関数で `answers` /
`completedDays` から算出。

- **スコア**：全イベントに対する一発正解率 × 100
- **称号**：見習い → 丁稚 → 手代 → 番頭 → 支配人 → 大旦那（`src/score.ts` の `RANKS` を編集すれば全画面に反映）
- **DAYごとの ★1〜3**、**バッジ**（各DAYクリア／満点DAY／完走）
- **修了証カード**（`app/cert.tsx` + `src/components/CertCard.tsx`）
  - iOS：画像化（`react-native-view-shot`）→ 共有シート（`expo-sharing`）
  - Web：画像ダウンロード（`html2canvas`）＋ テキスト共有（Web Share / クリップボード）
  - 共有リンク `…/cert?d=<エンコード>`（`src/cert.ts`）で他人の証明カードを表示。※自己申告のカード

## アイコン

`assets/icon-src.svg` / `assets/icon-foreground-src.svg` が元データ。
`node scripts/gen-icons.mjs`（要 `sharp`）で `assets/{icon,adaptive-icon,splash-icon,favicon}.png`
を再生成。`app.json` の `icon` / `android.adaptiveIcon` / `web.favicon` / `expo-splash-screen`
プラグインで参照。ブランドカラー: teal `#2E7D6B` ／ cream `#FBF7EC`。

## 法務ドキュメント

- アプリ内: `/privacy`（プライバシーポリシー）・`/terms`（利用規約）。本文は `src/legal.ts`
- ホスティング用ミラー: `docs/privacy-policy.md` / `docs/terms-of-service.md`（内容を同期させること）
- **公開前に必ず**: `[事業者名]` `[お問い合わせ先メールアドレス]` `[　　　]地方裁判所` を埋める。
  アフィリエイト（広告）表記・免責条項は専門家レビュー推奨
- スタディングへのリンクは `studyingUrl(placement)` 経由（`?ref=bokiapp&placement=...` を付与）。
  clear 画面に「広告（アフィリエイト）」ラベルと紹介料の明示（ステマ規制対応）

## launch 前に差し替えるもの

- `src/config.ts` の `STUDYING_URL` … スタディングのアフィリエイトリンク
- `src/config.ts` の `APP_URL` … デプロイ先の公開URL（iOS からの共有リンク用。Web は自動）
- `app.json` の `ios.bundleIdentifier` / `android.package`（現在 `com.example.bokiapp`）
- `src/legal.ts` / `docs/*.md` の事業者情報プレースホルダ

## 学習ツール（全部ローカル・AI なし）

- **ストリーク**（`streakDays` in `src/score.ts`）: 連続学習日数。ホームの正答率カードに表示
- **リセット確認**: `src/components/ConfirmModal.tsx`（破壊的操作の共通ダイアログ）
- **仕訳入力ドリル**: `src/components/AccountPicker.tsx` で科目を選び金額を入力 → `event.journal` と突き合わせ採点
- 共通化: 出題フローの3画面は `src/components/eventViews.tsx`（play と review が共用）

## 次のステップ（未実装）

補助簿、複数業種、簿記2級レイヤー、ダークモード、アプリアイコン、iOS 実機テスト。
方針として **AI は組み込まない**（すべて静的データで完結）。
エンジンの `BusinessEvent` / `DayDef` 型はそのまま拡張できます。
