import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

function Card({ children, style, padding = spacing.cardPadding }: CardProps) {
  return <View style={[styles.card, { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.card,
  },
});

export default Card;
