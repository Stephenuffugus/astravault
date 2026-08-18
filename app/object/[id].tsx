import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CATALOG,
  CATEGORY_ICONS,
  RARITY_META,
  atpFor,
} from '@/data/catalog';
import { formatDec, formatRA } from '@/services/astro';
import { Card, Pill, SectionLabel } from '@/components/common';
import {
  SURVEYS,
  defaultSurvey,
  skyViewImageUrl,
  type SkyViewSurvey,
} from '@/services/apis/skyView';
import { hipsSurveyForSkyViewApiName } from '@/services/apis/hipsSurveys';
import { AladinSky } from '@/components/sky/AladinSky';
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
  const isPlanet = object.category === 'planet';

  const [activeSurvey, setActiveSurvey] = useState<SkyViewSurvey>(defaultSurvey);
  const [imageLoading, setImageLoading] = useState(true);
  const [deepZoom, setDeepZoom] = useState(false);

  const hipsSurvey = useMemo(
    () => hipsSurveyForSkyViewApiName(activeSurvey.apiName),
    [activeSurvey.apiName]
  );

  const skyViewUri = useMemo(
    () =>
      skyViewImageUrl({
        ra: object.ra,
        dec: object.dec,
        surveyApiName: activeSurvey.apiName,
      }),
    [object.ra, object.dec, activeSurvey.apiName]
  );

  const onCollect = async () => {
    const added = await collect(object);
    if (added) showToast(`+${atpFor(object.rarity)} Stardust · ${object.name}`);
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

      {!isPlanet && (
        <>
          <SectionLabel>MULTI-SPECTRUM VIEW</SectionLabel>
          <Card style={styles.spectrumCard}>
            {deepZoom ? (
              <AladinSky
                ra={object.ra}
                dec={object.dec}
                survey={hipsSurvey.id}
                accentColor={activeSurvey.accentColor}
                height={280}
              />
            ) : (
              <View
                style={[
                  styles.spectrumImageWrap,
                  { borderColor: activeSurvey.accentColor + '33' },
                ]}
              >
                <Image
                  key={skyViewUri}
                  source={{ uri: skyViewUri }}
                  style={[
                    styles.spectrumImage,
                    imageLoading ? styles.spectrumImageLoading : null,
                  ]}
                  resizeMode="cover"
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  accessibilityLabel={`${object.name} in ${activeSurvey.label} (${activeSurvey.apiName})`}
                />
              </View>
            )}

            <View style={styles.spectrumPillRow}>
              {SURVEYS.map((s) => (
                <Pill
                  key={s.id}
                  active={s.id === activeSurvey.id}
                  accent={s.accentColor}
                  onPress={() => setActiveSurvey(s)}
                >
                  {s.label}
                </Pill>
              ))}
            </View>

            <Pressable
              onPress={() => setDeepZoom((v) => !v)}
              style={[
                styles.deepZoomToggle,
                {
                  borderColor: activeSurvey.accentColor + (deepZoom ? '66' : '22'),
                  backgroundColor: deepZoom
                    ? activeSurvey.accentColor + '14'
                    : 'transparent',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                deepZoom
                  ? 'Switch back to static multi-spectrum image'
                  : 'Open interactive Aladin Lite deep zoom view'
              }
            >
              <Text
                style={[
                  styles.deepZoomLabel,
                  { color: deepZoom ? activeSurvey.accentColor : colors.text.muted },
                ]}
              >
                {deepZoom ? '▴  DEEP ZOOM (ALADIN) · ON' : '▾  DEEP ZOOM (ALADIN)'}
              </Text>
            </Pressable>

            <Text style={styles.spectrumCaption}>
              {deepZoom
                ? `${hipsSurvey.spectrum} · HiPS ${hipsSurvey.id} · ${hipsSurvey.attribution}`
                : `${activeSurvey.spectrum} · ${activeSurvey.apiName}`}
            </Text>
          </Card>
        </>
      )}

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
  spectrumCard: { marginBottom: 18 },
  spectrumImageWrap: {
    width: '100%',
    height: 280,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    marginBottom: 12,
  },
  spectrumImage: {
    width: '100%',
    height: '100%',
  },
  spectrumImageLoading: {
    opacity: 0.25,
  },
  spectrumPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  deepZoomToggle: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginBottom: 10,
  },
  deepZoomLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.monoMedium,
    letterSpacing: 1.5,
  },
  spectrumCaption: {
    fontSize: 11,
    color: colors.text.ghost,
    fontFamily: typography.fonts.mono,
    letterSpacing: 1,
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
