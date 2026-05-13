import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CATALOG,
  CATEGORY_ICONS,
  RARITY_META,
  atpFor,
} from '@/data/catalog';
import { formatDec, formatRA } from '@/services/astro';
import { Card, SectionLabel } from '@/components/common';
import { useCollection, useToast } from '@/stores';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export default function ObjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const collect = useCollection((s) => s.collect);
  const isCollected = useCollection((s) => s.isCollected);
  const showToast = useToast((s) => s.show);

  const object = CATALOG.find((o) => o.id === id);

  if (!object) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Object not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  const rarity = RARITY_META[object.rarity];
  const collected = isCollected(object.id);

  const onCollect = async () => {
    const added = await collect(object);
    if (added) showToast(`+${atpFor(object.rarity)} ATP — ${object.name}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Pressable onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
      </Pressable>

      <Text style={[styles.rarityLabel, { color: rarity.color }]}>
        {CATEGORY_ICONS[object.category]}  {rarity.label}
      </Text>
      <Text style={styles.name}>{object.name}</Text>
      <Text style={styles.constellation}>
        {object.constellation === '—' ? 'Solar System' : object.constellation}
      </Text>

      <Card style={styles.descriptionCard}>
        <Text style={styles.description}>{object.description}</Text>
      </Card>

      <SectionLabel>Coordinates & Data</SectionLabel>
      <Card style={styles.dataCard}>
        <DataRow label="Magnitude" value={object.magnitude.toFixed(2)} />
        <DataRow
          label="Distance"
          value={
            object.category === 'planet'
              ? `${object.distance.toExponential(1)} AU`
              : object.distance > 1000
                ? `${(object.distance / 1000).toFixed(1)} kly`
                : `${object.distance} ly`
          }
        />
        <DataRow label="Right Ascension" value={formatRA(object.ra)} />
        <DataRow label="Declination" value={formatDec(object.dec)} />
        <DataRow label="ATP Reward" value={`+${atpFor(object.rarity)}`} />
      </Card>

      {!collected ? (
        <Pressable
          onPress={onCollect}
          style={[
            styles.collectButton,
            {
              backgroundColor: rarity.color + '1F',
              borderColor: rarity.color + '55',
            },
          ]}
        >
          <Text style={[styles.collectText, { color: rarity.color }]}>
            + COLLECT · {atpFor(object.rarity)} ATP
          </Text>
        </Pressable>
      ) : (
        <View style={[styles.collectButton, styles.collectedButton]}>
          <Text style={[styles.collectText, { color: colors.accent.green }]}>
            ✓ IN VAULT
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

interface DataRowProps {
  label: string;
  value: string;
}

const DataRow: React.FC<DataRowProps> = ({ label, value }) => (
  <View style={styles.dataRow}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scroll: { padding: spacing.pageX, paddingTop: 50, paddingBottom: 60 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: {
    color: colors.text.muted,
    fontFamily: typography.fonts.mono,
    fontSize: 13,
    marginBottom: 16,
  },
  backLink: { marginBottom: 12 },
  backLinkText: {
    color: 'rgba(96,165,250,0.7)',
    fontFamily: typography.fonts.mono,
    fontSize: 12,
  },
  rarityLabel: {
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: typography.fonts.mono,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    color: colors.text.primary,
    fontFamily: typography.fonts.heading,
    fontWeight: '700',
  },
  constellation: {
    fontSize: 12,
    color: colors.text.muted,
    fontFamily: typography.fonts.mono,
    letterSpacing: 1,
    marginBottom: 14,
    marginTop: 2,
  },
  descriptionCard: { marginBottom: 18 },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.muted,
    fontFamily: typography.fonts.body,
  },
  dataCard: { marginBottom: 20 },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  dataLabel: {
    fontSize: 11,
    color: colors.text.ghost,
    fontFamily: typography.fonts.mono,
    letterSpacing: 1,
  },
  dataValue: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: typography.fonts.mono,
    fontWeight: '600',
  },
  collectButton: {
    padding: 14,
    borderRadius: radii.button,
    borderWidth: 1,
    alignItems: 'center',
  },
  collectedButton: {
    backgroundColor: 'rgba(74,222,128,0.06)',
    borderColor: 'rgba(74,222,128,0.18)',
  },
  collectText: {
    fontSize: 12,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
