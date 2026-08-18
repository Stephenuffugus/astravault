import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  CrimsonPro_400Regular,
  CrimsonPro_400Regular_Italic,
  CrimsonPro_600SemiBold,
  useFonts as useCrimsonPro,
} from '@expo-google-fonts/crimson-pro';
import {
  DMMono_300Light,
  DMMono_400Regular,
  DMMono_500Medium,
  useFonts as useDMMono,
} from '@expo-google-fonts/dm-mono';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
  useFonts as usePlayfair,
} from '@expo-google-fonts/playfair-display';

import GateScreen from '@/components/GateScreen';
import StarField from '@/components/sky/StarField';
import { Toast } from '@/components/common';
import { hydrateAllStores, useDevGate, useNightVision, useToast } from '@/stores';
import { colors } from '@/theme/tokens';

void SplashScreen.preventAutoHideAsync().catch(() => {});

/* The app is dark regardless of the viewer's system theme. Without this,
   react-navigation follows prefers-color-scheme and paints its light scene
   background (#f2f2f2) over the StarField for light-mode browsers. */
const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: 'transparent' },
};

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.style.backgroundColor = colors.appBg;
  document.body.style.backgroundColor = colors.appBg;
}

export default function RootLayout() {
  const [crimsonLoaded] = useCrimsonPro({
    CrimsonPro_400Regular,
    CrimsonPro_600SemiBold,
    CrimsonPro_400Regular_Italic,
  });
  const [monoLoaded] = useDMMono({
    DMMono_300Light,
    DMMono_400Regular,
    DMMono_500Medium,
  });
  const [playfairLoaded] = usePlayfair({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
  });

  const [stateReady, setStateReady] = useState(false);
  const toastMessage = useToast((s) => s.message);
  const toastVariant = useToast((s) => s.variant);
  const nightVision = useNightVision((s) => s.enabled);
  const gateUnlocked = useDevGate((s) => s.unlocked);

  useEffect(() => {
    hydrateAllStores().finally(() => setStateReady(true));
  }, []);

  /* Night vision: one CSS filter pushes the whole page into dim red so the
     screen stops wrecking dark-adapted eyes. Web only; native will get a
     proper red theme with the native build. */
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.style.filter = nightVision
      ? 'grayscale(1) sepia(1) saturate(6) hue-rotate(-50deg) brightness(0.8)'
      : '';
  }, [nightVision]);

  useEffect(() => {
    if (Platform.OS === 'web' && !__DEV__ && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/astravault/sw.js').catch(() => {});
    }
  }, []);

  const fontsLoaded = crimsonLoaded && monoLoaded && playfairLoaded;

  useEffect(() => {
    if (fontsLoaded && stateReady) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, stateReady]);

  if (!fontsLoaded || !stateReady) {
    return <View style={styles.bootSplash} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <Head>
        <title>Astra Vault</title>
      </Head>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StarField />
          {!gateUnlocked ? (
            <View style={styles.appLayer}>
              <GateScreen />
            </View>
          ) : (
          <View style={styles.appLayer}>
            <ThemeProvider value={navTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen
                name="lesson/[id]"
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="object/[id]"
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="bortle"
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen
                name="captures"
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="scopes"
                options={{ presentation: 'card' }}
              />
            </Stack>
            </ThemeProvider>
          </View>
          )}
          <Toast message={toastMessage} variant={toastVariant} />
          <StatusBar style="light" />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bootSplash: { flex: 1, backgroundColor: colors.appBg },
  container: { flex: 1, backgroundColor: colors.appBg },
  appLayer: { flex: 1, zIndex: 1 },
});
