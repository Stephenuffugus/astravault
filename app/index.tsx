import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { hasOnboarded } from './onboarding';
import { colors } from '@/theme/tokens';

export default function Index() {
  const [decision, setDecision] = useState<'onboarding' | 'hub' | null>(null);

  useEffect(() => {
    hasOnboarded().then((seen) => setDecision(seen ? 'hub' : 'onboarding'));
  }, []);

  if (decision === null) {
    return <View style={styles.splash} />;
  }
  if (decision === 'onboarding') return <Redirect href="/onboarding" />;
  return <Redirect href="/hub" />;
}

const styles = StyleSheet.create({
  splash: { flex: 1, backgroundColor: colors.appBg },
});
