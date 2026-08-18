import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, radii, spacing, typography } from '@/theme/tokens';

const ONBOARD_KEY = 'astravault:onboarded_v1';

export const markOnboarded = async (): Promise<void> => {
  await AsyncStorage.setItem(ONBOARD_KEY, '1');
};

export const hasOnboarded = async (): Promise<boolean> =>
  (await AsyncStorage.getItem(ONBOARD_KEY)) === '1';

/* Beta feedback, Stephen, day one: "the entire app is pretty vague and im
   confused about what does what." This screen owns the fix: every tab gets
   a real sentence, in reading-size type, before anyone is dropped into the
   app. */
const FEATURES: Array<{ icon: string; label: string; description: string }> = [
  {
    icon: '◎',
    label: 'Scan',
    description:
      'Drag across the night sky, tap a star or planet, and collect it. Planets sit where they really are tonight.',
  },
  {
    icon: '◆',
    label: 'Vault',
    description:
      'Your collection. Every object you collect is kept here, from common stars to legendary rarities.',
  },
  {
    icon: '☾',
    label: 'Hub',
    description:
      "Tonight's sky at a glance: observing conditions, the moon, NASA's photo of the day, and live rocket launches.",
  },
  {
    icon: '🎓',
    label: 'Learn',
    description:
      'Short astronomy lessons with a quick quiz at the end. Real science, plainly told.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();

  const begin = async () => {
    await markOnboarded();
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>✦</Text>
      <Text style={styles.title}>Astra Vault</Text>
      <Text style={styles.tagline}>
        Scan the cosmos. Collect the sky. No accounts, no ads.
      </Text>

      <View style={styles.featureList}>
        {FEATURES.map((f) => (
          <View key={f.label} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureBody}>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.stardustNote}>
        Everything you do earns ✦ Stardust. It is your score, plain and simple,
        and it never costs or buys a thing.
      </Text>

      <Pressable style={styles.beginButton} onPress={begin}>
        <Text style={styles.beginText}>BEGIN</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.pageX,
    paddingVertical: 40,
  },
  logo: {
    fontSize: 44,
    color: colors.text.primary,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    color: colors.text.primary,
    fontFamily: typography.fonts.heading,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.secondary,
    fontFamily: typography.fonts.body,
    textAlign: 'center',
    maxWidth: 340,
    lineHeight: 24,
    marginBottom: 28,
  },
  featureList: {
    gap: 14,
    maxWidth: 400,
    width: '100%',
    marginBottom: 22,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.cardLarge,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  featureIcon: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
    marginTop: 2,
  },
  featureLabel: {
    fontSize: 15,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoMedium,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  featureBody: { flex: 1 },
  featureDesc: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: typography.fonts.body,
    lineHeight: 20,
  },
  stardustNote: {
    fontSize: 14,
    color: colors.accent.gold,
    fontFamily: typography.fonts.body,
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 21,
    marginBottom: 26,
    opacity: 0.9,
  },
  beginButton: {
    paddingHorizontal: 44,
    paddingVertical: 14,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.4)',
    backgroundColor: 'rgba(96,165,250,0.10)',
  },
  beginText: {
    fontSize: 14,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
