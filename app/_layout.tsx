import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
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

import StarField from '@/components/sky/StarField';
import { Toast } from '@/components/common';
import { hydrateAllStores, useToast } from '@/stores';
import { colors } from '@/theme/tokens';

void SplashScreen.preventAutoHideAsync().catch(() => {});

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

  useEffect(() => {
    hydrateAllStores().finally(() => setStateReady(true));
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
      <SafeAreaProvider>
        <View style={styles.container}>
          <StarField />
          <View style={styles.appLayer}>
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
          </View>
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
