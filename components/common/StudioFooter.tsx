import React, { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '@/theme/tokens';
import { STUDIO } from '@/data/studio';
import { useToast } from '@/stores';

/* Chrome hands over an install prompt through beforeinstallprompt; iOS
   never does, so there the button explains the Share menu route instead.
   Nothing shows when the app is already installed. */
type InstallPromptEvent = Event & { prompt: () => Promise<unknown> };

const useInstall = (): { label: string; onPress: () => void } | null => {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    if (window.matchMedia?.('(display-mode: standalone)').matches) return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    if (/iPhone|iPad/.test(navigator.userAgent)) setIos(true);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (prompt) {
    return { label: '⤓ Install app', onPress: () => void prompt.prompt() };
  }
  if (ios) {
    return {
      label: '⤓ Install app',
      onPress: () =>
        useToast.getState().show('In Safari: tap Share, then Add to Home Screen', 'info'),
    };
  }
  return null;
};

function StudioFooter() {
  const install = useInstall();
  return (
    <View style={styles.footer}>
      {STUDIO.tipUrl ? (
        <Pressable
          onPress={() => Linking.openURL(STUDIO.tipUrl)}
          accessibilityRole="link"
          style={({ pressed }) => [styles.tipButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.tipText}>♥ Tip jar</Text>
        </Pressable>
      ) : null}
      {install ? (
        <Pressable
          onPress={install.onPress}
          accessibilityRole="button"
          style={({ pressed }) => (pressed ? styles.pressed : null)}
        >
          <Text style={styles.link}>{install.label}</Text>
        </Pressable>
      ) : null}
      <Text style={styles.line}>Your vault stays on your device.</Text>
      <View style={styles.links}>
        <Pressable onPress={() => Linking.openURL(STUDIO.studioUrl)} accessibilityRole="link">
          <Text style={styles.link}>A free app by Sky Wolf Studios</Text>
        </Pressable>
        <Text style={styles.line}>·</Text>
        <Pressable onPress={() => Linking.openURL(STUDIO.feedbackUrl)} accessibilityRole="link">
          <Text style={styles.link}>Feedback</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 18,
  },
  tipButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.25)',
    backgroundColor: 'rgba(251,191,36,0.06)',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 11,
    color: colors.accent.gold,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '600',
  },
  pressed: { opacity: 0.7 },
  line: {
    fontSize: 10,
    color: colors.text.ghost,
    fontFamily: typography.fonts.mono,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    fontSize: 10,
    color: colors.text.dim,
    fontFamily: typography.fonts.mono,
    textDecorationLine: 'underline',
  },
});

export default StudioFooter;
