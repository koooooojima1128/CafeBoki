import { Platform, Text, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from '@/state/GameContext';
import { colors, ff } from '@/theme';

// Make the rounded gothic the default for every <Text> / <TextInput>.
const T = Text as unknown as { defaultProps?: Record<string, unknown> };
T.defaultProps = { ...T.defaultProps, style: { fontFamily: ff.regular } };
const TI = TextInput as unknown as { defaultProps?: Record<string, unknown> };
TI.defaultProps = { ...TI.defaultProps, style: { fontFamily: ff.regular } };

export default function RootLayout() {
  // native bundles the .ttf; web loads the family from Google Fonts instead
  useFonts(
    Platform.OS === 'web'
      ? {}
      : {
          MPLUSRounded1c: require('../assets/fonts/MPLUSRounded1c-Regular.ttf'),
          MPLUSRounded1cExtraBold: require('../assets/fonts/MPLUSRounded1c-ExtraBold.ttf'),
        },
  );

  return (
    <SafeAreaProvider>
      <Head>
        <title>カフェ簿記｜商売を通して学ぶ簿記3級</title>
        <meta
          name="description"
          content="カフェのオーナーになって、開業から決算までの1年ぶんの商売を体験。簿記3級の“なぜその仕訳か”がわかる学習シミュレーター。"
        />
      </Head>
      <GameProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="status" options={{ presentation: 'modal' }} />
        </Stack>
      </GameProvider>
    </SafeAreaProvider>
  );
}
