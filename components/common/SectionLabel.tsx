import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, typography } from '@/theme/tokens';

export interface SectionLabelProps {
  children: string;
  color?: string;
}

function SectionLabel({ children, color = colors.text.label }: SectionLabelProps) {
  return <Text style={[styles.label, { color }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.size.label,
    letterSpacing: typography.letterSpacing.label,
    fontFamily: typography.fonts.mono,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
});

export default SectionLabel;
