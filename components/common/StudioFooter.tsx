import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '@/theme/tokens';
import { STUDIO } from '@/data/studio';

function StudioFooter() {
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
