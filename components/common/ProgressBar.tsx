import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '@/theme/tokens';

export interface ProgressBarProps {
  value: number;
  height?: number;
  color?: string;
  gradient?: string[];
}

function clamp(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function ProgressBar({
  value,
  height = 4,
  color,
  gradient,
}: ProgressBarProps) {
  const pct = clamp(value);
  const widthPct = `${pct * 100}%` as const;
  const useGradient = !!gradient && gradient.length >= 2;
  const fillColor = color ?? colors.accent.blue;
  const gradientColors: readonly [string, string, ...string[]] | null =
    useGradient && gradient
      ? ([gradient[0] as string, gradient[1] as string, ...gradient.slice(2)] as const)
      : null;

  const trackStyle: ViewStyle = {
    height,
    borderRadius: radii.progressBar,
  };

  return (
    <View style={[styles.track, trackStyle]}>
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.fill,
            { width: widthPct, height, borderRadius: radii.progressBar },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fill,
            {
              width: widthPct,
              height,
              backgroundColor: fillColor,
              borderRadius: radii.progressBar,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default ProgressBar;
