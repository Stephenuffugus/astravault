import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card, SectionLabel } from '@/components/common';
import { useLocation } from '@/services/location';
import { useBortle, useToast } from '@/stores';
import { colors, radii, spacing, typography } from '@/theme/tokens';

interface BortleClass {
  rank: number;
  title: string;
  shortLabel: string;
  description: string;
  color: string;
}

const BORTLE_CLASSES: BortleClass[] = [
  { rank: 1, title: 'Excellent dark sky', shortLabel: 'Class 1', description: 'Zodiacal light, gegenschein, and M33 visible to the unaided eye. The Milky Way casts shadows.', color: '#0E1530' },
  { rank: 2, title: 'Typical truly dark', shortLabel: 'Class 2', description: 'Airglow may be present near the horizon. Summer Milky Way is highly structured.', color: '#1A1F40' },
  { rank: 3, title: 'Rural sky', shortLabel: 'Class 3', description: 'Light-pollution evident on the horizon. M31 and M33 still easy naked-eye.', color: '#202A4D' },
  { rank: 4, title: 'Rural / suburban transition', shortLabel: 'Class 4', description: 'Light domes visible over distant towns. Milky Way still shows structure overhead.', color: '#34355E' },
  { rank: 5, title: 'Suburban sky', shortLabel: 'Class 5', description: 'Milky Way is weak and washed out. Light sources visible in most directions.', color: '#5B4A6B' },
  { rank: 6, title: 'Bright suburban', shortLabel: 'Class 6', description: 'Milky Way only visible near the zenith. M31 marginal.', color: '#7A4F66' },
  { rank: 7, title: 'Suburban / urban transition', shortLabel: 'Class 7', description: 'Whole sky has a grayish-white cast. Milky Way invisible.', color: '#94505E' },
  { rank: 8, title: 'City sky', shortLabel: 'Class 8', description: 'Sky glow is bright orange/gray. Only the brightest constellations recognizable.', color: '#A85459' },
  { rank: 9, title: 'Inner-city sky', shortLabel: 'Class 9', description: 'Only the moon, planets, and a handful of brightest stars are visible.', color: '#C46155' },
];

export default function BortleScreen() {
  const router = useRouter();
  const submit = useBortle((s) => s.submit);
  const showToast = useToast((s) => s.show);
  const { location, status, request } = useLocation();

  const [picked, setPicked] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (picked === null || submitting) return;
    setSubmitting(true);
    let loc = location;
    if (!loc && status !== 'denied') {
      loc = (await request()) ?? null;
    }
    await submit({
      class: picked,
      latitude: loc?.latitude ?? null,
      longitude: loc?.longitude ?? null,
      note: note.trim() ? note.trim() : null,
    });
    showToast('+30 Stardust · Bortle rating banked', 'atp');
    router.back();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Rate Tonight's Sky</Text>
      <Text style={styles.tagline}>
        The Bortle scale (1 = pristine, 9 = inner city) is how astronomers measure
        light pollution. Your reading contributes to a global picture and earns 30 Stardust.
      </Text>

      <Card style={styles.legendCard}>
        <SectionLabel>Bortle Scale</SectionLabel>
        {BORTLE_CLASSES.map((cls) => (
          <Pressable
            key={cls.rank}
            onPress={() => setPicked(cls.rank)}
            accessibilityRole="radio"
            accessibilityState={{ selected: picked === cls.rank }}
            style={({ pressed }) => [
              styles.classRow,
              picked === cls.rank ? styles.classRowActive : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <View style={[styles.classSwatch, { backgroundColor: cls.color }]}>
              <Text style={styles.classRank}>{cls.rank}</Text>
            </View>
            <View style={styles.classBody}>
              <Text
                style={[
                  styles.classTitle,
                  picked === cls.rank ? styles.classTitleActive : null,
                ]}
              >
                {cls.title}
              </Text>
              <Text style={styles.classDescription}>{cls.description}</Text>
            </View>
          </Pressable>
        ))}
      </Card>

      <Card>
        <SectionLabel>Note (optional)</SectionLabel>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Haze, moonlight, scopes used…"
          placeholderTextColor={colors.text.ghost}
          style={styles.noteInput}
          multiline
        />
      </Card>

      <Card>
        <SectionLabel>Location</SectionLabel>
        {location ? (
          <Text style={styles.locText}>
            {location.latitude.toFixed(3)}°, {location.longitude.toFixed(3)}°
            {status === 'restored' ? ' (last known)' : ''}
          </Text>
        ) : (
          <Pressable
            onPress={request}
            style={({ pressed }) => [
              styles.locButton,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text style={styles.locButtonText}>Use current location</Text>
          </Pressable>
        )}
      </Card>

      <Pressable
        onPress={onSubmit}
        disabled={picked === null || submitting}
        style={({ pressed }) => [
          styles.submit,
          picked === null ? styles.submitDisabled : null,
          pressed ? styles.pressed : null,
        ]}
      >
        <Text
          style={[
            styles.submitText,
            picked === null ? styles.submitTextDisabled : null,
          ]}
        >
          {submitting ? 'Submitting…' : 'SUBMIT · +30 ✦'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const t = typography;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBg },
  content: { padding: spacing.pageX, paddingTop: 50, paddingBottom: 60, gap: spacing.sectionGap },
  backLink: { marginBottom: 6 },
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
  },
  legendCard: { gap: 4 },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radii.button,
    gap: 12,
  },
  classRowActive: {
    backgroundColor: 'rgba(96,165,250,0.08)',
  },
  classSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  classRank: {
    color: colors.text.primary,
    fontFamily: t.fonts.monoMedium,
    fontWeight: '700',
    fontSize: 13,
  },
  classBody: { flex: 1 },
  classTitle: {
    fontSize: t.size.body,
    color: colors.text.secondary,
    fontFamily: t.fonts.bodyBold,
    fontWeight: '600',
  },
  classTitleActive: { color: colors.accent.blue },
  classDescription: {
    fontSize: 11,
    color: colors.text.muted,
    fontFamily: t.fonts.body,
    lineHeight: 16,
    marginTop: 2,
  },
  noteInput: {
    minHeight: 70,
    borderRadius: radii.button,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.text.primary,
    fontFamily: t.fonts.body,
    fontSize: 13,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    textAlignVertical: 'top',
  },
  locText: {
    fontSize: t.size.body,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
  },
  locButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.25)',
    backgroundColor: 'rgba(96,165,250,0.06)',
    alignSelf: 'flex-start',
  },
  locButtonText: {
    color: colors.accent.blue,
    fontFamily: t.fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  submit: {
    paddingVertical: 14,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.30)',
    backgroundColor: 'rgba(74,222,128,0.12)',
    alignItems: 'center',
  },
  submitDisabled: {
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  submitText: {
    color: colors.accent.green,
    fontFamily: t.fonts.monoMedium,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  submitTextDisabled: { color: colors.text.dim },
  pressed: { opacity: 0.85 },
});
