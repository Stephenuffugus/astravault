import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, SectionLabel } from '@/components/common';
import { endObservationSession, useObservationTimer, useToast } from '@/stores';
import { colors, radii, typography } from '@/theme/tokens';

const formatDuration = (totalMs: number): string => {
  const totalSec = Math.floor(totalMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};

export default function ObservationTimer() {
  const isRunning = useObservationTimer((s) => s.isRunning);
  const startedAt = useObservationTimer((s) => s.startedAt);
  const accumulatedMs = useObservationTimer((s) => s.accumulatedMs);
  const earnedThisSession = useObservationTimer((s) => s.earnedThisSession);
  const start = useObservationTimer((s) => s.start);
  const pause = useObservationTimer((s) => s.pause);
  const showToast = useToast((s) => s.show);

  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setNowMs(Date.now()), 1_000);
    return () => clearInterval(id);
  }, [isRunning]);

  const elapsedMs =
    accumulatedMs + (startedAt != null ? nowMs - startedAt : 0);

  const handlePress = () => {
    if (isRunning) {
      pause();
    } else if (accumulatedMs > 0) {
      void endObservationSession().then(() => {
        showToast(`Session ended — +${earnedThisSession} ATP banked`, 'atp');
      });
    } else {
      start();
      showToast('Session started — 1 ATP every 30 sec', 'info');
    }
  };

  const buttonState: 'start' | 'pause' | 'end' = isRunning
    ? 'pause'
    : accumulatedMs > 0
      ? 'end'
      : 'start';

  return (
    <Card>
      <SectionLabel color={colors.accent.gold}>Observation Timer</SectionLabel>
      <View style={styles.bodyRow}>
        <View style={styles.flex1}>
          <Text style={styles.timeText}>{formatDuration(elapsedMs)}</Text>
          <Text style={styles.subText}>
            {isRunning
              ? 'Recording attention…'
              : accumulatedMs > 0
                ? 'Paused — tap End to bank'
                : 'Earn 1 ATP per 30 seconds'}
          </Text>
        </View>
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={
            buttonState === 'start'
              ? 'Start observation timer'
              : buttonState === 'pause'
                ? 'Pause observation timer'
                : 'End observation session'
          }
          style={({ pressed }) => [
            styles.button,
            buttonState === 'pause'
              ? styles.buttonPause
              : buttonState === 'end'
                ? styles.buttonEnd
                : styles.buttonStart,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.buttonText}>
            {buttonState === 'pause'
              ? 'PAUSE'
              : buttonState === 'end'
                ? 'END · BANK'
                : 'START'}
          </Text>
        </Pressable>
      </View>
      {earnedThisSession > 0 ? (
        <Text style={styles.earnedText}>+{earnedThisSession} ATP this session</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  flex1: { flex: 1 },
  timeText: {
    fontSize: 32,
    color: colors.accent.gold,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '700',
  },
  subText: {
    fontSize: typography.size.label,
    color: colors.text.muted,
    fontFamily: typography.fonts.mono,
    marginTop: 2,
    letterSpacing: typography.letterSpacing.label,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radii.button,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: 'rgba(251,191,36,0.10)',
    borderColor: 'rgba(251,191,36,0.30)',
  },
  buttonPause: {
    backgroundColor: 'rgba(96,165,250,0.10)',
    borderColor: 'rgba(96,165,250,0.30)',
  },
  buttonEnd: {
    backgroundColor: 'rgba(74,222,128,0.10)',
    borderColor: 'rgba(74,222,128,0.30)',
  },
  buttonText: {
    fontSize: 11,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  pressed: { opacity: 0.75 },
  earnedText: {
    marginTop: 10,
    fontSize: typography.size.label,
    color: colors.accent.gold,
    fontFamily: typography.fonts.mono,
    letterSpacing: typography.letterSpacing.label,
  },
});
