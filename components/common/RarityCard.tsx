import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, rarity as rarityTokens, spacing } from '@/theme/tokens';
import type { CardProps } from './Card';

export interface RarityCardProps extends CardProps {
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  onPress?: () => void;
  glow?: boolean;
}

function RarityCard({
  children,
  style,
  padding = spacing.cardPadding,
  rarity,
  onPress,
  glow = false,
}: RarityCardProps) {
  const tone = rarityTokens[rarity];

  const dynamic: ViewStyle = {
    borderColor: tone.color + '22',
    backgroundColor: tone.bg,
    padding,
    ...(glow
      ? {
          shadowColor: tone.color,
          shadowOpacity: 0.35,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 0 },
          // react-native-web reads boxShadow when present.
          ...({ boxShadow: `0 0 15px ${tone.glow}` } as object),
        }
      : null),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        style={({ pressed }) => [
          styles.card,
          dynamic,
          pressed ? styles.pressed : null,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, dynamic, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderRadius: radii.card,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default RarityCard;
