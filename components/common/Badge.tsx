import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, typography } from '@/theme/tokens';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'gold' | 'green' | 'red' | 'neutral';
}

type Tone = { bg: string; border: string; text: string };

const TONES: Record<NonNullable<BadgeProps['variant']>, Tone> = {
  blue: {
    bg: 'rgba(96,165,250,0.10)',
    border: 'rgba(96,165,250,0.25)',
    text: colors.accent.blue,
  },
  purple: {
    bg: 'rgba(192,132,252,0.10)',
    border: 'rgba(192,132,252,0.25)',
    text: colors.accent.purple,
  },
  gold: {
    bg: 'rgba(251,191,36,0.10)',
    border: 'rgba(251,191,36,0.25)',
    text: colors.accent.gold,
  },
  green: {
    bg: 'rgba(74,222,128,0.10)',
    border: 'rgba(74,222,128,0.25)',
    text: colors.accent.green,
  },
  red: {
    bg: 'rgba(255,68,68,0.10)',
    border: 'rgba(255,68,68,0.25)',
    text: colors.accent.red,
  },
  neutral: {
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    text: colors.text.secondary,
  },
};

function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const tone: Tone = TONES[variant];
  const containerStyle: ViewStyle = {
    backgroundColor: tone.bg,
    borderColor: tone.border,
  };

  return (
    <View style={[styles.badge, containerStyle]}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={[styles.text, { color: tone.text }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radii.badge,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.size.label,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default Badge;
