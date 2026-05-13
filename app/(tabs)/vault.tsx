/** Astra Vault — Collection screen. */

import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { router } from 'expo-router';
import {
  Pill,
  ProgressBar,
  RarityCard,
  SectionLabel,
} from '@/components/common';
import {
  CATALOG,
  RARITY_META,
  type Category,
  type CelestialObject,
  type Rarity,
} from '@/data/catalog';
import { useCollection } from '@/stores';
import { colors, radii, spacing, typography } from '@/theme/tokens';

const RARITY_KEYS: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const CATEGORY_KEYS: Category[] = ['star', 'nebula', 'galaxy', 'planet', 'cluster'];
const CATEGORY_LABELS: Record<Category, string> = {
  star: 'Star',
  nebula: 'Nebula',
  galaxy: 'Galaxy',
  planet: 'Planet',
  cluster: 'Cluster',
};

const PROGRESS_GRADIENT = ['#60A5FA', '#C084FC', '#FBBF24'];

function formatCollectedDate(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface VaultItem {
  object: CelestialObject;
  collectedAt: number;
}

function VaultScreen(): React.ReactElement {
  const collected = useCollection((s) => s.collected);
  const hydrate = useCollection((s) => s.hydrate);
  const [rarityFilter, setRarityFilter] = useState<Rarity | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const allItems: VaultItem[] = useMemo(() => {
    const out: VaultItem[] = [];
    for (const obj of CATALOG) {
      const entry = collected[obj.id];
      if (entry) out.push({ object: obj, collectedAt: entry.collectedAt });
    }
    out.sort((a, b) => b.collectedAt - a.collectedAt);
    return out;
  }, [collected]);

  const filtered = useMemo(
    () =>
      allItems.filter(({ object }) => {
        if (rarityFilter && object.rarity !== rarityFilter) return false;
        if (categoryFilter && object.category !== categoryFilter) return false;
        return true;
      }),
    [allItems, rarityFilter, categoryFilter],
  );

  const setProgress = useMemo(() => {
    const stats: Record<Category, { have: number; total: number }> = {
      star: { have: 0, total: 0 },
      nebula: { have: 0, total: 0 },
      galaxy: { have: 0, total: 0 },
      planet: { have: 0, total: 0 },
      cluster: { have: 0, total: 0 },
    };
    for (const o of CATALOG) stats[o.category].total += 1;
    for (const item of allItems) stats[item.object.category].have += 1;
    return stats;
  }, [allItems]);

  const renderItem = ({ item }: ListRenderItemInfo<VaultItem>) => (
    <View style={styles.cell}>
      <RarityCard
        rarity={item.object.rarity}
        onPress={() => router.push(`/object/${item.object.id}`)}
      >
        <View style={styles.cardRow}>
          <View style={styles.colorWrap}>
            <View
              style={[
                styles.colorOuter,
                { backgroundColor: item.object.color, shadowColor: item.object.color },
              ]}
            />
            <View style={[styles.colorInner, { backgroundColor: item.object.color }]} />
          </View>
          <View style={styles.cardText}>
            <Text style={styles.name} numberOfLines={1}>
              {item.object.name}
            </Text>
            <Text style={styles.constellation} numberOfLines={1}>
              {item.object.constellation}
            </Text>
          </View>
        </View>
        <Text style={[styles.rarityLabel, { color: RARITY_META[item.object.rarity].color }]}>
          {RARITY_META[item.object.rarity].label}
        </Text>
        <Text style={styles.collectedAt}>COLLECTED {formatCollectedDate(item.collectedAt)}</Text>
      </RarityCard>
    </View>
  );

  const total = CATALOG.length;
  const haveCount = allItems.length;
  const overallProgress = total === 0 ? 0 : haveCount / total;

  const header = (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>VAULT</Text>
        <Text style={styles.headerCount}>{haveCount} / {total}</Text>
      </View>
      <ProgressBar value={overallProgress} gradient={PROGRESS_GRADIENT} />

      <View style={styles.filterGroup}>
        <View style={styles.filterRow}>
          <Pill active={rarityFilter === null} onPress={() => setRarityFilter(null)}>
            All
          </Pill>
          {RARITY_KEYS.map((r) => (
            <Pill
              key={r}
              active={rarityFilter === r}
              accent={RARITY_META[r].color}
              onPress={() => setRarityFilter(rarityFilter === r ? null : r)}
            >
              {RARITY_META[r].label}
            </Pill>
          ))}
        </View>
        <View style={styles.filterRow}>
          {CATEGORY_KEYS.map((c) => (
            <Pill
              key={c}
              active={categoryFilter === c}
              onPress={() => setCategoryFilter(categoryFilter === c ? null : c)}
            >
              {CATEGORY_LABELS[c]}
            </Pill>
          ))}
        </View>
      </View>
    </View>
  );

  const footer = haveCount > 0 ? (
    <View style={styles.setsBlock}>
      <SectionLabel>SET COMPLETION</SectionLabel>
      {CATEGORY_KEYS.map((c) => {
        const s = setProgress[c];
        const pct = s.total === 0 ? 0 : s.have / s.total;
        return (
          <View key={c} style={styles.setRow}>
            <View style={styles.setHeader}>
              <Text style={styles.setLabel}>{CATEGORY_LABELS[c].toUpperCase()} SETS</Text>
              <Text style={styles.setCount}>{s.have} / {s.total}</Text>
            </View>
            <ProgressBar value={pct} color={colors.accent.blue} height={3} />
          </View>
        );
      })}
    </View>
  ) : null;

  return (
    <View style={styles.screen}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.object.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={
          haveCount === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Scan the sky to collect objects</Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No matches for these filters</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBg },
  listContent: { paddingHorizontal: spacing.pageX, paddingVertical: spacing.pageY, gap: spacing.cardGap },
  columnWrapper: { gap: spacing.cardGap },
  cell: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  headerLabel: { fontSize: typography.size.tiny, fontFamily: typography.fonts.mono, color: colors.text.ghost, letterSpacing: typography.letterSpacing.label },
  headerCount: { fontSize: typography.size.button, fontFamily: typography.fonts.monoMedium, color: colors.text.primary, fontWeight: '700' },
  filterGroup: { marginTop: spacing.sectionGap, gap: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  colorWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  colorOuter: { position: 'absolute', width: 24, height: 24, borderRadius: 12, opacity: 0.35, shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  colorInner: { width: 12, height: 12, borderRadius: 6, opacity: 0.95 },
  cardText: { flex: 1, minWidth: 0 },
  name: { fontSize: typography.size.body, fontFamily: typography.fonts.heading, color: colors.text.secondary, fontWeight: '700' },
  constellation: { fontSize: typography.size.tiny, fontFamily: typography.fonts.mono, color: colors.text.muted, marginTop: 2 },
  rarityLabel: { fontSize: typography.size.tiny, fontFamily: typography.fonts.monoMedium, letterSpacing: typography.letterSpacing.label, marginBottom: 4 },
  collectedAt: { fontSize: typography.size.micro, fontFamily: typography.fonts.monoLight, color: colors.text.ghost, letterSpacing: 1 },
  empty: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: typography.size.button, fontFamily: typography.fonts.mono, color: colors.text.whisper, letterSpacing: 1 },
  setsBlock: { marginTop: spacing.sectionGap * 2, padding: spacing.cardPadding, borderRadius: radii.card, backgroundColor: colors.cardBg, borderWidth: 1, borderColor: colors.cardBorder },
  setRow: { marginBottom: 10 },
  setHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  setLabel: { fontSize: typography.size.tiny, fontFamily: typography.fonts.mono, color: colors.text.dim, letterSpacing: typography.letterSpacing.label },
  setCount: { fontSize: typography.size.tiny, fontFamily: typography.fonts.monoMedium, color: colors.text.secondary },
});

export default VaultScreen;
