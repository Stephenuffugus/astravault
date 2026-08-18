import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '@/theme/tokens';

export interface AtpBadgeProps {
  amount: number;
}

function AtpBadge({ amount }: AtpBadgeProps) {
  return (
    <View
      style={styles.badge}
      accessibilityRole="text"
      accessibilityLabel={`${amount} Stardust`}
    >
      <Text style={styles.text}>✦ {amount.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radii.badge,
    backgroundColor: 'rgba(251,191,36,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.08)',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    color: colors.accent.gold,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '600',
  },
});

export default AtpBadge;
