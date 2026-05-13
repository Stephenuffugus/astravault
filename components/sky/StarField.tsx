// Animated star field background — Reanimated-driven dots, web-safe (no canvas).
import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  useReducedMotion,
} from 'react-native-reanimated';
import { colors, motion } from '@/theme/tokens';

type StarSeed = {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  twinkleSpeed: number;
};

type StarFieldProps = {
  density?: number;
};

const StarField = ({ density = motion.starField.starCount }: StarFieldProps) => {
  const reducedMotion = useReducedMotion();
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const tick = useSharedValue(0);

  const seeds = useMemo<StarSeed[]>(
    () =>
      Array.from({ length: density }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.6,
        speed: Math.random() * 0.12 + 0.02,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
      })),
    [density],
  );

  useFrameCallback((info) => {
    if (reducedMotion) return;
    const delta = info.timeSincePreviousFrame ?? 16;
    tick.value += delta / 16;
  }, true);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return (
    <View style={styles.container} onLayout={onLayout} pointerEvents="none">
      {size.width > 0 && size.height > 0
        ? seeds.map((seed, i) => (
            <Star
              key={i}
              seed={seed}
              tick={tick}
              width={size.width}
              height={size.height}
              reducedMotion={reducedMotion}
            />
          ))
        : null}
    </View>
  );
};

type StarProps = {
  seed: StarSeed;
  tick: ReturnType<typeof useSharedValue<number>>;
  width: number;
  height: number;
  reducedMotion: boolean;
};

const Star = React.memo(({ seed, tick, width, height, reducedMotion }: StarProps) => {
  const baseX = seed.x * width;
  const baseY = seed.y * height;
  const size = seed.r * 2;

  const animatedStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        opacity: 0.35,
        transform: [{ translateX: baseX }, { translateY: baseY }],
      };
    }
    const t = tick.value;
    const travel = (baseY + t * seed.speed) % (height + 4);
    const y = travel < 0 ? travel + height + 4 : travel;
    const twinkle = 0.2 + Math.sin(seed.phase + t * seed.twinkleSpeed) * 0.25 + 0.25;
    const opacity = Math.max(0.1, Math.min(0.6, twinkle));
    return {
      opacity,
      transform: [{ translateX: baseX }, { translateY: y - 2 }],
    };
  }, [baseX, baseY, height, reducedMotion, seed.phase, seed.speed, seed.twinkleSpeed]);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
});

Star.displayName = 'Star';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: colors.appBg,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(190,210,245,1)',
  },
});

export default StarField;
