import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radii, spacing, typography } from '@/theme/tokens';

const ONBOARD_KEY = 'astravault:onboarded_v1';

export const markOnboarded = async (): Promise<void> => {
  await AsyncStorage.setItem(ONBOARD_KEY, '1');
};

export const hasOnboarded = async (): Promise<boolean> =>
  (await AsyncStorage.getItem(ONBOARD_KEY)) === '1';

const FEATURES: Array<{ icon: string; label: string; description: string }> = [
  { icon: '🌍', label: 'Shared Sky', description: 'See the community' },
  { icon: '◎', label: 'Scan', description: 'Explore & collect' },
  { icon: '◆', label: 'Vault', description: 'Your collection' },
  { icon: '🎓', label: 'Learn', description: '24 lessons' },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const begin = async () => {
    await markOnboarded();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✦</Text>
      <Text style={styles.title}>Astra Vault</Text>
      <Text style={styles.tagline}>
        Scan the cosmos. Learn real astronomy. Join thousands of observers sharing tonight's sky.
        No accounts needed. No chat. Just the stars and everyone looking up at them.
      </Text>

      <View style={styles.featureGrid}>
        {FEATURES.map((f) => (
          <View key={f.label} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureLabel}>{f.label}</Text>
            <Text style={styles.featureDesc}>{f.description}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.beginButton} onPress={begin}>
        <Text style={styles.beginText}>BEGIN</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 44,
    color: colors.text.primary,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    color: colors.text.primary,
    fontFamily: typography.fonts.heading,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    color: colors.text.dim,
    fontFamily: typography.fonts.body,
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 22,
    marginBottom: 26,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 360,
    marginBottom: 28,
  },
  featureCard: {
    flexBasis: '22%',
    minWidth: 76,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
  },
  featureIcon: { fontSize: 20, marginBottom: 4 },
  featureLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontFamily: typography.fonts.mono,
    letterSpacing: 1,
    fontWeight: '600',
  },
  featureDesc: {
    fontSize: 8,
    color: colors.text.ghost,
    fontFamily: typography.fonts.mono,
    marginTop: 2,
    textAlign: 'center',
  },
  beginButton: {
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
    backgroundColor: 'rgba(96,165,250,0.08)',
  },
  beginText: {
    fontSize: 12,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
