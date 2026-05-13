import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export interface PillProps {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
  accent?: string;
}

function Pill({
  children,
  active = false,
  onPress,
  accent = colors.accent.blue,
}: PillProps) {
  const dynamic: ViewStyle = active
    ? { backgroundColor: accent + '1A' }
    : { backgroundColor: 'rgba(255,255,255,0.02)' };

  const labelColor = active ? accent : colors.text.dim;

  const content = (
    <View style={[styles.pill, dynamic]}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={[styles.text, { color: labelColor }]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );

  if (onPress) {
    const label = typeof children === 'string' ? children : 'pill';
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={label}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={({ pressed }) => [pressed ? styles.pressed : null]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  pill: {
    paddingVertical: spacing.pillY,
    paddingHorizontal: spacing.pillX,
    borderRadius: radii.pill,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.size.label,
    fontFamily: typography.fonts.monoMedium,
    letterSpacing: typography.letterSpacing.button,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Pill;
