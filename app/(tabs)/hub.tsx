import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Card, ProgressBar, SectionLabel } from '@/components/common';
import { EVENT_TYPE_COLOR, nextEvent } from '@/data/events2026';
import {
  estimateBortle,
  moonObservingTip,
  moonPhase,
  moonPhaseName,
  observingScore,
  observingScoreLabel,
} from '@/services/astro';
import { fetchApod, type ApodEntry } from '@/services/apis/nasaApod';
import {
  fetchIssPosition,
  isIssOverhead,
  type IssPosition,
} from '@/services/apis/issTracker';
import { useLocation } from '@/services/location';
import { useBortle, useToast } from '@/stores';
import ObservationTimer from '@/components/widgets/ObservationTimer';
import { colors, radii, spacing, typography } from '@/theme/tokens';

type BadgeVariant = 'blue' | 'purple' | 'gold' | 'green' | 'red' | 'neutral';
const EVENT_VARIANT: Record<string, BadgeVariant> = {
  meteor: 'red',
  eclipse: 'purple',
  planetary: 'blue',
  comet: 'green',
  conjunction: 'gold',
};

function countdownLabel(iso: string, now: Date): string {
  const diff = new Date(iso).getTime() - now.getTime();
  if (diff <= 0) return 'Tonight';
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'In 1 day';
  return `In ${days} days`;
}

export default function HubScreen() {
  const showToast = useToast((s) => s.show);
  const now = useMemo(() => new Date(), []);
  const phase = useMemo(() => moonPhase(now), [now]);
  const pct = Math.round(phase.illumination * 100);
  const phaseName = moonPhaseName(phase.illumination);
  const tip = moonObservingTip(phase.illumination);
  const score = observingScore(phase.illumination, true, 0);
  const bortle = estimateBortle(phase.illumination, true, false);
  const scoreLabel = observingScoreLabel(score);

  const event = nextEvent(now);
  const eventVariant: BadgeVariant = event
    ? EVENT_VARIANT[event.type] ?? 'neutral'
    : 'neutral';
  const eventColor = event ? EVENT_TYPE_COLOR[event.type] : colors.accent.blue;
  const moonOverlayStyle = { width: `${100 - pct}%` as const };

  const { location } = useLocation();
  const apod = useApod();
  const iss = useIss();
  const router = useRouter();
  const bortleCount = useBortle((s) => s.reports.length);
  const lastBortle = useBortle((s) => s.reports[0]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card>
        <SectionLabel>Tonight's Conditions</SectionLabel>
        <View style={styles.row}>
          <Text style={styles.scoreNum}>{score}</Text>
          <View style={styles.flex1}>
            <Text style={styles.scoreLabel}>{scoreLabel}</Text>
            <ProgressBar value={score / 100} height={4} color={colors.accent.blue} />
          </View>
        </View>
        <View style={styles.metricsRow}>
          <Metric label="BORTLE" value={String(bortle)} />
          <Metric label="MOON" value={`${pct}%`} />
          <Metric label="PHASE" value={phaseName} small />
        </View>
        <Text style={styles.tip}>{tip}</Text>
      </Card>

      <Card>
        <SectionLabel>Moon Tonight</SectionLabel>
        <View style={styles.moonRow}>
          <View style={styles.moonDisc}>
            <View style={[styles.moonOverlay, moonOverlayStyle]} />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.moonName}>{phaseName}</Text>
            <Text style={styles.moonPct}>{pct}% illuminated</Text>
            <Text style={styles.moonTip}>{tip}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <SectionLabel>Astronomy Picture of the Day</SectionLabel>
        <ApodPanel apod={apod} />
      </Card>

      <Card>
        <SectionLabel>Next Celestial Event</SectionLabel>
        {event ? (
          <View>
            <View style={styles.eventHeader}>
              <Text style={styles.eventIcon}>{event.icon}</Text>
              <View style={styles.flex1}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={[styles.countdown, { color: eventColor }]}>
                  {countdownLabel(event.date, now)}
                </Text>
              </View>
            </View>
            <View style={styles.chipRow}>
              <Badge variant={eventVariant}>{event.type.toUpperCase()}</Badge>
            </View>
            <Text style={styles.eventDesc}>{event.description}</Text>
          </View>
        ) : (
          <Text style={styles.eventDesc}>No upcoming events in 2026.</Text>
        )}
      </Card>

      <Card>
        <SectionLabel>ISS Live Tracker</SectionLabel>
        <IssPanel
          iss={iss}
          location={
            location
              ? { lat: location.latitude, lng: location.longitude }
              : null
          }
        />
      </Card>

      <Pressable
        onPress={() => router.push('/bortle')}
        accessibilityRole="button"
      >
        {({ pressed }) => (
          <Card style={pressed ? styles.pressed : undefined}>
            <SectionLabel color={colors.accent.green}>Citizen Science</SectionLabel>
            <Text style={styles.bortleTitle}>Rate tonight's sky</Text>
            <Text style={styles.bortleSub}>
              {bortleCount === 0
                ? 'Submit a Bortle reading · +30 ATP'
                : `Last rating: Class ${lastBortle?.class ?? '—'} · ${bortleCount} contributed`}
            </Text>
          </Card>
        )}
      </Pressable>

      <ObservationTimer />
    </ScrollView>
  );
}

function Metric({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <View style={styles.flex1}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={small ? styles.metricValSmall : styles.metricVal}>{value}</Text>
    </View>
  );
}

interface ApodState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  entry: ApodEntry | null;
  error: string | null;
}

function useApod(): ApodState {
  const [state, setState] = useState<ApodState>({
    status: 'loading',
    entry: null,
    error: null,
  });
  useEffect(() => {
    let cancelled = false;
    fetchApod()
      .then((entry) => {
        if (!cancelled) setState({ status: 'ready', entry, error: null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'APOD unavailable';
        setState({ status: 'error', entry: null, error: msg });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}

function ApodPanel({ apod }: { apod: ApodState }) {
  if (apod.status === 'loading') {
    return (
      <View style={styles.apod}>
        <View style={styles.shimmer} />
        <Text style={styles.apodSub}>Fetching today's image…</Text>
      </View>
    );
  }
  if (apod.status === 'error' || !apod.entry) {
    return (
      <View style={styles.apod}>
        <Text style={styles.apodTitle}>APOD unavailable offline</Text>
        <Text style={styles.apodSub}>{apod.error ?? 'Will retry next session'}</Text>
      </View>
    );
  }
  const entry = apod.entry;
  return (
    <View>
      {entry.media_type === 'image' ? (
        <Image
          source={{ uri: entry.url }}
          style={styles.apodImage}
          resizeMode="cover"
          accessibilityLabel={entry.title}
        />
      ) : (
        <View style={styles.apodVideoPlaceholder}>
          <Text style={styles.apodSub}>Video — open NASA APOD in browser</Text>
        </View>
      )}
      <Text style={styles.apodTitle}>{entry.title}</Text>
      <Text style={styles.apodSub}>{entry.date}{entry.copyright ? ` · © ${entry.copyright}` : ''}</Text>
      <Text style={styles.apodBody} numberOfLines={4}>
        {entry.explanation}
      </Text>
    </View>
  );
}

interface IssState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  position: IssPosition | null;
  error: string | null;
}

function useIss(): IssState {
  const [state, setState] = useState<IssState>({
    status: 'loading',
    position: null,
    error: null,
  });
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const position = await fetchIssPosition();
        if (!cancelled) setState({ status: 'ready', position, error: null });
      } catch (e: unknown) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'ISS lookup failed';
        setState({ status: 'error', position: null, error: msg });
      }
    };
    void tick();
    const interval = setInterval(() => void tick(), 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
  return state;
}

function IssPanel({
  iss,
  location,
}: {
  iss: IssState;
  location: { lat: number; lng: number } | null;
}) {
  if (iss.status === 'loading') {
    return (
      <View style={styles.issRow}>
        <View style={styles.issDot} />
        <Text style={styles.issText}>Locating Station…</Text>
      </View>
    );
  }
  if (iss.status === 'error' || !iss.position) {
    return (
      <View style={styles.issRow}>
        <View style={[styles.issDot, styles.issDotErr]} />
        <Text style={styles.issText}>Station offline</Text>
      </View>
    );
  }
  const p = iss.position;
  const overhead = location ? isIssOverhead(location, p) : null;
  return (
    <View>
      <View style={styles.issRow}>
        <View
          style={[
            styles.issDot,
            { backgroundColor: overhead ? colors.accent.green : colors.accent.blue },
          ]}
        />
        <Text style={styles.issText}>
          {p.latitude.toFixed(2)}°, {p.longitude.toFixed(2)}° · {Math.round(p.altitudeKm)} km · {p.visibility}
        </Text>
      </View>
      <Text style={styles.issSub}>
        {location == null
          ? 'Enable location to see if it is overhead'
          : overhead
            ? 'Within sight horizon right now'
            : 'Below your horizon — wait for next pass'}
      </Text>
    </View>
  );
}

const t = typography;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBg },
  content: { padding: spacing.pageX, gap: spacing.sectionGap },
  flex1: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  scoreNum: {
    fontSize: t.size.dataLarge,
    color: colors.text.primary,
    fontFamily: t.fonts.headingDisplay,
  },
  scoreLabel: {
    fontSize: t.size.body,
    color: colors.text.secondary,
    fontFamily: t.fonts.bodyBold,
    marginBottom: 6,
  },
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  metricLabel: {
    fontSize: t.size.tiny,
    color: colors.text.label,
    fontFamily: t.fonts.mono,
    letterSpacing: t.letterSpacing.label,
    marginBottom: 2,
  },
  metricVal: {
    fontSize: t.size.dataMedium,
    color: colors.accent.blue,
    fontFamily: t.fonts.monoMedium,
  },
  metricValSmall: {
    fontSize: t.size.body,
    color: colors.text.primary,
    fontFamily: t.fonts.bodyBold,
  },
  tip: {
    fontSize: t.size.lore,
    color: colors.text.muted,
    fontFamily: t.fonts.bodyItalic,
    fontStyle: 'italic',
  },
  moonRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  moonDisc: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFAD9',
    borderWidth: 1,
    borderColor: 'rgba(255,250,220,0.2)',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  moonOverlay: { height: '100%', backgroundColor: '#1E1E32', opacity: 0.85 },
  moonName: {
    fontSize: t.size.objectName,
    color: colors.text.primary,
    fontFamily: t.fonts.heading,
  },
  moonPct: {
    fontSize: t.size.label,
    color: colors.text.label,
    fontFamily: t.fonts.mono,
    marginTop: 2,
  },
  moonTip: {
    fontSize: t.size.lore,
    color: colors.text.muted,
    fontFamily: t.fonts.bodyItalic,
    fontStyle: 'italic',
    marginTop: 4,
  },
  apod: { alignItems: 'center', paddingVertical: 18, gap: 8 },
  shimmer: {
    width: '60%',
    height: 6,
    borderRadius: radii.progressBar,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  apodImage: {
    width: '100%',
    height: 200,
    borderRadius: radii.card,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginBottom: 10,
  },
  apodVideoPlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: radii.card,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  apodTitle: {
    fontSize: t.size.body,
    color: colors.text.primary,
    fontFamily: t.fonts.heading,
    marginBottom: 2,
  },
  apodSub: {
    fontSize: t.size.label,
    color: colors.text.ghost,
    fontFamily: t.fonts.mono,
    letterSpacing: t.letterSpacing.label,
    marginBottom: 6,
  },
  apodBody: {
    fontSize: t.size.lore,
    color: colors.text.muted,
    fontFamily: t.fonts.body,
    lineHeight: t.size.lore * t.lineHeight.lore,
  },
  eventHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  eventIcon: { fontSize: 32 },
  eventName: {
    fontSize: t.size.objectName,
    color: colors.text.primary,
    fontFamily: t.fonts.heading,
  },
  countdown: {
    fontSize: t.size.label,
    fontFamily: t.fonts.monoMedium,
    letterSpacing: t.letterSpacing.label,
    marginTop: 2,
  },
  chipRow: { flexDirection: 'row', marginBottom: 8 },
  eventDesc: {
    fontSize: t.size.lore,
    color: colors.text.muted,
    fontFamily: t.fonts.body,
    lineHeight: t.size.lore * t.lineHeight.lore,
  },
  issRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  issDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent.blue },
  issDotErr: { backgroundColor: colors.accent.red },
  issText: {
    fontSize: t.size.body,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
  },
  issSub: {
    fontSize: t.size.label,
    color: colors.text.ghost,
    fontFamily: t.fonts.mono,
    marginTop: 6,
  },
  pressed: { opacity: 0.7 },
  timerTitle: {
    fontSize: t.size.objectName,
    color: colors.accent.gold,
    fontFamily: t.fonts.heading,
    marginBottom: 4,
  },
  timerSub: {
    fontSize: t.size.label,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
    letterSpacing: t.letterSpacing.label,
  },
  bortleTitle: {
    fontSize: t.size.objectName,
    color: colors.accent.green,
    fontFamily: t.fonts.heading,
    marginBottom: 4,
  },
  bortleSub: {
    fontSize: t.size.label,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
    letterSpacing: t.letterSpacing.label,
  },
});
