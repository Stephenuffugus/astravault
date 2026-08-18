import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  CATALOG,
  CATEGORY_ICONS,
  RARITY_META,
  type CelestialObject,
} from '@/data/catalog';
import { colors, typography } from '@/theme/tokens';
import { requestLocation } from '@/services/location';
import { useToast } from '@/stores';
import { usePointing } from './usePointing';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CelestialCanvasProps {
  onSelect: (object: CelestialObject) => void;
  isCollected: (id: string) => boolean;
  initialView?: { ra: number; dec: number };
}

const FIELD_OF_VIEW = 65;

const baseRadius = (obj: CelestialObject): number => {
  if (obj.category === 'nebula') return 7;
  if (obj.category === 'galaxy') return 6;
  if (obj.category === 'cluster') return 5.5;
  if (obj.category === 'planet') return 5;
  return Math.max(2.4, (2 - obj.magnitude) * 2.6);
};

const CelestialCanvas: React.FC<CelestialCanvasProps> = ({
  onSelect,
  isCollected,
  initialView,
}) => {
  const [size, setSize] = useState(() => {
    const win = Dimensions.get('window');
    return { width: win.width, height: win.height - 200 };
  });
  const [view, setView] = useState(initialView ?? { ra: 90, dec: 15 });
  const dragRef = useRef<{ active: boolean; lastX: number; lastY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
  });

  const reticleScale = useSharedValue(1);

  const [observer, setObserver] = useState<{ lat: number; lng: number } | null>(null);
  const lastAimRef = useRef(0);
  const gotReadingRef = useRef(false);

  /* Sensor readings arrive at device rate; a light throttle plus a lerp
     toward the target keeps the pan smooth instead of jittering with the
     user's hand. */
  const handleAim = useCallback((coord: { ra: number; dec: number }) => {
    const now = Date.now();
    gotReadingRef.current = true;
    if (now - lastAimRef.current < 80) return;
    lastAimRef.current = now;
    setView((prev) => {
      const dRA = ((coord.ra - prev.ra + 540) % 360) - 180;
      return {
        ra: ((prev.ra + dRA * 0.3) % 360 + 360) % 360,
        dec: Math.max(-90, Math.min(90, prev.dec + (coord.dec - prev.dec) * 0.3)),
      };
    });
  }, []);

  const pointing = usePointing(observer, handleAim);

  const togglePointing = useCallback(async () => {
    if (pointing.active) {
      pointing.stop();
      return;
    }
    /* Sensor permission first: iOS only grants it inside the tap gesture,
       and the location prompt would spend that gesture. */
    const ok = await pointing.start();
    if (!ok) {
      useToast.getState().show('Motion sensors unavailable on this device', 'error');
      return;
    }
    if (!observer) {
      const got = await requestLocation();
      if (!got) {
        pointing.stop();
        useToast.getState().show('Location needed to point at your sky', 'error');
        return;
      }
      setObserver({ lat: got.latitude, lng: got.longitude });
    }
    gotReadingRef.current = false;
    setTimeout(() => {
      if (!gotReadingRef.current) {
        pointing.stop();
        useToast.getState().show('No motion readings arrived. Try on a phone.', 'error');
      }
    }, 2500);
  }, [pointing, observer]);

  useEffect(() => {
    reticleScale.value = withRepeat(
      withTiming(1.12, { duration: 1600 }),
      -1,
      true,
    );
    return () => cancelAnimation(reticleScale);
  }, [reticleScale]);

  const visible = useMemo(() => {
    return CATALOG.filter(
      (o) =>
        Math.abs(((o.ra - view.ra + 540) % 360) - 180) < FIELD_OF_VIEW &&
        Math.abs(o.dec - view.dec) < FIELD_OF_VIEW / 2,
    ).map((o) => {
      const dRA = ((o.ra - view.ra + 540) % 360) - 180;
      const sx = (dRA + FIELD_OF_VIEW) / (FIELD_OF_VIEW * 2);
      const sy = (o.dec - view.dec + FIELD_OF_VIEW / 2) / FIELD_OF_VIEW;
      return { object: o, sx, sy };
    });
  }, [view]);

  const onTouchStart = useCallback((e: GestureResponderEvent) => {
    const touch = e.nativeEvent.touches[0];
    if (!touch) return;
    if (pointing.active) pointing.stop();
    dragRef.current = {
      active: true,
      lastX: touch.pageX,
      lastY: touch.pageY,
    };
  }, [pointing]);

  const onTouchMove = useCallback((e: GestureResponderEvent) => {
    if (!dragRef.current.active) return;
    const touch = e.nativeEvent.touches[0];
    if (!touch) return;
    const dx = touch.pageX - dragRef.current.lastX;
    const dy = touch.pageY - dragRef.current.lastY;
    dragRef.current.lastX = touch.pageX;
    dragRef.current.lastY = touch.pageY;
    setView((prev) => ({
      ra: ((prev.ra - dx * 0.4) % 360 + 360) % 360,
      dec: Math.max(-90, Math.min(90, prev.dec + dy * 0.3)),
    }));
  }, []);

  const onTouchEnd = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (dragRef.current.active) return;
      const { locationX, locationY } = e.nativeEvent;
      const px = locationX / size.width;
      const py = 1 - locationY / size.height;
      let best: CelestialObject | null = null;
      let bestDist = 0.08;
      for (const item of visible) {
        const d = Math.hypot(item.sx - px, item.sy - py);
        if (d < bestDist) {
          bestDist = d;
          best = item.object;
        }
      }
      if (best) onSelect(best);
    },
    [visible, size, onSelect],
  );

  const onLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > 0 && height > 0) setSize({ width, height });
    },
    [],
  );

  const reticleProps = useAnimatedProps(() => ({ r: 36 * reticleScale.value }));

  const cx = size.width / 2;
  const cy = size.height / 2;

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={onTouchStart}
      onResponderMove={onTouchMove}
      onResponderRelease={(e) => {
        onTouchEnd();
        handlePress(e);
      }}
      onResponderTerminate={onTouchEnd}
    >
      <Svg width={size.width} height={size.height} style={styles.svg}>
        <Defs>
          {visible.map((item) => (
            <RadialGradient
              key={`g-${item.object.id}`}
              id={`g-${item.object.id}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0%" stopColor={item.object.color} stopOpacity={0.35} />
              <Stop offset="100%" stopColor={item.object.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>

        <G>
          {visible.map((item) => {
            const ox = item.sx * size.width;
            const oy = (1 - item.sy) * size.height;
            const br = baseRadius(item.object);
            const collected = isCollected(item.object.id);
            const rarity = RARITY_META[item.object.rarity];
            return (
              <G key={item.object.id}>
                <Circle
                  cx={ox}
                  cy={oy}
                  r={br * 3.5}
                  fill={`url(#g-${item.object.id})`}
                />
                <Circle
                  cx={ox}
                  cy={oy}
                  r={Math.max(br, 1.6)}
                  fill={item.object.color}
                />
                {collected ? (
                  <Circle
                    cx={ox}
                    cy={oy}
                    r={br + 5}
                    stroke={rarity.color + '88'}
                    strokeWidth={1}
                    strokeDasharray="3,3"
                    fill="none"
                  />
                ) : null}
                <SvgText
                  x={ox + br + 6}
                  y={oy + 4}
                  fontSize={10}
                  fontWeight="600"
                  fontFamily={typography.webFallback.mono}
                  fill="rgba(200,210,230,0.7)"
                >
                  {`${CATEGORY_ICONS[item.object.category]} ${item.object.name}`}
                </SvgText>
              </G>
            );
          })}

          <AnimatedCircle
            cx={cx}
            cy={cy}
            animatedProps={reticleProps}
            stroke="rgba(100,200,255,0.25)"
            strokeWidth={1}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={cy}
            r={2}
            fill="rgba(100,200,255,0.5)"
          />
        </G>
      </Svg>

      <View style={styles.coordsContainer} pointerEvents="none">
        <Text style={styles.coordsText}>
          RA {view.ra.toFixed(1)}°  DEC {view.dec.toFixed(1)}°
        </Text>
      </View>
      <View style={styles.hintContainer} pointerEvents="none">
        <Text style={styles.hintText}>
          {pointing.active
            ? 'POINTING AT YOUR SKY · TAP TO COLLECT'
            : 'DRAG TO PAN · TAP TO COLLECT'}
        </Text>
      </View>
      {pointing.supported ? (
        <Pressable
          onPress={togglePointing}
          accessibilityRole="button"
          accessibilityLabel={
            pointing.active ? 'Stop pointing mode' : 'Point phone at the sky'
          }
          style={({ pressed }) => [
            styles.pointButton,
            pointing.active ? styles.pointButtonActive : null,
            pressed ? styles.pointPressed : null,
          ]}
        >
          <Text
            style={[
              styles.pointText,
              pointing.active ? styles.pointTextActive : null,
            ]}
          >
            {pointing.active ? '⌖ POINTING' : '⌖ POINT'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.scannerClear,
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  coordsContainer: {
    position: 'absolute',
    bottom: 10,
    right: 12,
  },
  coordsText: {
    color: 'rgba(100,200,255,0.4)',
    fontFamily: typography.webFallback.mono,
    fontSize: 10,
    letterSpacing: 1,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 10,
    left: 12,
  },
  hintText: {
    color: 'rgba(100,180,255,0.25)',
    fontFamily: typography.webFallback.mono,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  pointButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(100,200,255,0.25)',
    backgroundColor: 'rgba(2,3,11,0.6)',
  },
  pointButtonActive: {
    borderColor: 'rgba(100,200,255,0.7)',
    backgroundColor: 'rgba(96,165,250,0.15)',
  },
  pointPressed: { opacity: 0.7 },
  pointText: {
    color: 'rgba(100,200,255,0.6)',
    fontFamily: typography.webFallback.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  pointTextActive: {
    color: 'rgba(160,220,255,1)',
  },
});

export default CelestialCanvas;
