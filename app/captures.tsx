import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Card, SectionLabel } from '@/components/common';
import { GMN_ATTRIBUTION } from '@/services/apis/gmnNetwork';
import { useMeteorCaptures } from '@/stores';
import type { MomentCaptureRecord } from '@/services/meteor/captureRecord';
import { colors, radii, spacing, typography } from '@/theme/tokens';

const fmtTime = (ms: number): string => {
  const date = new Date(ms);
  return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${date
    .toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
};

const fmtCoord = (lat: number, lng: number): string =>
  `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;

export default function CapturesScreen() {
  const router = useRouter();
  const captures = useMeteorCaptures((s) => s.captures);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Moment Captures</Text>
      <Text style={styles.tagline}>
        Every tap, voice, or auto-detected event you record creates a time-synced,
        geotagged observation. We cross-reference against the Global Meteor Network — when a
        match lands, you see who else saw the same meteor.
      </Text>

      {captures.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No captures yet.</Text>
          <Text style={styles.emptySub}>
            On the Scan tab, tap "Capture Moment" when you see a meteor.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {captures.map((c) => (
            <CaptureRow key={c.id} record={c} />
          ))}
        </View>
      )}

      {captures.length > 0 ? (
        <Text style={styles.attribution}>{GMN_ATTRIBUTION}</Text>
      ) : null}
    </ScrollView>
  );
}

function CaptureRow({ record }: { record: MomentCaptureRecord }) {
  const cr = record.crossReferences;
  const matched = cr.gmnMatch || cr.camsMatch || cr.amsMatch;

  return (
    <Card>
      <View style={styles.rowHead}>
        <View style={styles.flex1}>
          <Text style={styles.eventLabel}>
            {record.eventType.toUpperCase()} · {record.captureMode}
          </Text>
          <Text style={styles.timeText}>{fmtTime(record.triggerAt)}</Text>
        </View>
        {matched ? (
          <Badge variant="green">MATCH</Badge>
        ) : (
          <Badge variant="neutral">PENDING</Badge>
        )}
      </View>

      <Text style={styles.locText}>
        {fmtCoord(record.location.latitude, record.location.longitude)}
        {record.location.altitudeMeters
          ? ` · ${Math.round(record.location.altitudeMeters)} m`
          : ''}
      </Text>

      {cr.showerName ? (
        <View style={styles.matchPanel}>
          <Text style={styles.matchHeader}>{cr.showerName}</Text>
          {cr.parentBody ? (
            <Text style={styles.matchSub}>Parent body: {cr.parentBody}</Text>
          ) : null}
          {cr.velocityKmS != null ? (
            <Text style={styles.matchSub}>Velocity: {cr.velocityKmS.toFixed(1)} km/s</Text>
          ) : null}
          {cr.matchedObservers > 0 ? (
            <Text style={styles.matchSub}>
              {cr.matchedObservers} other station{cr.matchedObservers === 1 ? '' : 's'} caught this
            </Text>
          ) : null}
        </View>
      ) : matched ? null : (
        <Text style={styles.pendingText}>
          Cross-reference in progress · GMN check window: ±60s
        </Text>
      )}

      {record.attentionHash ? (
        <Text style={styles.hashText}>
          attention-hash {record.attentionHash.slice(0, 16)}…
        </Text>
      ) : null}
    </Card>
  );
}

const t = typography;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBg },
  content: { padding: spacing.pageX, paddingTop: 50, paddingBottom: 60, gap: 12 },
  backLink: { marginBottom: 4 },
  backLinkText: { color: 'rgba(96,165,250,0.7)', fontFamily: t.fonts.mono, fontSize: 12 },
  title: {
    fontSize: 26,
    color: colors.text.primary,
    fontFamily: t.fonts.heading,
    fontWeight: '700',
  },
  tagline: {
    fontSize: t.size.body,
    color: colors.text.muted,
    fontFamily: t.fonts.body,
    lineHeight: 20,
    marginBottom: 6,
  },
  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: {
    fontSize: t.size.body,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
    letterSpacing: t.letterSpacing.label,
  },
  emptySub: {
    fontSize: t.size.label,
    color: colors.text.ghost,
    fontFamily: t.fonts.mono,
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 280,
  },
  list: { gap: 10 },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  flex1: { flex: 1 },
  eventLabel: {
    fontSize: t.size.tiny,
    color: colors.accent.gold,
    fontFamily: t.fonts.monoMedium,
    letterSpacing: 2,
  },
  timeText: {
    fontSize: t.size.body,
    color: colors.text.secondary,
    fontFamily: t.fonts.bodyBold,
    marginTop: 2,
  },
  locText: {
    fontSize: t.size.label,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
    marginBottom: 6,
  },
  matchPanel: {
    marginTop: 6,
    padding: 12,
    borderRadius: radii.button,
    backgroundColor: 'rgba(74,222,128,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.18)',
  },
  matchHeader: {
    fontSize: t.size.objectName,
    color: colors.accent.green,
    fontFamily: t.fonts.heading,
    fontWeight: '700',
  },
  matchSub: {
    fontSize: t.size.label,
    color: colors.text.secondary,
    fontFamily: t.fonts.mono,
    marginTop: 4,
  },
  pendingText: {
    fontSize: t.size.label,
    color: colors.text.ghost,
    fontFamily: t.fonts.bodyItalic,
    fontStyle: 'italic',
    marginTop: 4,
  },
  hashText: {
    fontSize: t.size.tiny,
    color: colors.text.whisper,
    fontFamily: t.fonts.mono,
    marginTop: 8,
    letterSpacing: 1,
  },
  attribution: {
    fontSize: t.size.tiny,
    color: colors.text.ghost,
    fontFamily: t.fonts.mono,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
