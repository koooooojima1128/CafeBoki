import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * The HTML shell for every statically-rendered web page.
 * (Only affects web; native is unaffected.)
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>カフェ簿記｜商売を通して学ぶ簿記3級</title>
        <meta
          name="description"
          content="カフェのオーナーになって、開業から決算までの1年ぶんの商売を体験。「何が起きた？→会社の変化→仕訳→財務諸表」の順で、簿記3級の“なぜその仕訳か”がわかる学習シミュレーター。"
        />
        <meta property="og:title" content="カフェ簿記" />
        <meta
          property="og:description"
          content="カフェ経営で簿記3級を一周。仕訳が“なぜそうなるか”がわかる。"
        />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#2E7D6B" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
