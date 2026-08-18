/**
 * Shared Sky — Astra Vault's community screen.
 * Privacy invariant (per the Director): anonymous aggregate only. No usernames, no chat,
 * no profiles, no friends, no leaderboards. Mock data here is a placeholder for a future
 * Firebase Cloud Function read; do not extract to a separate data file.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Card, ProgressBar, SectionLabel } from '@/components/common';
import { colors, motion, radii, spacing, typography } from '@/theme/tokens';

type Discovery = { what: string; when: string; where: string };
type CommunityGoal = {
  name: string;
  target: number;
  current: number;
  unit: string;
  reward: string;
};
type HeatmapRegion = { region: string; observers: number; pct: number };
type Trending = { name: string; pct: number };

type SharedSkyData = {
  observersNow: number;
  totalHours: number;
  totalObservations: number;
  totalStarsCollected: number;
  recentDiscoveries: readonly Discovery[];
  popularThisWeek: readonly Trending[];
  communityGoals: readonly CommunityGoal[];
  heatmap: readonly HeatmapRegion[];
};

const MOCK_SHARED_SKY: SharedSkyData = {
  observersNow: 1847 + Math.floor(Math.random() * 200),
  totalHours: 847293,
  totalObservations: 2341567,
  totalStarsCollected: 892104,
  recentDiscoveries: [
    { what: 'Betelgeuse', when: '12s ago', where: 'Northern Hemisphere' },
    { what: 'Orion Nebula', when: '34s ago', where: 'Americas' },
    { what: 'Saturn', when: '1m ago', where: 'Europe' },
    { what: 'Andromeda', when: '2m ago', where: 'Asia-Pacific' },
    { what: 'Pleiades', when: '2m ago', where: 'Northern Hemisphere' },
    { what: 'TRAPPIST-1', when: '4m ago', where: 'Americas' },
    { what: 'Jupiter', when: '5m ago', where: 'Europe' },
    { what: 'Eta Carinae', when: '7m ago', where: 'Southern Hemisphere' },
  ],
  popularThisWeek: [
    { name: 'Orion Nebula', pct: 84 },
    { name: 'Jupiter', pct: 79 },
    { name: 'Betelgeuse', pct: 71 },
    { name: 'Andromeda', pct: 65 },
    { name: 'Saturn', pct: 58 },
  ],
  communityGoals: [
    {
      name: 'March Dark Sky Survey',
      target: 10000,
      current: 7834,
      unit: 'Bortle reports',
      reward: 'Unlock community badge',
    },
    {
      name: 'Orionid Watch 2026',
      target: 50000,
      current: 23419,
      unit: 'meteors logged',
      reward: 'Everyone gets 50 bonus ATP',
    },
    {
      name: 'Million Hours',
      target: 1000000,
      current: 847293,
      unit: 'observation hours',
      reward: 'Permanent 10% ATP boost',
    },
  ],
  heatmap: [
    { region: 'North America', observers: 612, pct: 33 },
    { region: 'Europe', observers: 498, pct: 27 },
    { region: 'Asia-Pacific', observers: 384, pct: 21 },
    { region: 'South America', observers: 189, pct: 10 },
    { region: 'Africa & Middle East', observers: 102, pct: 6 },
    { region: 'Oceania', observers: 62, pct: 3 },
  ],
};

function PulsingDot() {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1.0, { duration: 1000 }), -1, true);
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.pulsingDot, style]} />;
}

export default function SharedSkyScreen() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), motion.observerCounter.intervalMs);
    return () => clearInterval(iv);
  }, []);

  const observersNow = useMemo(
    () =>
      MOCK_SHARED_SKY.observersNow +
      Math.floor(Math.sin(tick * 0.5) * motion.observerCounter.variance),
    [tick],
  );

  const lifetimeStats: ReadonlyArray<readonly [string, string]> = [
    [MOCK_SHARED_SKY.totalHours.toLocaleString(), 'hours observed'],
    [MOCK_SHARED_SKY.totalObservations.toLocaleString(), 'observations'],
    [MOCK_SHARED_SKY.totalStarsCollected.toLocaleString(), 'objects collected'],
  ];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>LOOKING UP RIGHT NOW</Text>
        <Text style={styles.heroNumber}>{observersNow.toLocaleString()}</Text>
        <Text style={styles.heroSubtext}>observers sharing tonight&rsquo;s sky with you</Text>
        <PulsingDot />
      </View>

      <Card style={styles.sectionCard}>
        <SectionLabel>LIVE DISCOVERIES</SectionLabel>
        {MOCK_SHARED_SKY.recentDiscoveries.slice(0, 5).map((d, i) => (
          <View
            key={`${d.what}-${i}`}
            style={[
              styles.feedRow,
              { opacity: 1 - i * 0.15 },
              i < 4 ? styles.feedRowBorder : null,
            ]}
          >
            <View style={styles.feedLeft}>
              <View style={styles.feedBullet} />
              <Text style={styles.feedText}>
                Someone collected <Text style={styles.feedTextBold}>{d.what}</Text>
              </Text>
            </View>
            <Text style={styles.feedWhen}>{d.when}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.sectionCard}>
        <SectionLabel>COLLECTIVE MISSIONS</SectionLabel>
        {MOCK_SHARED_SKY.communityGoals.map((g, i) => {
          const ratio = g.current / g.target;
          return (
            <View key={g.name} style={i < MOCK_SHARED_SKY.communityGoals.length - 1 ? styles.goalRow : null}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{g.name}</Text>
                <Text style={styles.goalCount}>
                  {g.current.toLocaleString()}/{g.target.toLocaleString()}
                </Text>
              </View>
              <ProgressBar
                value={ratio}
                gradient={[colors.accent.blue, colors.accent.purple]}
              />
              <Text style={styles.goalMeta}>
                {g.unit} &bull; Reward: {g.reward}
              </Text>
            </View>
          );
        })}
      </Card>

      <Card style={styles.sectionCard}>
        <SectionLabel>WHERE WE&rsquo;RE OBSERVING</SectionLabel>
        {MOCK_SHARED_SKY.heatmap.map((h) => (
          <View key={h.region} style={styles.heatRow}>
            <Text style={styles.heatRegion}>{h.region}</Text>
            <View style={styles.heatBarWrap}>
              <ProgressBar
                value={h.pct / 100}
                height={6}
                color={`rgba(96,165,250,${0.3 + h.pct * 0.01})`}
              />
            </View>
            <Text style={styles.heatCount}>{h.observers}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.sectionCard}>
        <SectionLabel>TRENDING THIS WEEK</SectionLabel>
        {MOCK_SHARED_SKY.popularThisWeek.map((p, i) => (
          <View key={p.name} style={styles.trendRow}>
            <Text style={styles.trendRank}>#{i + 1}</Text>
            <Text style={styles.trendName}>{p.name}</Text>
            <View style={styles.trendBarWrap}>
              <ProgressBar value={p.pct / 100} color={colors.accent.gold} />
            </View>
            <Text style={styles.trendPct}>{p.pct}%</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.sectionCard}>
        <SectionLabel>OUR COMMUNITY</SectionLabel>
        <View style={styles.statsGrid}>
          {lifetimeStats.map(([v, l]) => (
            <View key={l} style={styles.statCell}>
              <Text style={styles.statValue}>{v}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const mono = typography.fonts.mono;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  content: { paddingHorizontal: spacing.pageX + 2, paddingVertical: spacing.pageY },
  hero: { backgroundColor: 'rgba(96,165,250,0.04)', borderWidth: 1, borderColor: 'rgba(96,165,250,0.1)', borderRadius: radii.cardLarge, padding: 24, alignItems: 'center', marginBottom: spacing.sectionGap },
  heroLabel: { fontSize: typography.size.tiny, color: 'rgba(96,165,250,0.5)', letterSpacing: 3, fontFamily: mono, marginBottom: 6 },
  heroNumber: { fontSize: typography.size.dataLarge, fontWeight: '700', color: colors.accent.blue, fontFamily: mono },
  heroSubtext: { fontSize: 11, color: 'rgba(96,165,250,0.4)', fontFamily: typography.fonts.bodyItalic, marginTop: 4, fontStyle: 'italic' },
  pulsingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent.green, marginTop: 10 },
  sectionCard: { marginBottom: spacing.sectionGap, padding: 14 },
  feedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  feedRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.02)' },
  feedLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  feedBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(96,165,250,0.6)' },
  feedText: { fontSize: 12, color: 'rgba(200,210,225,0.6)', fontFamily: mono },
  feedTextBold: { color: colors.text.secondary, fontWeight: '600' },
  feedWhen: { fontSize: typography.size.tiny, color: 'rgba(160,180,210,0.3)', fontFamily: mono },
  goalRow: { marginBottom: 12 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  goalName: { fontSize: 12, color: colors.text.secondary, fontWeight: '600', fontFamily: mono },
  goalCount: { fontSize: typography.size.label, color: colors.text.ghost, fontFamily: mono },
  goalMeta: { fontSize: typography.size.tiny, color: 'rgba(160,180,210,0.3)', fontFamily: mono, marginTop: 3 },
  heatRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  heatRegion: { fontSize: 11, color: 'rgba(200,210,225,0.6)', fontFamily: mono, width: 140, flexShrink: 0 },
  heatBarWrap: { flex: 1 },
  heatCount: { fontSize: typography.size.tiny, color: 'rgba(96,165,250,0.5)', fontFamily: mono, width: 30, textAlign: 'right' },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  trendRank: { fontSize: 12, color: colors.accent.gold, fontWeight: '700', fontFamily: mono, width: 18 },
  trendName: { fontSize: 12, color: 'rgba(200,210,225,0.7)', fontFamily: mono, flex: 1 },
  trendBarWrap: { width: 60 },
  trendPct: { fontSize: typography.size.tiny, color: 'rgba(251,191,36,0.5)', fontFamily: mono, width: 30, textAlign: 'right' },
  statsGrid: { flexDirection: 'row', gap: 8 },
  statCell: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.text.secondary, fontFamily: mono },
  statLabel: { fontSize: 11, color: 'rgba(160,180,210,0.35)', fontFamily: mono, marginTop: 2 },
});
