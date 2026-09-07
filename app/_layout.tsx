import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from '@/state/GameContext';
import { colors } from '@/theme';

export default function RootLayout() {
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
