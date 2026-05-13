import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, motion, typography } from '@/theme/tokens';

export interface ToastProps {
  message: string | null;
  variant?: 'atp' | 'info' | 'error';
}

type ToastTone = { border: string; text: string };

const TONES: Record<NonNullable<ToastProps['variant']>, ToastTone> = {
  atp: { border: 'rgba(251,191,36,0.18)', text: colors.accent.gold },
  info: { border: 'rgba(96,165,250,0.25)', text: colors.accent.blue },
  error: { border: 'rgba(255,68,68,0.25)', text: colors.accent.red },
};

function Toast({ message, variant = 'atp' }: ToastProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-14);

  useEffect(() => {
    if (message) {
      opacity.value = withTiming(1, { duration: motion.duration.transition });
      translateY.value = withTiming(0, { duration: motion.duration.transition });
    } else {
      opacity.value = withTiming(0, { duration: motion.duration.fast });
      translateY.value = withTiming(-14, { duration: motion.duration.fast });
    }
  }, [message, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!message) return null;

  const tone: ToastTone = TONES[variant];

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View
        style={[styles.toast, { borderColor: tone.border }, animatedStyle]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <Text style={[styles.text, { color: tone.text }]}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  toast: {
    backgroundColor: 'rgba(8,12,25,0.95)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 11,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default Toast;
